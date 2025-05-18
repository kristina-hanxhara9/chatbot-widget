'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function UploadPage() {
  const searchParams = useSearchParams();
  const initChatbotId = searchParams.get('chatbotId') || '';
  
  const [chatbotId, setChatbotId] = useState(initChatbotId);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);
  const [error, setError] = useState('');
  
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setError('');
  };
  
  const handleUpload = async () => {
    if (!chatbotId) {
      setError('Please enter a Chatbot ID');
      return;
    }
    
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }
    
    setIsUploading(true);
    setUploadResults([]);
    setError('');
    
    try {
      const results = [];
      
      // Upload each file one by one
      for (const file of files) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('chatbotId', chatbotId);
          
          const response = await axios.post('/api/documents', formData);
          
          results.push({
            name: file.name,
            success: true,
            message: response.data.message,
            documentId: response.data.documentId
          });
        } catch (error) {
          results.push({
            name: file.name,
            success: false,
            message: error.response?.data?.message || 'Upload failed'
          });
        }
      }
      
      setUploadResults(results);
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error uploading documents:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const clearFiles = () => {
    setFiles([]);
    setUploadResults([]);
    setError('');
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-600 p-6 text-white">
            <h1 className="text-3xl font-bold">Upload Documents</h1>
            <p className="mt-2">Add documents for your chatbot to learn from</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Chatbot ID</label>
              <input
                type="text"
                value={chatbotId}
                onChange={(e) => setChatbotId(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter your chatbot ID"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop files here, or <span className="text-indigo-600">browse</span>
                </p>
                
                <p className="text-xs text-gray-500 mb-4">
                  Supported formats: TXT, PDF, DOC, DOCX, HTML (max 10MB)
                </p>
                
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                  accept=".txt,.pdf,.doc,.docx,.html"
                />
                
                <label
                  htmlFor="file-upload"
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md cursor-pointer hover:bg-indigo-200 transition"
                >
                  Select Files
                </label>
              </div>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md border border-red-200">
                {error}
              </div>
            )}
            
            {files.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Selected Files ({files.length})</h3>
                
                <ul className="bg-gray-50 rounded-md border overflow-hidden">
                  {files.map((file, index) => (
                    <li key={index} className="p-3 border-b last:border-b-0 flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-3 text-right">
                  <button
                    type="button"
                    onClick={clearFiles}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Clear files
                  </button>
                </div>
              </div>
            )}
            
            {uploadResults.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Upload Results</h3>
                
                <ul className="bg-gray-50 rounded-md border overflow-hidden">
                  {uploadResults.map((result, index) => (
                    <li key={index} className={`p-3 border-b last:border-b-0 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {result.success ? (
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          )}
                          <span className="text-sm">{result.name}</span>
                        </div>
                        <span className={`text-xs ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                          {result.success ? 'Success' : 'Failed'}
                        </span>
                      </div>
                      <p className="text-xs mt-1 ml-7">{result.message}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading || files.length === 0}
                className={`px-6 py-2 bg-indigo-600 text-white rounded-md ${
                  isUploading || files.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                } transition`}
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  'Upload Documents'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}