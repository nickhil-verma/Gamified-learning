"use client"
import React, { useState } from 'react'
import { Menu, X, Leaf, Globe } from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'Solutions', href: '#' },
    { name: 'Impact', href: '#' },
    { name: 'Resources', href: '#' },
    { name: 'About', href: '#' },
    { name: 'Contact', href: '#' }
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Globe className="w-8 h-8 text-sky-500" />
              <Leaf className="w-4 h-4 text-green-600 absolute -top-1 -right-1" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-sky-500 bg-clip-text text-transparent">
              PlanetZero
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium text-sm relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-sky-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-sky-500 transition-colors duration-200 font-medium text-sm">
              Sign In
            </button>
            <button className="bg-gradient-to-r from-green-600 to-sky-500 text-white px-6 py-2 rounded-full font-medium text-sm hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-green-600 transition-colors duration-200 p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-screen opacity-100 pb-6' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="pt-4 pb-2 space-y-3 border-t border-gray-100 mt-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium py-2 px-4 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 space-y-3">
              <button className="w-full text-left text-gray-700 hover:text-sky-500 transition-colors duration-200 font-medium py-2 px-4 rounded-lg hover:bg-gray-50">
                Sign In
              </button>
              <button className="w-full bg-gradient-to-r from-green-600 to-sky-500 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar