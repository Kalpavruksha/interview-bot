import React from 'react'

const TestTailwind = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Tailwind CSS Test</h1>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
        <p className="text-gray-700 mb-4">
          If you can see this text in blue with a white background and shadow, Tailwind CSS is working correctly.
        </p>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>Tailwind CSS is properly configured!</p>
        </div>
      </div>
    </div>
  )
}

export default TestTailwind