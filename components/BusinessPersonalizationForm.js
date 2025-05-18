// components/BusinessPersonalizationForm.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function BusinessPersonalizationForm({ chatbotId, initialData = {} }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Business details
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [industry, setIndustry] = useState(initialData.industry || 'retail');
  const [services, setServices] = useState(initialData.services || []);
  const [features, setFeatures] = useState(initialData.features || []);
  const [hours, setHours] = useState(initialData.hours || 'Monday-Friday: 9AM-5PM');
  const [location, setLocation] = useState(initialData.location || '');
  const [website, setWebsite] = useState(initialData.website || '');
  
  // AI personality
  const [personality, setPersonality] = useState(initialData.personality || 'friendly');
  const [isDetailed, setIsDetailed] = useState(initialData.isDetailed || false);
  const [isConcise, setIsConcise] = useState(initialData.isConcise || true);
  const [askFollowUp, setAskFollowUp] = useState(initialData.askFollowUp || true);
  const [isEmpathetic, setIsEmpathetic] = useState(initialData.isEmpathetic || true);
  const [knowledgeFocus, setKnowledgeFocus] = useState(initialData.knowledgeFocus || 'balanced');
  const [customPrompt, setCustomPrompt] = useState(initialData.customPrompt || '');
  const [useCustomPrompt, setUseCustomPrompt] = useState(initialData.useCustomPrompt || false);

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

  // Generate preview prompt
  const generatePreviewPrompt = () => {
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

    return `You are an AI assistant for ${name}, a ${industry} business. Respond in a ${personalityText} manner. You can assist with scheduling appointments, answering questions about services (${services.join(', ')}), and providing basic information about the business. Business hours are ${hours}. Location: ${location}. ${focusText} ${styleText.join(', ')}.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !industry || services.length === 0) {
      setError('Please fill in all required fields (Business Name, Industry, and at least one Service)');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    const businessData = {
      name,
      description,
      industry,
      services,
      features,
      hours,
      location,
      website,
      chatbotId,
      aiSettings: {
        personality,
        isDetailed,
        isConcise,
        askFollowUp,
        isEmpathetic,
        knowledgeFocus,
        customPrompt: useCustomPrompt ? customPrompt : generatePreviewPrompt(),
        useCustomPrompt
      }
    };
    
    try {
      // Update the business and AI settings
      const response = await axios.post('/api/businesses', businessData);
      
      if (response.data.success) {
        setSuccessMessage('Business and AI settings saved successfully!');
        
        // Redirect to the document upload page with the chatbotId
        setTimeout(() => {
          router.push(`/upload?chatbotId=${chatbotId}`);
        }, 1500);
      } else {
        setError(response.data.message || 'An error occurred while saving settings');
      }
    } catch (error) {
      console.error('Error saving business settings:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-600 p-6 text-white">
        <h1 className="text-3xl font-bold">Customize Your Chatbot</h1>
        <p className="mt-2">Personalize your AI assistant with your business details and preferred communication style</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md border border-red-200">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
            {successMessage}
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Business Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name*</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., Smile Bright Dental"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry*</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
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
          </div>
          
          <div className="mt-4">
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
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Services*</label>
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
          
          <div className="mt-4">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
          
          <div className="mt-4">
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
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">AI Personality Settings</h2>
          
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
            <div id="prompt-preview" className="bg-gray-50 p-3 border rounded-md text-sm hidden">
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
        
        <div className="flex justify-between mt-8">
          <button 
            type="button" 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-indigo-600 text-white rounded-md ${isSubmitting ? 'opacity-75' : 'hover:bg-indigo-700'} transition`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Save and Continue to Upload Documents'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}