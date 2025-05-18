'use client';

import { useState } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';

export default function ChatBookingFlow({ 
  chatbotId,
  businessId,
  onComplete,
  onCancel
}) {
  const [step, setStep] = useState('service');
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Simplified service selection for MVP
  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
    setStep('date');
  };
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setStep('time');
  };
  
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep('details');
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async () => {
    // Basic validation
    if (!customerInfo.name) {
      setError('Please enter your name');
      return;
    }
    
    if (!customerInfo.email && !customerInfo.phone) {
      setError('Please provide either email or phone');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // For MVP, we'll simulate a successful booking
      const appointment = {
        serviceName: "Selected Service",
        dateTime: new Date().toISOString(),
        customerName: customerInfo.name
      };
      
      // Call completion handler with booking details
      onComplete(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      setError('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const goBack = () => {
    switch (step) {
      case 'date':
        setStep('service');
        break;
      case 'time':
        setStep('date');
        break;
      case 'details':
        setStep('time');
        break;
      default:
        onCancel();
    }
  };

  // Simplified placeholder UI
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Book an Appointment</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {step === 'details' && (
          <div>
            <h3 className="text-lg font-medium mb-3">Your Information</h3>
            
            {error && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Your phone number"
                />
              </div>
            </div>
          </div>
        )}
        
        {step !== 'details' && (
          <div className="text-center py-4">
            <p>This is a simplified booking interface for the initial version.</p>
            <p className="text-sm text-gray-500 mt-2">Please enter your information to continue.</p>
            <button 
              onClick={() => setStep('details')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Continue to Details
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t bg-gray-50 flex justify-between">
        <button
          onClick={goBack}
          className="px-4 py-2 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50"
        >
          Back
        </button>
        
        {step === 'details' && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`
              px-4 py-2 text-sm text-white rounded
              ${submitting 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'}
            `}
          >
            {submitting ? 'Submitting...' : 'Confirm Booking'}
          </button>
        )}
      </div>
    </div>
  );
}