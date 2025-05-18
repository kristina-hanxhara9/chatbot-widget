'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import ChatBookingFlow from './ChatBookingFlow';

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

export default function ChatWidget({ 
  chatbotId = "demo_chatbot", 
  theme = "light", 
  position = "right",
  businessName = "Business Assistant",
  primaryColor = "#6366f1",
  welcomeMessage = "Hi there! How can I assist you today?"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [businessId, setBusinessId] = useState(null);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize session ID and add welcome message
  useEffect(() => {
    const id = getSessionId();
    setSessionId(id);
    
    // Fetch business ID from chatbot ID
    async function fetchBusinessId() {
      try {
        const response = await axios.get(`/api/business/by-chatbot?chatbotId=${chatbotId}`);
        if (response.data.success) {
          setBusinessId(response.data.businessId);
        }
      } catch (error) {
        console.error('Error fetching business ID:', error);
      }
    }
    
    fetchBusinessId();
    
    setMessages([
      { role: 'assistant', content: welcomeMessage }
    ]);
  }, [chatbotId, welcomeMessage]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async (messageText = inputValue.trim()) => {
    if (!messageText) return;
    
    if (inputValue) {
      setInputValue('');
    }
    
    // Add user message to chat
    setMessages(prev => [
      ...prev, 
      { role: 'user', content: messageText }
    ]);
    
    setIsLoading(true);
    
    try {
      // Get user's metadata for context
      const metadata = {
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        url: window.location.href,
        language: navigator.language
      };
      
      // Send message to API
      const response = await axios.post('/api/chat', {
        message: messageText,
        sessionId,
        chatbotId,
        metadata
      });
      
      if (response.data.success) {
        // Check if this is an appointment/booking intent
        if (response.data.isAppointment) {
          setMessages(prev => [
            ...prev,
            { role: 'assistant', content: 'I can help you book an appointment. Let me pull up our booking system for you.' }
          ]);
          
          setTimeout(() => {
            setShowBookingFlow(true);
          }, 500);
        } else {
          // Add assistant response to chat
          setMessages(prev => [
            ...prev,
            { role: 'assistant', content: response.data.message }
          ]);
        }
      } else {
        // Add error message
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: "I'm sorry, I couldn't process your request. Please try again later." }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle booking completion
  const handleBookingComplete = (bookingDetails) => {
    // Close booking flow
    setShowBookingFlow(false);
    
    // Add confirmation message
    const confirmationMessage = `Great! I've booked your appointment for ${bookingDetails.serviceName} on ${format(new Date(bookingDetails.dateTime), 'EEEE, MMMM d')} at ${format(new Date(bookingDetails.dateTime), 'h:mm a')}. We look forward to seeing you, ${bookingDetails.customerName}!`;
    
    setMessages(prev => [
      ...prev,
      { role: 'assistant', content: confirmationMessage }
    ]);
  };

  // Cancel booking flow
  const handleCancelBooking = () => {
    setShowBookingFlow(false);
    
    setMessages(prev => [
      ...prev,
      { role: 'assistant', content: "No problem. Is there anything else I can help you with?" }
    ]);
  };

  // Toggle chat widget
  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div 
      className={`fixed ${position === 'right' ? 'right-5' : 'left-5'} bottom-5 z-50 flex flex-col items-end`}
      style={{
        '--primary-color': primaryColor,
      }}
    >
      {/* Chat Widget Container */}
      {isOpen && (
        <div 
          className={`mb-4 rounded-lg shadow-lg w-80 sm:w-96 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          style={{ height: '500px', maxHeight: '70vh' }}
        >
          {/* Header */}
          <div 
            className="p-4 flex justify-between items-center"
            style={{ backgroundColor: primaryColor, color: 'white' }}
          >
            <h3 className="font-semibold">{businessName}</h3>
            <button onClick={toggleChat} className="text-white hover:opacity-80">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Message Container */}
          <div 
            className={`flex-1 p-4 overflow-y-auto ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`} 
            style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb' }}
          >
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block p-3 rounded-lg ${
                    message.role === 'user' 
                      ? `bg-${primaryColor.replace('#', '')} text-white` 
                      : theme === 'dark' ? 'bg-gray-700' : 'bg-white border'
                  }`}
                  style={{ 
                    maxWidth: '85%',
                    backgroundColor: message.role === 'user' ? primaryColor : '',
                    boxShadow: message.role === 'assistant' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="text-left mb-4">
                <div 
                  className={`inline-block p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white border'}`}
                  style={{ maxWidth: '85%' }}
                >
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Booking Flow */}
            {showBookingFlow && businessId && (
              <div className="mb-4">
                <ChatBookingFlow 
                  chatbotId={chatbotId}
                  businessId={businessId}
                  onComplete={handleBookingComplete}
                  onCancel={handleCancelBooking}
                />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Box */}
          <div className={`p-3 border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className={`flex-1 p-2 rounded-l-lg focus:outline-none ${
                  theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'
                }`}
                disabled={showBookingFlow}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading || showBookingFlow}
                className="p-2 rounded-r-lg text-white"
                style={{ 
                  backgroundColor: primaryColor,
                  opacity: !inputValue.trim() || isLoading || showBookingFlow ? 0.7 : 1 
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: primaryColor }}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
}