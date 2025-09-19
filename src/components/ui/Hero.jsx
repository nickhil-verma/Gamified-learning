import React from 'react';

const Hero = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden flex flex-col justify-between">
      {/* Background Grid and Fading Orb */}
      <div className="absolute inset-0 z-0">
        <div 
          className="h-full w-full opacity-5" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        ></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-green-500 to-sky-500 rounded-full blur-3xl opacity-10 animate-fade-in-pulse"></div>
      </div>
      
      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center flex-grow">
        
        {/* Logo/Brand Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-green-600 to-sky-500 shadow-lg">
            <span className="text-white font-bold text-3xl sm:text-4xl">P</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight animate-fade-in-up delay-200">
          <span className="block text-gray-900 mb-2">Welcome to</span>
          <span className="block bg-gradient-to-r from-green-600 via-sky-500 to-green-600 bg-clip-text text-transparent">
            PlanetZero
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-12 max-w-3xl leading-relaxed px-4 animate-fade-in-up delay-400">
          Revolutionizing the way we think about sustainability and innovation.
          Join us in creating a <strong className="text-green-600 font-semibold">carbon-neutral future</strong>
          powered by <strong className="text-sky-500 font-semibold">cutting-edge technology</strong>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in-up delay-600">
          <button className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
          
          <button className="group px-6 py-3 sm:px-8 sm:py-4 border-2 border-sky-500 text-sky-500 font-semibold rounded-full hover:bg-sky-500 hover:text-white transition-all duration-300 transform hover:scale-105">
            <span className="flex items-center justify-center">
              Learn More
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl animate-fade-in-up delay-800">
          {[
            { icon: "🌱", title: "Sustainable", description: "Eco-friendly solutions for a better tomorrow.", color: "green" },
            { icon: "🚀", title: "Innovation", description: "Cutting-edge technology meets environmental care.", color: "sky" },
            { icon: "🌍", title: "Global Impact", description: "Making a difference worldwide, one step at a time.", color: "green" }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="group bg-white/50 backdrop-blur-sm p-6 rounded-3xl shadow-xl transition-all duration-300 border border-gray-100 transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${feature.color === 'green' ? 'text-green-600' : 'text-sky-500'}`}>
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Simplified Footer / Scroll Indicator */}
      <div className="relative z-10 py-8 text-center animate-fade-in-up delay-1000">
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-sm mb-2">Scroll Down</span>
          <div className="w-5 h-8 border-2 border-gray-300 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-gradient-to-b from-green-600 to-sky-500 rounded-full animate-scroll-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;