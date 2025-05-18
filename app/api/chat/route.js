import { generateChatResponse, processAppointmentRequest } from "@/lib/chat";
import { saveConversation } from "@/lib/db";

export async function POST(req) {
  try {
    const { message, sessionId, chatbotId, metadata } = await req.json();

    if (!message || !sessionId || !chatbotId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Save user message to database
    await saveConversation({
      sessionId,
      businessId: chatbotId,
      role: 'user',
      content: message
    });

    // Check if this is an appointment request
    const appointmentData = await processAppointmentRequest(message, sessionId, chatbotId);
    
    let response;
    
    if (appointmentData.success && appointmentData.appointmentDetails?.intent === 'book_appointment') {
      // Handle as an appointment request
      response = {
        success: true,
        message: "I'd be happy to help you book an appointment. Please provide your details.",
        isAppointment: true
      };
    } else {
      // Regular chat response
      response = await generateChatResponse(message, sessionId, chatbotId);
    }

    // Save assistant response to database
    await saveConversation({
      sessionId,
      businessId: chatbotId,
      role: 'assistant',
      content: response.message
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: "I'm sorry, I encountered an error. Please try again later." 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}