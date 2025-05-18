#!/usr/bin/env node

// This script creates a new business chatbot
// Run with: npm run create-business

const { PrismaClient } = require('@prisma/client');
const readline = require('readline');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const promptQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const promptList = (question) => {
    return new Promise((resolve) => {
      rl.question(question + ' (comma separated): ', (answer) => {
        resolve(answer.split(',').map(item => item.trim()).filter(Boolean));
      });
    });
  };
  
  async function createBusiness() {
    try {
      console.log('📣 Creating a new business chatbot...\n');
      
      const name = await promptQuestion('Business Name: ');
      const description = await promptQuestion('Business Description: ');
      const industry = await promptQuestion('Industry (e.g., dental, restaurant, salon): ');
      const services = await promptList('Services offered');
      const features = await promptList('Special features');
      const hours = await promptQuestion('Business Hours (e.g., Mon-Fri 9-5): ');
      const location = await promptQuestion('Business Location: ');
      const website = await promptQuestion('Business Website (optional): ');
      
      // Generate a unique chatbot ID
      const chatbotId = `chatbot_${uuidv4().split('-')[0]}`;
      
      // Create the business in the database
      const business = await prisma.business.create({
        data: {
          name,
          description,
          industry,
          services,
          features,
          hours,
          location,
          website: website || null,
          chatbotId
        }
      });
      
      console.log('\n✅ Business created successfully!');
      console.log('\nCHATBOT ID: ' + chatbotId);
      console.log('\nUse this ID to identify your chatbot when uploading documents or embedding on your website.');
      console.log('\nEmbed code:');
      console.log(`
  <script src="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/widget/chatbot.js"></script>
  <script>
    window.initializeChatWidget({
      chatbotId: "${chatbotId}",
      theme: "light",
      position: "right",
      businessName: "${name}",
      primaryColor: "#6366f1",
      welcomeMessage: "Hi there! How can I help you today?"
    });
  </script>
      `);
      
      // Add a welcome document
      const welcomeDocumentContent = `
  # ${name} Information
  
  ## About Us
  ${description}
  
  ## Services
  ${services.map(service => `- ${service}`).join('\n')}
  
  ## Special Features
  ${features.map(feature => `- ${feature}`).join('\n')}
  
  ## Business Hours
  ${hours}
  
  ## Location
  ${location}
  
  ## Website
  ${website || 'Not provided'}
      `.trim();
      
      await prisma.document.create({
        data: {
          name: 'Business Information',
          content: welcomeDocumentContent,
          businessId: business.id
        }
      });
      
      console.log('\nA basic information document has been created for your chatbot.');
      console.log('Next steps:');
      console.log('1. Upload additional documents at /upload');
      console.log('2. Test your chatbot at /demo');
      console.log('3. Embed the code on your website');
      
    } catch (error) {
      console.error('❌ Error creating business:', error);
    } finally {
      await prisma.$disconnect();
      rl.close();
    }
  }
  
  createBusiness();