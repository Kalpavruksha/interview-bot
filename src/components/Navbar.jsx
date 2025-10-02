import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()
  
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 font-bold text-xl">
              AI Interview Assistant
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/'
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                }`}
              >
                Interviewee
              </Link>
              <Link
                to="/interviewer"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/interviewer'
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                }`}
              >
                Interviewer Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar