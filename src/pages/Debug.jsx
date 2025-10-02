import React from 'react';

function DebugPage() {
  const envVars = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    geminiKey: import.meta.env.VITE_GEMINI_API_KEY ? '✅ Set' : '❌ Missing',
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">🔧 Debug Info</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
            <div className="bg-gray-100 p-4 rounded">
              <p>Supabase URL: {envVars.supabaseUrl}</p>
              <p>Supabase Key: {envVars.supabaseKey}</p>
              <p>Gemini API Key: {envVars.geminiKey}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">App Status</h2>
            <div className="bg-gray-100 p-4 rounded">
              <p>✅ React is rendering</p>
              <p>✅ Vite is running</p>
              <p>✅ Tailwind CSS is loaded</p>
            </div>
          </div>

          <div className="mt-6">
            <a 
              href="/" 
              className="inline-block px-6 py-3 bg-lime-600 text-white rounded-lg hover:bg-lime-700"
            >
              Go to Home Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebugPage;
