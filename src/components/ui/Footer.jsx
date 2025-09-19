import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Leaf, Globe, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer id='footer' className="bg-white border-t border-gray-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-sky-500 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-sky-500 bg-clip-text text-transparent">
                PlanetZero
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Building a sustainable future through innovative technology and environmental consciousness. Join us in making the planet better for everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-50 hover:bg-green-50 rounded-lg flex items-center justify-center transition-colors duration-200 group">
                <Facebook className="w-5 h-5 text-gray-500 group-hover:text-green-600" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 hover:bg-sky-50 rounded-lg flex items-center justify-center transition-colors duration-200 group">
                <Twitter className="w-5 h-5 text-gray-500 group-hover:text-sky-500" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 hover:bg-green-50 rounded-lg flex items-center justify-center transition-colors duration-200 group">
                <Instagram className="w-5 h-5 text-gray-500 group-hover:text-green-600" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 hover:bg-sky-50 rounded-lg flex items-center justify-center transition-colors duration-200 group">
                <Linkedin className="w-5 h-5 text-gray-500 group-hover:text-sky-500" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-6 flex items-center">
              <Leaf className="w-4 h-4 text-green-600 mr-2" />
              Solutions
            </h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm">Carbon Tracking</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm">Energy Management</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm">Sustainability Reports</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm">Green Analytics</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm">Eco Insights</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="w-4 h-4 text-sky-500 mr-2" />
              Company
            </h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-600 hover:text-sky-500 transition-colors duration-200 text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-sky-500 transition-colors duration-200 text-sm">Our Mission</a></li>
              <li><a href="#" className="text-gray-600 hover:text-sky-500 transition-colors duration-200 text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-sky-500 transition-colors duration-200 text-sm">Press Kit</a></li>
              <li><a href="#" className="text-gray-600 hover:text-sky-500 transition-colors duration-200 text-sm">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-6">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Email us</p>
                  <a href="mailto:hello@planetzero.com" className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors">
                    hello@planetzero.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Call us</p>
                  <a href="tel:+1234567890" className="text-sm font-medium text-gray-900 hover:text-sky-500 transition-colors">
                    +1 (234) 567-8900
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Visit us</p>
                  <p className="text-sm font-medium text-gray-900">
                    123 Green Street<br />
                    Eco City, EC 12345
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-gray-900 mb-1">Stay Updated</h4>
              <p className="text-sm text-gray-600">Get the latest sustainability insights delivered to your inbox</p>
            </div>
            <div className="flex w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-sky-500 text-white text-sm font-medium rounded-r-lg hover:from-green-700 hover:to-sky-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-sm text-gray-500">
                © 2025 PlanetZero. All rights reserved.
              </p>
              <div className="hidden md:flex items-center space-x-4">
                <a href="#" className="text-xs text-gray-500 hover:text-green-600 transition-colors">Privacy Policy</a>
                <a href="#" className="text-xs text-gray-500 hover:text-green-600 transition-colors">Terms of Service</a>
                <a href="#" className="text-xs text-gray-500 hover:text-green-600 transition-colors">Cookie Policy</a>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>Made with</span>
              <span className="text-green-600">♥</span>
              <span>for a sustainable future</span>
            </div>
          </div>
          <div className="md:hidden flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-gray-100">
            <a href="#" className="text-xs text-gray-500 hover:text-green-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-green-600 transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-gray-500 hover:text-green-600 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;