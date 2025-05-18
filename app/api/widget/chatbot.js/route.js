import { NextResponse } from 'next/server';

export async function GET(req) {
  // Set correct content type for JavaScript
  const headers = {
    'Content-Type': 'application/javascript',
    'Cache-Control': 'max-age=3600, s-maxage=3600'
  };

  // Widget code that will be injected into client sites
  const script = `
    (function() {
      // Chatbot Widget Configuration
      let config = {
        chatbotId: '',
        theme: 'light',
        position: 'right',
        businessName: 'Business Assistant',
        primaryColor: '#6366f1',
        welcomeMessage: 'Hi there! How can I assist you today?',
        // Add default businessDetails
        businessDetails: {
          description: '',
          industry: 'retail',
          services: [],
          features: [],
          hours: 'Monday-Friday: 9AM-5PM',
          location: '',
          website: ''
        },
        // Add default aiPersonality
        aiPersonality: {
          personality: 'friendly',
          isDetailed: false,
          isConcise: true,
          askFollowUp: true,
          isEmpathetic: true,
          knowledgeFocus: 'balanced',
          useCustomPrompt: false,
          customPrompt: ''
        }
      };
      
      // Store references to chatbot elements
      let widgetContainer = null;
      let styleElement = null;
      let sessionId = null;
      
      // Root URL for the chatbot API (current domain)
      const rootUrl = '${req.nextUrl.origin}';
      
      // Initialize the chatbot widget
      window.initializeChatWidget = function(userConfig) {
        // Merge user config with defaults
        if (userConfig) {
          // Handle nested objects properly
          if (userConfig.businessDetails) {
            config.businessDetails = {
              ...config.businessDetails,
              ...userConfig.businessDetails
            };
            
            // Ensure services and features are arrays
            if (typeof config.businessDetails.services === 'string') {
              config.businessDetails.services = [config.businessDetails.services];
            }
            
            if (typeof config.businessDetails.features === 'string') {
              config.businessDetails.features = [config.businessDetails.features];
            }
            
            // Delete businessDetails from userConfig to avoid duplication
            delete userConfig.businessDetails;
          }
          
          if (userConfig.aiPersonality) {
            config.aiPersonality = {
              ...config.aiPersonality,
              ...userConfig.aiPersonality
            };
            
            // Delete aiPersonality from userConfig to avoid duplication
            delete userConfig.aiPersonality;
          }
          
          // Merge remaining config
          config = { ...config, ...userConfig };
        }
        
        // Generate or retrieve session ID
        sessionId = getSessionId();
        
        // Create CSS styles
        injectStyles();
        
        // Create widget container if it doesn't exist
        if (!widgetContainer) {
          widgetContainer = document.createElement('div');
          widgetContainer.id = 'chatbot-widget-root';
          document.body.appendChild(widgetContainer);
          
          // Create widget button
          const widgetButton = document.createElement('button');
          widgetButton.id = 'chatbot-widget-button';
          widgetButton.classList.add('chatbot-widget-button');
          widgetButton.classList.add(\`chatbot-widget-\${config.position}\`);
          widgetButton.style.backgroundColor = config.primaryColor;
          widgetButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>';
          widgetButton.onclick = toggleChatWidget;
          widgetContainer.appendChild(widgetButton);
          
          // Create chat container
          const chatContainer = document.createElement('div');
          chatContainer.id = 'chatbot-widget-container';
          chatContainer.classList.add('chatbot-widget-container');
          chatContainer.classList.add(\`chatbot-widget-\${config.position}\`);
          chatContainer.classList.add('chatbot-widget-hidden');
          chatContainer.classList.add(\`chatbot-widget-theme-\${config.theme}\`);
          
          // Create chat header
          const chatHeader = document.createElement('div');
          chatHeader.classList.add('chatbot-widget-header');
          chatHeader.style.backgroundColor = config.primaryColor;
          
          const headerTitle = document.createElement('h3');
          headerTitle.textContent = config.businessName;
          
          const closeButton = document.createElement('button');
          closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
          closeButton.onclick = toggleChatWidget;
          
          chatHeader.appendChild(headerTitle);
          chatHeader.appendChild(closeButton);
          
          // Create chat messages container
          const messagesContainer = document.createElement('div');
          messagesContainer.id = 'chatbot-widget-messages';
          messagesContainer.classList.add('chatbot-widget-messages');
          
          // Add welcome message
          const welcomeMessageElement = document.createElement('div');
          welcomeMessageElement.classList.add('chatbot-widget-message');
          welcomeMessageElement.classList.add('chatbot-widget-message-assistant');
          welcomeMessageElement.textContent = config.welcomeMessage;
          messagesContainer.appendChild(welcomeMessageElement);
          
          // Create chat input
          const inputContainer = document.createElement('div');
          inputContainer.classList.add('chatbot-widget-input-container');
          
          const input = document.createElement('input');
          input.type = 'text';
          input.id = 'chatbot-widget-input';
          input.placeholder = 'Type your message...';
          input.onkeypress = function(e) {
            if (e.key === 'Enter') {
              sendMessage();
            }
          };
          
          const sendButton = document.createElement('button');
          sendButton.id = 'chatbot-widget-send';
          sendButton.style.backgroundColor = config.primaryColor;
          sendButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>';
          sendButton.onclick = sendMessage;
          
          inputContainer.appendChild(input);
          inputContainer.appendChild(sendButton);
          
          // Assemble chat container
          chatContainer.appendChild(chatHeader);
          chatContainer.appendChild(messagesContainer);
          chatContainer.appendChild(inputContainer);
          
          widgetContainer.appendChild(chatContainer);
        }
      };
      
      // Generate unique session ID or get existing one
      function getSessionId() {
        const storageKey = 'chatbot_session_id';
        let sessionId = localStorage.getItem(storageKey);
        
        if (!sessionId) {
          sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
          localStorage.setItem(storageKey, sessionId);
        }
        
        return sessionId;
      }
      
      // Toggle chat widget visibility
      function toggleChatWidget() {
        const button = document.getElementById('chatbot-widget-button');
        const chat = document.getElementById('chatbot-widget-container');
        
        if (chat.classList.contains('chatbot-widget-hidden')) {
          chat.classList.remove('chatbot-widget-hidden');
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
        } else {
          chat.classList.add('chatbot-widget-hidden');
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>';
        }
      }
      
      // Send message to API and get response
      async function sendMessage() {
        const input = document.getElementById('chatbot-widget-input');
        const messages = document.getElementById('chatbot-widget-messages');
        
        const message = input.value.trim();
        if (!message) return;
        
        // Clear input
        input.value = '';
        
        // Add user message to chat
        const userMessage = document.createElement('div');
        userMessage.classList.add('chatbot-widget-message');
        userMessage.classList.add('chatbot-widget-message-user');
        userMessage.textContent = message;
        messages.appendChild(userMessage);
        
        // Scroll to bottom
        messages.scrollTop = messages.scrollHeight;
        
        // Add typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('chatbot-widget-message');
        typingIndicator.classList.add('chatbot-widget-message-assistant');
        typingIndicator.classList.add('chatbot-widget-typing');
        typingIndicator.innerHTML = '<div class="chatbot-widget-typing-bubble"></div><div class="chatbot-widget-typing-bubble"></div><div class="chatbot-widget-typing-bubble"></div>';
        messages.appendChild(typingIndicator);
        
        // Scroll to bottom
        messages.scrollTop = messages.scrollHeight;
        
        try {
          // Get metadata
          const metadata = {
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            url: window.location.href,
            language: navigator.language
          };
          
          // Send to API
          const response = await fetch(\`\${rootUrl}/api/chat\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message,
              sessionId,
              chatbotId: config.chatbotId,
              // Pass additional config to the API
              businessDetails: config.businessDetails,
              aiPersonality: config.aiPersonality,
              metadata
            })
          });
          
          const data = await response.json();
          
          // Remove typing indicator
          messages.removeChild(typingIndicator);
          
          // Check for appointment booking intent
          if (data.success && data.isAppointment) {
            // Add message about booking system
            const bookingIntroMessage = document.createElement('div');
            bookingIntroMessage.classList.add('chatbot-widget-message');
            bookingIntroMessage.classList.add('chatbot-widget-message-assistant');
            bookingIntroMessage.textContent = "I can help you book an appointment. Our online booking system works best on our website. Would you like to continue to our booking page?";
            messages.appendChild(bookingIntroMessage);
            
            // Add booking link
            const bookingLinkContainer = document.createElement('div');
            bookingLinkContainer.classList.add('chatbot-widget-message');
            bookingLinkContainer.classList.add('chatbot-widget-message-assistant');
            
            const bookingLink = document.createElement('a');
            bookingLink.href = \`\${rootUrl}/book?chatbotId=\${config.chatbotId}&sessionId=\${sessionId}\`;
            bookingLink.target = "_blank";
            bookingLink.classList.add('chatbot-widget-booking-link');
            bookingLink.textContent = "Book Appointment";
            bookingLink.style.backgroundColor = config.primaryColor;
            
            bookingLinkContainer.appendChild(bookingLink);
            messages.appendChild(bookingLinkContainer);
          } else {
            // Add assistant response
            const assistantMessage = document.createElement('div');
            assistantMessage.classList.add('chatbot-widget-message');
            assistantMessage.classList.add('chatbot-widget-message-assistant');
            assistantMessage.textContent = data.success ? data.message : "I'm sorry, I couldn't process your request.";
            messages.appendChild(assistantMessage);
          }
          
          // Scroll to bottom
          messages.scrollTop = messages.scrollHeight;
          
        } catch (error) {
          console.error('Error sending message:', error);
          
          // Remove typing indicator
          messages.removeChild(typingIndicator);
          
          // Add error message
          const errorMessage = document.createElement('div');
          errorMessage.classList.add('chatbot-widget-message');
          errorMessage.classList.add('chatbot-widget-message-assistant');
          errorMessage.textContent = "I'm sorry, I encountered an error. Please try again later.";
          messages.appendChild(errorMessage);
          
          // Scroll to bottom
          messages.scrollTop = messages.scrollHeight;
        }
      }
      
      // Inject CSS styles
      function injectStyles() {
        if (styleElement) {
          document.head.removeChild(styleElement);
        }
        
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.textContent = \`
          /* Base styles */
          #chatbot-widget-root {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 16px;
            line-height: 1.5;
            color: #333;
          }
          
          /* Widget button */
          .chatbot-widget-button {
            position: fixed;
            bottom: 20px;
            z-index: 9999;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
          }
          
          .chatbot-widget-button:hover {
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
          }
          
          .chatbot-widget-right {
            right: 20px;
          }
          
          .chatbot-widget-left {
            left: 20px;
          }
          
          /* Widget container */
          .chatbot-widget-container {
            position: fixed;
            bottom: 90px;
            z-index: 9999;
            width: 350px;
            height: 500px;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
          }
          
          .chatbot-widget-container.chatbot-widget-hidden {
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            pointer-events: none;
          }
          
          .chatbot-widget-theme-light {
            background-color: #ffffff;
            color: #333333;
          }
          
          .chatbot-widget-theme-dark {
            background-color: #1f2937;
            color: #ffffff;
          }
          
          /* Header */
          .chatbot-widget-header {
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;
          }
          
          .chatbot-widget-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
          }
          
          .chatbot-widget-header button {
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            padding: 4px;
          }
          
          /* Messages container */
          .chatbot-widget-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background-color: #f9fafb;
          }
          
          .chatbot-widget-theme-dark .chatbot-widget-messages {
            background-color: #111827;
          }
          
          /* Messages */
          .chatbot-widget-message {
            margin-bottom: 12px;
            max-width: 75%;
            padding: 8px 12px;
            border-radius: 12px;
            word-break: break-word;
          }
          
          .chatbot-widget-message-user {
            background-color: #6366f1;
            color: white;
            margin-left: auto;
            border-bottom-right-radius: 4px;
          }
          
          .chatbot-widget-message-assistant {
            background-color: white;
            color: #333;
            margin-right: auto;
            border-bottom-left-radius: 4px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }
          
          .chatbot-widget-theme-dark .chatbot-widget-message-assistant {
            background-color: #374151;
            color: #ffffff;
          }
          
          /* Booking link */
          .chatbot-widget-booking-link {
            display: inline-block;
            padding: 8px 16px;
            background-color: #6366f1;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 500;
            margin-top: 4px;
            transition: all 0.2s ease;
          }
          
          .chatbot-widget-booking-link:hover {
            opacity: 0.9;
          }
          
          /* Typing indicator */
          .chatbot-widget-typing {
            display: flex;
            align-items: center;
            padding: 8px 12px;
          }
          
          .chatbot-widget-typing-bubble {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #aaa;
            margin-right: 4px;
            animation: chatbot-widget-typing-animation 1s infinite ease-in-out;
          }
          
          .chatbot-widget-typing-bubble:nth-child(1) {
            animation-delay: 0ms;
          }
          
          .chatbot-widget-typing-bubble:nth-child(2) {
            animation-delay: 150ms;
          }
          
          .chatbot-widget-typing-bubble:nth-child(3) {
            animation-delay: 300ms;
            margin-right: 0;
          }
          
          @keyframes chatbot-widget-typing-animation {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-4px);
            }
          }
          
          /* Input container */
          .chatbot-widget-input-container {
            display: flex;
            padding: 12px;
            border-top: 1px solid #e5e7eb;
          }
          
          .chatbot-widget-theme-dark .chatbot-widget-input-container {
            border-top-color: #374151;
          }
          
          #chatbot-widget-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #e5e7eb;
            border-radius: 4px 0 0 4px;
            font-size: 14px;
            outline: none;
          }
          
          .chatbot-widget-theme-dark #chatbot-widget-input {
            background-color: #374151;
            border-color: #4b5563;
            color: white;
          }
          
          #chatbot-widget-send {
            padding: 8px 12px;
            border: none;
            border-radius: 0 4px 4px 0;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        \`;
        
        document.head.appendChild(styleElement);
      }
      
      // Destroy the chatbot widget
      window.destroyChatWidget = function() {
        if (widgetContainer) {
          document.body.removeChild(widgetContainer);
          widgetContainer = null;
        }
        
        if (styleElement) {
          document.head.removeChild(styleElement);
          styleElement = null;
        }
      };
      
      // Check if chatbot script has been added before
      if (!window._chatbotInitialized) {
        // Add event listener for when document is fully loaded
        if (document.readyState === 'complete') {
          window.initializeChatWidget();
        } else {
          window.addEventListener('load', function() {
            window.initializeChatWidget();
          });
        }
        
        window._chatbotInitialized = true;
      }
    })();
  `;

  return new NextResponse(script, { headers });
}