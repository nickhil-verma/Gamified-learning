"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Target, Users, TrendingUp, Award, Leaf } from 'lucide-react';

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const checkpointVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.2
      }
    }
  };

  const outcomes = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Gamified Learning Platform",
      description: "Interactive mobile/web app with lessons, challenges, quizzes, and real-world environmental tasks like tree-planting and waste segregation."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Eco-Points & Competition",
      description: "Track environmental actions with points system, enabling school-level competitions and peer motivation."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Recognition System",
      description: "Digital badges and rewards for sustainable practices, creating lasting behavioral change and community impact."
    }
  ];

  const stakeholders = [
    "School and college students",
    "Teachers and eco-club coordinators", 
    "Environmental NGOs and government departments"
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 py-20 px-4">
      <motion.div 
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center mb-6">
            <Leaf className="w-12 h-12 text-emerald-600 mr-4" />
            <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Environmental Education Revolution
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transforming theoretical knowledge into practical environmental action through innovative, gamified learning experiences.
          </p>
        </motion.div>

        {/* Problem Section */}
        <motion.div 
          className="mb-16"
          variants={itemVariants}
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-red-100 shadow-xl">
            <div className="flex items-center mb-6">
              <motion.div
                className="w-4 h-4 bg-red-500 rounded-full mr-4"
                variants={checkpointVariants}
                whileHover={{ scale: 1.2 }}
              />
              <h3 className="text-2xl font-bold text-red-700">The Challenge</h3>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Despite rising climate urgency, environmental education in Indian schools remains largely theoretical. 
                Students learn from textbooks with minimal real-world application or understanding of local ecological issues.
              </p>
              <p>
                Traditional methods fail to inspire sustainable habits or youth participation in environmental efforts, 
                lacking engaging tools that motivate eco-friendly practices.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Impact Section */}
        <motion.div 
          className="mb-16"
          variants={itemVariants}
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-amber-100 shadow-xl">
            <div className="flex items-center mb-6">
              <motion.div
                className="w-4 h-4 bg-amber-500 rounded-full mr-4"
                variants={checkpointVariants}
                whileHover={{ scale: 1.2 }}
              />
              <h3 className="text-2xl font-bold text-amber-700">The Impact</h3>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Future decision-makers need environmental literacy and empowerment for meaningful action. 
                Without innovation, we risk raising a generation unaware of sustainability challenges.
              </p>
              <p>
                Interactive, practical environmental learning fosters behavioral change, local involvement, 
                and creates ripple effects across families and communities—aligning with India's SDG goals and NEP 2020.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Expected Outcomes */}
        <motion.div 
          className="mb-16"
          variants={itemVariants}
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-emerald-100 shadow-xl">
            <div className="flex items-center mb-8">
              <motion.div
                className="w-4 h-4 bg-emerald-500 rounded-full mr-4"
                variants={checkpointVariants}
                whileHover={{ scale: 1.2 }}
              />
              <h3 className="text-2xl font-bold text-emerald-700">Expected Outcomes</h3>
            </div>
            
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
              {outcomes.map((outcome, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(16, 185, 129, 0.1)"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mr-4">
                      {outcome.icon}
                    </div>
                    <h4 className="font-bold text-emerald-800">{outcome.title}</h4>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{outcome.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stakeholders */}
        <motion.div 
          className="mb-16"
          variants={itemVariants}
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-blue-100 shadow-xl">
            <div className="flex items-center mb-6">
              <motion.div
                className="w-4 h-4 bg-blue-500 rounded-full mr-4"
                variants={checkpointVariants}
                whileHover={{ scale: 1.2 }}
              />
              <h3 className="text-2xl font-bold text-blue-700">Key Stakeholders</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {stakeholders.map((stakeholder, index) => (
                <motion.div
                  key={index}
                  className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <Users className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                  <span className="text-blue-800 font-medium text-sm">{stakeholder}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Supporting Data */}
        <motion.div 
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200 shadow-xl">
            <div className="flex items-center mb-6">
              <motion.div
                className="w-4 h-4 bg-purple-500 rounded-full mr-4"
                variants={checkpointVariants}
                whileHover={{ scale: 1.2 }}
              />
              <h3 className="text-2xl font-bold text-purple-700">Supporting Evidence</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div 
                className="flex items-start"
                whileHover={{ scale: 1.02 }}
              >
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  <span className="font-semibold">UNESCO reports:</span> Experiential, gamified learning increases 
                  student retention and engagement by over 70%.
                </p>
              </motion.div>
              
              <motion.div 
                className="flex items-start"
                whileHover={{ scale: 1.02 }}
              >
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  <span className="font-semibold">NEP 2020:</span> Encourages integration of environmental 
                  awareness into curriculum through experiential learning approaches.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Features;