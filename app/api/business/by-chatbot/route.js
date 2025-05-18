// app/api/businesses/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json();
    const { 
      name, 
      description, 
      industry, 
      services, 
      features, 
      hours, 
      location, 
      website, 
      chatbotId,
      aiSettings
    } = data;
    
    // Check if business with this chatbotId exists
    const existingBusiness = await prisma.business.findUnique({
      where: { chatbotId }
    });
    
    let business;
    
    if (existingBusiness) {
      // Update existing business
      business = await prisma.business.update({
        where: { id: existingBusiness.id },
        data: {
          name,
          description,
          industry,
          services,
          features,
          hours,
          location,
          website
        }
      });
      
      // Store AI settings in a separate table or as JSON field
      // For this example, we'll assume adding it to metadata field
      await prisma.businessMetadata.upsert({
        where: { businessId: business.id },
        update: { 
          aiSettings: JSON.stringify(aiSettings)
        },
        create: {
          businessId: business.id,
          aiSettings: JSON.stringify(aiSettings)
        }
      });
    } else {
      // Create new business
      business = await prisma.business.create({
        data: {
          name,
          description,
          industry,
          services,
          features,
          hours,
          location,
          website,
          chatbotId,
          metadata: {
            create: {
              aiSettings: JSON.stringify(aiSettings)
            }
          }
        }
      });
    }
    
    return NextResponse.json({ 
      success: true,
      business
    });
  } catch (error) {
    console.error('Error in business API:', error);
    
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Error processing business data" 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const chatbotId = searchParams.get('chatbotId');
  
  if (!chatbotId) {
    return NextResponse.json({
      success: false,
      message: 'Missing chatbotId parameter'
    }, { status: 400 });
  }
  
  try {
    const business = await prisma.business.findUnique({
      where: { chatbotId },
      include: {
        metadata: true
      }
    });
    
    if (!business) {
      return NextResponse.json({
        success: false,
        message: 'Business not found'
      }, { status: 404 });
    }
    
    // Parse AI settings if they exist
    let aiSettings = {};
    if (business.metadata?.aiSettings) {
      try {
        aiSettings = JSON.parse(business.metadata.aiSettings);
      } catch (e) {
        console.error('Error parsing AI settings:', e);
      }
    }
    
    // Include AI settings in response
    business.aiSettings = aiSettings;
    
    return NextResponse.json({
      success: true,
      business
    });
  } catch (error) {
    console.error('Error fetching business:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error fetching business'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}