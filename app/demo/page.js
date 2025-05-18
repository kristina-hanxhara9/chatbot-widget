'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatWidget from '@/components/ChatWidget';

export default function Demo() {
  const searchParams = useSearchParams();
  const paramChatbotId = searchParams.get('chatbotId');
  
  const [chatbotId, setChatbotId] = useState(paramChatbotId || 'demo_chatbot');
  const [theme, setTheme] = useState('light');
  const [position, setPosition] = useState('right');
  const [businessName, setBusinessName] = useState('Demo Business');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [welcomeMessage, setWelcomeMessage] = useState('Hi there! How can I help you today?');
  const [showWidget, setShowWidget] = useState(true);
  
  const handleWidgetToggle = () => {
    setShowWidget(prev => !prev);
  };
  
  const handleReset = () => {
    setChatbotId('demo_chatbot');
    setTheme('light');
    setPosition('right');
    setBusinessName('Demo Business');
    setPrimaryColor('#6366f1');
    setWelcomeMessage('Hi there! How can I help you today?');
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-3xl font-bold">Chatbot Widget Demo</h1>
            <p className="mt-2">Customize your chatbot and test it live</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b pb-2">Configuration</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chatbot ID</label>
                  <input
                    type="text"
                    value={chatbotId}
                    onChange={(e) => setChatbotId(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Welcome Message</label>
                  <textarea
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows="3"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="p-1 border rounded w-12 h-8"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 p-2 border rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                  </select>
                </div>
                
                <div className="flex justify-between pt-4">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  >
                    Reset to Defaults
                  </button>
                  
                  <button
                    onClick={handleWidgetToggle}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    {showWidget ? 'Hide Widget' : 'Show Widget'}
                  </button>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">Embed Code</h2>
                
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">Copy this code snippet to embed the chatbot on your website:</p>
                  
                  <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto text-xs">
                    {`<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/api/widget/chatbot.js"></script>
<script>
  window.initializeChatWidget({
    chatbotId: "${chatbotId}",
    theme: "${theme}",
    position: "${position}",
    businessName: "${businessName}",
    primaryColor: "${primaryColor}",
    welcomeMessage: "${welcomeMessage}"
  });
</script>`}
                  </pre>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-bold text-lg mb-2">Usage Instructions</h3>
                  
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Add the script tag to your website's HTML, ideally just before the closing <code>&lt;/body&gt;</code> tag.</li>
                    <li>Customize the configuration options as needed.</li>
                    <li>The chatbot will automatically display a floating button in the corner of your site.</li>
                    <li>Users can click the button to open the chat interface.</li>
                    <li>The chatbot remembers conversations using session storage.</li>
                  </ol>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 rounded-md border border-yellow-100">
                  <h3 className="font-bold text-amber-800 mb-2">Test Queries</h3>
                  
                  <ul className="list-disc list-inside space-y-1 text-sm text-amber-800">
                    <li>What services do you offer?</li>
                    <li>When are you open?</li>
                    <li>I'd like to schedule an appointment</li>
                    <li>Do you have any special features?</li>
                    <li>Where are you located?</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showWidget && (
        <ChatWidget
          chatbotId={chatbotId}
          theme={theme}
          position={position}
          businessName={businessName}
          primaryColor={primaryColor}
          welcomeMessage={welcomeMessage}
        />
      )}
    </div>
  );
}