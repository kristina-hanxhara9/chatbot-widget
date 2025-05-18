'use client';

import { useState } from 'react';
import { format, parse } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

export default function ChatBookingFlow({ 
  chatbotId,
  businessId,
  sessionId,
  onComplete,
  onCancel
}) {
  const [step, setStep] = useState('service');
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Handle service selection
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep('date');
  };
  
  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    
    // For MVP: Generate time slots (would be replaced with API call in production)
    const generatedTimes = [];
    for (let hour = 9; hour < 17; hour++) {
      generatedTimes.push(`${hour}:00`);
      generatedTimes.push(`${hour}:30`);
    }
    setAvailableTimes(generatedTimes);
    
    setStep('time');
  };
  
  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep('details');
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle appointment submission
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
      setError('');
      
      // Appointment data to submit to the API
      const appointmentData = {
        chatbotId,
        sessionId,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
        time: selectedTime,
        serviceName: selectedService,
        notes: customerInfo.notes
      };
      
      // Send to the appointments API
      const response = await axios.post('/api/appointments', appointmentData);
      
      if (response.data.success) {
        // Call completion handler with booking details
        onComplete(response.data.details);
      } else {
        setError(response.data.message || 'Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      setError('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Go back to previous step
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
        {step === 'service' && (
          <div>
            <h3 className="text-lg font-medium mb-3">Select a Service</h3>
            
            <div className="space-y-2">
              {/* Add dynamic service options here in production */}
              <button
                onClick={() => handleServiceSelect('Consultation')}
                className="w-full p-3 bg-white border border-gray-200 rounded-md hover:bg-indigo-50 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium">Consultation</h4>
                  <p className="text-sm text-gray-500">30 minutes</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => handleServiceSelect('Follow-up')}
                className="w-full p-3 bg-white border border-gray-200 rounded-md hover:bg-indigo-50 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium">Follow-up</h4>
                  <p className="text-sm text-gray-500">15 minutes</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {step === 'date' && (
          <div>
            <h3 className="text-lg font-medium mb-3">Select a Date</h3>
            
            <div className="w-full">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateSelect}
                minDate={new Date()}
                inline
                className="w-full"
              />
            </div>
          </div>
        )}
        
        {step === 'time' && (
          <div>
            <h3 className="text-lg font-medium mb-3">Select a Time</h3>
            
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time, index) => (
                <button
                  key={index}
                  onClick={() => handleTimeSelect(time)}
                  className="p-2 bg-white border border-gray-200 rounded-md hover:bg-indigo-50 text-center"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
        
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  name="notes"
                  value={customerInfo.notes}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Any special requests or information"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium mb-2">Appointment Summary</h4>
                <p className="text-sm"><strong>Service:</strong> {selectedService}</p>
                <p className="text-sm"><strong>Date:</strong> {format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                <p className="text-sm"><strong>Time:</strong> {selectedTime}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t bg-gray-50 flex justify-between">
        <button
          onClick={goBack}
          className="px-4 py-2 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50"
        >
          {step === 'service' ? 'Cancel' : 'Back'}
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