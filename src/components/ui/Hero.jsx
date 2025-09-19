import React from 'react'

const Hero = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-sky-100 rounded-full opacity-30 animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-200 rounded-full opacity-25 animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-sky-200 rounded-full opacity-20 animate-bounce delay-700"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-gray-900" style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          
          {/* Logo/Brand Section */}
          <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-green-600 to-sky-500 shadow-2xl mb-6">
              <span className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl">P</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 leading-tight">
            <span className="block text-gray-900 mb-2">Welcome to</span>
            <span className="block bg-gradient-to-r from-green-600 via-sky-500 to-green-600 bg-clip-text text-transparent animate-pulse">
              PlanetZero
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl leading-relaxed px-4">
            Revolutionizing the way we think about sustainability and innovation. 
            Join us in creating a <span className="text-green-600 font-semibold">carbon-neutral future</span> 
            powered by <span className="text-sky-500 font-semibold">cutting-edge technology</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-16">
            <button className="group relative px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-lg rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-3xl overflow-hidden">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            
            <button className="group px-8 py-4 sm:px-10 sm:py-5 border-2 border-sky-500 text-sky-500 font-semibold text-lg rounded-2xl hover:bg-sky-500 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
              <span className="flex items-center justify-center">
                Learn More
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-6xl">
            {[
              {
                icon: "🌱",
                title: "Sustainable",
                description: "Eco-friendly solutions for a better tomorrow",
                color: "green"
              },
              {
                icon: "🚀",
                title: "Innovation",
                description: "Cutting-edge technology meets environmental care",
                color: "sky"
              },
              {
                icon: "🌍",
                title: "Global Impact",
                description: "Making a difference worldwide, one step at a time",
                color: "green"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${feature.color === 'green' ? 'text-green-600' : 'text-sky-500'}`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-20 sm:h-32" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="url(#wave-gradient)"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.1" />
              <stop offset="50%" stopColor="rgb(14, 165, 233)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-sm mb-2 hidden sm:block">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gradient-to-b from-green-600 to-sky-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero