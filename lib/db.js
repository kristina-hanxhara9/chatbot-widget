// lib/db.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createBusiness(businessData) {
  return prisma.business.create({
    data: businessData
  });
}

export async function getBusiness(chatbotId) {
  return prisma.business.findUnique({
    where: { chatbotId },
    include: {
      documents: true
    }
  });
}

export async function updateBusiness(id, businessData) {
  return prisma.business.update({
    where: { id },
    data: businessData
  });
}

export async function getAvailableAppointmentSlots(businessId, date) {
  // First, get all booked appointments for the date
  const bookedAppointments = await prisma.appointment.findMany({
    where: {
      businessId,
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999)),
      },
      status: "scheduled"
    },
    select: {
      time: true,
      duration: true
    }
  });

  // Get business hours
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { hours: true }
  });

  // Parse business hours for the day
  // This is simplified - you'll need to add logic to parse different hour formats
  const businessHours = business?.hours || "9:00-17:00"; // Default 9-5
  
  // Parse start and end times
  const [startTime, endTime] = businessHours.split('-');
  const startHour = parseInt(startTime.split(':')[0]);
  const endHour = parseInt(endTime.split(':')[0]);
  
  // Generate all possible slots (e.g., every 30 minutes)
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  
  // Remove booked slots
  const availableSlots = slots.filter(slot => {
    const [slotHour, slotMinute] = slot.split(':').map(num => parseInt(num));
    
    // Check if slot overlaps with any booked appointment
    return !bookedAppointments.some(appointment => {
      const [appHour, appMinute] = appointment.time.split(':').map(num => parseInt(num));
      const appEndMinutes = appHour * 60 + appMinute + appointment.duration;
      const slotMinutes = slotHour * 60 + slotMinute;
      
      return (slotMinutes >= (appHour * 60 + appMinute)) && 
             (slotMinutes < appEndMinutes);
    });
  });
  
  return availableSlots;
}

export async function createAppointment(appointmentData) {
  return prisma.appointment.create({
    data: appointmentData
  });
}

export async function saveDocument(documentData) {
  return prisma.document.create({
    data: documentData
  });
}

export async function saveConversation(conversationData) {
  // Check if conversation exists
  const existingConversation = await prisma.conversation.findUnique({
    where: { sessionId: conversationData.sessionId }
  });

  if (existingConversation) {
    // Add message to existing conversation
    return prisma.message.create({
      data: {
        role: conversationData.role,
        content: conversationData.content,
        conversationId: existingConversation.id
      }
    });
  } else {
    // Create new conversation with first message
    return prisma.conversation.create({
      data: {
        sessionId: conversationData.sessionId,
        businessId: conversationData.businessId,
        messages: {
          create: [{
            role: conversationData.role,
            content: conversationData.content
          }]
        }
      }
    });
  }
}

export async function getConversation(sessionId) {
  return prisma.conversation.findUnique({
    where: { sessionId },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  });
}