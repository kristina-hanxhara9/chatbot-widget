'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatWidget from '@/components/ChatWidget';

export default function Demo() {
  const searchParams = useSearchParams();
  const paramChatbotId = searchParams.get('chatbotId');
  
  // Basic widget settings
  const [chatbotId, setChatbotId] = useState(paramChatbotId || 'demo_chatbot');
  const [theme, setTheme] = useState('light');
  const [position, setPosition] = useState('right');
  const [businessName, setBusinessName] = useState('Demo Business');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [welcomeMessage, setWelcomeMessage] = useState('Hi there! How can I help you today?');
  const [showWidget, setShowWidget] = useState(true);
  
  // Business details
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('retail');
  const [services, setServices] = useState([]);
  const [features, setFeatures] = useState([]);
  const [hours, setHours] = useState('Monday-Friday: 9AM-5PM');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  
  // AI personality
  const [personality, setPersonality] = useState('friendly');
  const [isDetailed, setIsDetailed] = useState(false);
  const [isConcise, setIsConcise] = useState(true);
  const [askFollowUp, setAskFollowUp] = useState(true);
  const [isEmpathetic, setIsEmpathetic] = useState(true);
  const [knowledgeFocus, setKnowledgeFocus] = useState('balanced');
  const [customPrompt, setCustomPrompt] = useState('');
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('basic');
  
  // Handle adding service
  const [newService, setNewService] = useState('');
  const addService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  // Handle adding feature
  const [newFeature, setNewFeature] = useState('');
  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  // Remove service
  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  // Remove feature
  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };
  
  const handleWidgetToggle = () => {
    setShowWidget(prev => !prev);
  };
  
  const handleReset = () => {
    // Reset basic settings
    setChatbotId('demo_chatbot');
    setTheme('light');
    setPosition('right');
    setBusinessName('Demo Business');
    setPrimaryColor('#6366f1');
    setWelcomeMessage('Hi there! How can I help you today?');
    
    // Reset business details
    setDescription('');
    setIndustry('retail');
    setServices([]);
    setFeatures([]);
    setHours('Monday-Friday: 9AM-5PM');
    setLocation('');
    setWebsite('');
    
    // Reset AI personality
    setPersonality('friendly');
    setIsDetailed(false);
    setIsConcise(true);
    setAskFollowUp(true);
    setIsEmpathetic(true);
    setKnowledgeFocus('balanced');
    setCustomPrompt('');
    setUseCustomPrompt(false);
  };
  
  // Generate preview prompt
  const generatePreviewPrompt = () => {
    if (!businessName) return 'Please set a business name to generate a prompt.';
    
    const personalityText = {
      friendly: 'friendly and helpful',
      professional: 'professional and formal',
      casual: 'casual and conversational',
      enthusiastic: 'enthusiastic and energetic'
    }[personality];

    const focusText = {
      balanced: 'Provide balanced information about the business and industry.',
      business: 'Focus primarily on the business services and features.',
      industry: 'Share educational information about the industry when relevant.',
      sales: 'Focus on converting inquiries into appointments or sales.'
    }[knowledgeFocus];

    const styleText = [];
    if (isConcise) styleText.push('Keep responses concise');
    if (isDetailed) styleText.push('Provide detailed information');
    if (askFollowUp) styleText.push('Ask follow-up questions when appropriate');
    if (isEmpathetic) styleText.push('Show empathy when customers express concerns');

    return `You are an AI assistant for ${businessName}, a ${industry} business. Respond in a ${personalityText} manner. You can assist with scheduling appointments, answering questions about services (${services.join(', ')}), and providing basic information about the business. Business hours are ${hours}. Location: ${location}. ${focusText} ${styleText.join(', ')}.`;
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-3xl font-bold">Chatbot Widget Demo</h1>
            <p className="mt-2">Customize your chatbot and test it live</p>
          </div>
          
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('basic')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'basic'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Basic Settings
              </button>
              <button
                onClick={() => setActiveTab('business')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'business'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Business Details
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'ai'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                AI Personality
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'code'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Embed Code
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {/* Basic Settings Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b pb-2">Basic Configuration</h2>
                
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
              </div>
            )}
            
            {/* Business Details Tab */}
            {activeTab === 'business' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b pb-2">Business Details</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Describe your business in a few sentences..."
                    rows="3"
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">This helps the AI understand your business better.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="retail">Retail</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="dental">Dental Practice</option>
                    <option value="realestate">Real Estate</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="fitness">Fitness Studio</option>
                    <option value="salon">Hair Salon</option>
                    <option value="legal">Law Firm</option>
                    <option value="ecommerce">E-Commerce</option>
                    <option value="hospitality">Hotel/Hospitality</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {services.map((service, index) => (
                      <div key={index} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center">
                        {service}
                        <button 
                          type="button" 
                          onClick={() => removeService(index)}
                          className="ml-2 text-indigo-500 hover:text-indigo-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      className="flex-grow p-2 border rounded-l-md"
                      placeholder="e.g., Regular Check-ups"
                    />
                    <button
                      type="button"
                      onClick={addService}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Features</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {features.map((feature, index) => (
                      <div key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center">
                        {feature}
                        <button 
                          type="button" 
                          onClick={() => removeFeature(index)}
                          className="ml-2 text-green-500 hover:text-green-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-grow p-2 border rounded-l-md"
                      placeholder="e.g., Free Parking"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
                    <input
                      type="text"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g., Monday-Friday: 9AM-5PM"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g., 123 Main Street, New York, NY"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., www.yourwebsite.com"
                  />
                </div>
              </div>
            )}
            
            {/* AI Personality Tab */}
            {activeTab === 'ai' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b pb-2">AI Personality Settings</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Personality Style</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { id: 'friendly', name: 'Friendly & Helpful', icon: '😊', desc: 'Warm, approachable, and focuses on building rapport' },
                      { id: 'professional', name: 'Professional & Formal', icon: '👔', desc: 'Business-like tone that emphasizes expertise' },
                      { id: 'casual', name: 'Casual & Conversational', icon: '🗣️', desc: 'Relaxed, like talking to a friend' },
                      { id: 'enthusiastic', name: 'Enthusiastic & Energetic', icon: '⭐', desc: 'Upbeat, passionate and creates positive energy' }
                    ].map((style) => (
                      <div 
                        key={style.id}
                        onClick={() => setPersonality(style.id)}
                        className={`border p-3 rounded-lg cursor-pointer ${personality === style.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                      >
                        <div className="flex items-center mb-1">
                          <span className="mr-2 text-lg">{style.icon}</span>
                          <h4 className="font-medium">{style.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{style.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Communication Style</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="concise"
                        checked={isConcise}
                        onChange={(e) => setIsConcise(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="concise">Keep responses concise</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="detailed"
                        checked={isDetailed}
                        onChange={(e) => setIsDetailed(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="detailed">Provide detailed information</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="followup"
                        checked={askFollowUp}
                        onChange={(e) => setAskFollowUp(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="followup">Ask follow-up questions</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="empathetic"
                        checked={isEmpathetic}
                        onChange={(e) => setIsEmpathetic(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="empathetic">Be empathetic to concerns</label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">AI Knowledge Focus</label>
                  <select
                    value={knowledgeFocus}
                    onChange={(e) => setKnowledgeFocus(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="balanced">Balanced (General + Business-Specific)</option>
                    <option value="business">Business Focus (Mostly About Your Services)</option>
                    <option value="industry">Industry Expert (Provides Educational Information)</option>
                    <option value="sales">Sales-Oriented (Focuses on Conversions)</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Current AI Prompt Preview</label>
                    <button 
                      type="button"
                      className="text-indigo-600 text-sm font-medium"
                      onClick={() => document.getElementById('prompt-preview').classList.toggle('hidden')}
                    >
                      Show/Hide Preview
                    </button>
                  </div>
                  <div id="prompt-preview" className="bg-gray-50 p-3 border rounded-md text-sm">
                    {useCustomPrompt ? customPrompt : generatePreviewPrompt()}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="customPrompt"
                      checked={useCustomPrompt}
                      onChange={(e) => setUseCustomPrompt(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="customPrompt" className="font-medium">I want to customize the AI prompt manually</label>
                  </div>
                  
                  {useCustomPrompt && (
                    <div className="mt-2">
                      <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        rows="6"
                        placeholder="Enter your custom AI prompt here..."
                      ></textarea>
                      <p className="text-sm text-gray-500 mt-1">
                        For advanced users who want complete control over the AI's behavior.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Embed Code Tab */}
            {activeTab === 'code' && (
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
    welcomeMessage: "${welcomeMessage}",
    businessDetails: {
      description: "${description}",
      industry: "${industry}",
      services: ${JSON.stringify(services)},
      features: ${JSON.stringify(features)},
      hours: "${hours}",
      location: "${location}",
      website: "${website}"
    },
    aiPersonality: {
      personality: "${personality}",
      isDetailed: ${isDetailed},
      isConcise: ${isConcise},
      askFollowUp: ${askFollowUp},
      isEmpathetic: ${isEmpathetic},
      knowledgeFocus: "${knowledgeFocus}",
      useCustomPrompt: ${useCustomPrompt},
      customPrompt: "${useCustomPrompt ? customPrompt : ''}"
    }
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
            )}
            
            <div className="flex justify-between mt-8">
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
          businessDetails={{
            description,
            industry,
            services,
            features,
            hours,
            location,
            website
          }}
          aiPersonality={{
            personality,
            isDetailed,
            isConcise,
            askFollowUp,
            isEmpathetic,
            knowledgeFocus,
            useCustomPrompt,
            customPrompt: useCustomPrompt ? customPrompt : generatePreviewPrompt()
          }}
        />
      )}
    </div>
  );
}