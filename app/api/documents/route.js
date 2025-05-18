import { NextResponse } from 'next/server';
import { processDocument } from '@/lib/document-processing';
import { saveDocument, getBusiness } from '@/lib/db';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const chatbotId = formData.get('chatbotId');
    
    if (!file || !chatbotId) {
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
    
    // Extract file content as text
    const fileContent = await file.text();
    const fileName = file.name;
    
    // Save document to database
    const document = await saveDocument({
      name: fileName,
      content: fileContent,
      businessId: business.id
    });
    
    // Process document with LangChain
    await processDocument(fileContent, {
      businessId: business.id,
      documentId: document.id,
      source: fileName
    });
    
    return NextResponse.json({ 
      success: true, 
      documentId: document.id,
      message: 'Document uploaded and processed successfully' 
    });
  } catch (error) {
    console.error('Error in document upload API:', error);
    
    return NextResponse.json({ 
      success: false, 
      message: 'Error processing document' 
    }, { status: 500 });
  }
}