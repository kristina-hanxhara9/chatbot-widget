import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildDocumentContext } from "./document-processing";
import { getBusiness } from "./db";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateChatResponse(message, sessionId, chatbotId) {
  try {
    // Get business information
    const business = await getBusiness(chatbotId);
    
    if (!business) {
      return {
        message: "Business not found. Please check your chatbot ID.",
        success: false
      };
    }
    
    // Build context from relevant documents
    const documentContext = await buildDocumentContext(message, business.id);
    
    // Create business context
    const businessContext = `
Business Name: ${business.name}
Industry: ${business.industry}
Description: ${business.description || ""}
Services: ${business.services.join(", ")}
Features: ${business.features.join(", ")}
Hours: ${business.hours || "Not specified"}
Location: ${business.location || "Not specified"}
    `.trim();

    // Create prompt with context
    const prompt = `
You are an AI assistant for ${business.name}, a ${business.industry}.
Use a friendly, helpful tone and provide accurate information about the business.

BUSINESS INFORMATION:
${businessContext}

${documentContext ? `RELEVANT DOCUMENTS FROM ${business.name.toUpperCase()}:\n${documentContext}` : ""}

If the user asks about booking an appointment, explain the available services and ask for their preferred date and time.
If the user asks about business hours, services, or location, provide accurate information from the business context.
If you don't know the answer to a question, politely say so and offer to connect them with a human representative.

Do not make up information that is not in the provided context.
Keep responses concise but complete.

User message: ${message}
    `.trim();

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate response from Gemini
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    return {
      message: response,
      success: true
    };
  } catch (error) {
    console.error("Error generating chat response:", error);
    return {
      message: "I'm sorry, I encountered an error processing your request. Please try again later.",
      success: false
    };
  }
}

export async function processAppointmentRequest(message, sessionId, chatbotId) {
  try {
    // Get business information
    const business = await getBusiness(chatbotId);
    
    if (!business) {
      return {
        message: "Business not found. Please check your chatbot ID.",
        success: false
      };
    }
    
    // Simple prompt to extract appointment details
    const prompt = `
Extract appointment booking details from the following user message. If any information is missing, indicate "missing".
Return the response in JSON format with these fields:
{
  "intent": "book_appointment" or "not_appointment",
  "service": "the requested service",
  "date": "YYYY-MM-DD format if provided",
  "time": "HH:MM format if provided",
  "name": "customer name if provided",
  "phone": "phone number if provided",
  "email": "email if provided"
}

Business Services Available: ${business.services.join(", ")}

User message: ${message}
    `.trim();

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate extraction from Gemini
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    try {
      // Try to parse JSON from the response
      const appointmentDetails = JSON.parse(responseText);
      
      return {
        appointmentDetails,
        success: true
      };
    } catch (error) {
      console.error("Error parsing appointment details:", error);
      return {
        message: "I couldn't understand the appointment details. Could you provide more information?",
        success: false
      };
    }
  } catch (error) {
    console.error("Error processing appointment request:", error);
    return {
      message: "I'm sorry, I encountered an error processing your appointment request. Please try again later.",
      success: false
    };
  }
}