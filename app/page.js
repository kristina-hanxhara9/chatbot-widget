import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Chatbot with Document Learning
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Create a smart, AI-powered chatbot for your business that learns from your documents and handles appointments automatically.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link href="/demo" className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition shadow-lg">
              Try Demo
            </Link>
            <Link href="/upload" className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-md border border-indigo-200 hover:border-indigo-300 transition shadow-lg">
              Upload Documents
            </Link>
          </div>
          
          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Document Learning</h3>
              <p className="text-gray-600">
                Upload your business documents, FAQs, and guides. The chatbot learns from them to provide accurate, business-specific answers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Appointment Booking</h3>
              <p className="text-gray-600">
                Allow customers to book appointments directly through the chat interface, with automatic availability checking.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fully Customizable</h3>
              <p className="text-gray-600">
                Personalize colors, themes, and behavior to match your brand identity. Embed easily on any website.
              </p>
            </div>
          </div>
          
          {/* How It Works */}
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-10 mb-16">
            <div className="w-full md:w-1/3 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Create Your Chatbot</h3>
              <p className="text-gray-600">
                Set up your business details, services, and customize the appearance of your chatbot.
              </p>
            </div>
            
            <div className="w-full md:w-1/3 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Upload Documents</h3>
              <p className="text-gray-600">
                Add your business documents, knowledge base, FAQ, and product information for the AI to learn from.
              </p>
            </div>
            
            <div className="w-full md:w-1/3 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Embed & Go Live</h3>
              <p className="text-gray-600">
                Add a simple code snippet to your website and your AI assistant is ready to help your customers.
              </p>
            </div>
          </div>
          
          {/* CTA */}
          <div className="bg-indigo-50 p-8 rounded-lg border border-indigo-100 text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Transform Your Customer Support?</h2>
            <p className="text-gray-600 mb-6">
              Get started with a free demo and see how our AI chatbot can help your business provide 24/7 support.
            </p>
            <Link href="/demo" className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition shadow">
              Try Demo Now
            </Link>
          </div>
          
          {/* Footer */}
          <footer className="mt-16 text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} AI Chatbot Widget. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </main>
  );
}