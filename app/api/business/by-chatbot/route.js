import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      where: { chatbotId }
    });
    
    if (!business) {
      return NextResponse.json({
        success: false,
        message: 'Business not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      businessId: business.id
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