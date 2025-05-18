// app/api/appointments/route.js

import { NextResponse } from 'next/server';
import { createAppointment, getBusiness } from '@/lib/db';
import { sendAppointmentConfirmation } from '@/lib/email-service';

export async function POST(req) {
  try {
    const { 
      chatbotId,
      sessionId,
      customerName,
      customerEmail,
      customerPhone,
      date,
      time,
      serviceName,
      notes
    } = await req.json();

    if (!chatbotId || !sessionId || !customerName || (!customerEmail && !customerPhone)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields' 
      }, { status: 400 });
    }

    // Get business ID from chatbot ID
    const business = await getBusiness(chatbotId);
    
    if (!business) {
      return NextResponse.json({ 
        success: false, 
        message: 'Business not found' 
      }, { status: 404 });
    }

    // Find the matching service if serviceName is provided
    let serviceId = null;
    let duration = 30; // Default duration in minutes

    if (serviceName) {
      // Find the closest matching service by name
      const service = business.services.find(s => 
        s.name.toLowerCase().includes(serviceName.toLowerCase()) ||
        serviceName.toLowerCase().includes(s.name.toLowerCase())
      );

      if (service) {
        serviceId = service.id;
        duration = service.duration;
      }
    }

    // Parse date and time
    const appointmentDate = new Date(date);
    if (time) {
      const [hours, minutes] = time.split(':').map(num => parseInt(num));
      appointmentDate.setHours(hours, minutes, 0, 0);
    }

    // Calculate end time
    const endTime = new Date(appointmentDate);
    endTime.setMinutes(endTime.getMinutes() + duration);

    // Create appointment record
    const appointment = await createAppointment({
      businessId: business.id,
      customerName,
      customerEmail: customerEmail || null,
      customerPhone: customerPhone || null,
      date: appointmentDate,
      endTime,
      duration,
      serviceId,
      notes: notes || null,
      status: 'scheduled'
    });

    // Send confirmation email if email provided
    if (customerEmail) {
      await sendAppointmentConfirmation({
        to: customerEmail,
        appointment,
        business,
        service: serviceId ? { name: serviceName, duration } : { name: "Consultation", duration }
      });
    }

    return NextResponse.json({ 
      success: true, 
      appointmentId: appointment.id,
      message: 'Appointment scheduled successfully',
      details: {
        date: appointmentDate,
        serviceName: serviceName || "Consultation",
        customerName
      }
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    
    return NextResponse.json({ 
      success: false, 
      message: 'Error booking appointment' 
    }, { status: 500 });
  }
}