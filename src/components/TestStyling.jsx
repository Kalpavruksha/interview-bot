import React from 'react';

const TestStyling = () => {
  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">Styling Test Page</h1>
      <p className="text-lg text-gray-700 mb-6">If you can see this text styled with Tailwind classes, then styling is working correctly.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Card 1</h2>
          <p className="text-gray-600">This card should have padding, background, and shadows.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Card 2</h2>
          <p className="text-gray-600">This card should have padding, background, and shadows.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Card 3</h2>
          <p className="text-gray-600">This card should have padding, background, and shadows.</p>
        </div>
      </div>
      
      <div className="mt-8 flex space-x-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Primary Button
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
          Secondary Button
        </button>
      </div>
    </div>
  );
};

export default TestStyling;