import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Target, Briefcase, Users, Building, Star, ArrowRight, Sparkles, Rocket, Zap, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Irregular SVG shapes for background
const BgShape1 = () => (
  <motion.svg
    viewBox="0 0 200 200"
    className="absolute w-[600px] h-[600px] -top-40 -right-20 opacity-30"
    initial={{ rotate: 0, scale: 1 }}
    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    <path
      fill="url(#gradient1)"
      d="M39.9,-65.7C54.1,-60.5,69.9,-54,78.1,-42.3C86.3,-30.6,86.9,-13.8,84.6,2C82.4,17.8,77.2,32.6,68.3,44.7C59.3,56.8,46.6,66.2,32.4,71.8C18.2,77.5,2.6,79.3,-13.4,77.6C-29.3,75.9,-45.6,70.6,-58.1,60.5C-70.6,50.4,-79.3,35.4,-83.7,18.7C-88.1,2,-88.2,-16.5,-81.8,-31.4C-75.4,-46.2,-62.5,-57.4,-48,-63.4C-33.5,-69.4,-17.7,-70.2,-2.3,-66.6C13.2,-63,25.7,-70.9,39.9,-65.7Z"
      transform="translate(100 100)"
    />
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#93c5fd' }} />
        <stop offset="100%" style={{ stopColor: '#c4b5fd' }} />
      </linearGradient>
    </defs>
  </motion.svg>
);

const BgShape2 = () => (
  <motion.svg
    viewBox="0 0 200 200"
    className="absolute w-[500px] h-[500px] bottom-0 -left-20 opacity-30"
    initial={{ rotate: 0, scale: 1 }}
    animate={{ rotate: -360, scale: [1, 1.2, 1] }}
    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
  >
    <path
      fill="url(#gradient2)"
      d="M42.7,-73.4C55.9,-67.3,67.7,-56.6,76.6,-43.2C85.5,-29.8,91.6,-14.9,90.5,-0.6C89.4,13.6,81.2,27.3,72.1,39.7C63,52.1,53.1,63.3,40.9,70.9C28.7,78.5,14.4,82.5,-0.2,82.8C-14.7,83.2,-29.4,79.8,-42.4,72.6C-55.4,65.3,-66.7,54.2,-74.8,41C-82.9,27.8,-87.8,12.4,-86.8,-2.3C-85.8,-17,-78.9,-31.1,-70.3,-43.6C-61.7,-56.1,-51.4,-67,-39.1,-73.1C-26.8,-79.3,-13.4,-80.7,0.8,-82C15,-83.3,29.5,-79.5,42.7,-73.4Z"
      transform="translate(100 100)"
    />
    <defs>
      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#fbcfe8' }} />
        <stop offset="100%" style={{ stopColor: '#ddd6fe' }} />
      </linearGradient>
    </defs>
  </motion.svg>
);

const BgShape3 = () => (
  <motion.svg
    viewBox="0 0 200 200"
    className="absolute w-[400px] h-[400px] top-1/3 right-1/4 opacity-30"
    initial={{ rotate: 0, scale: 1 }}
    animate={{ rotate: 180, scale: [1, 0.9, 1] }}
    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
  >
    <path
      fill="url(#gradient3)"
      d="M37.9,-64.3C49,-56.5,57.9,-45.5,65.9,-33.1C73.9,-20.7,81,-6.9,80.3,6.7C79.7,20.3,71.3,33.7,61.6,44.7C51.9,55.7,41,64.3,28.5,69.1C16,73.9,1.9,74.9,-12.9,73.6C-27.7,72.4,-43.2,69,-56.1,60.4C-69,51.8,-79.3,38.1,-83.7,22.7C-88.1,7.3,-86.6,-9.7,-80.8,-24.5C-75,-39.3,-64.9,-51.8,-52.1,-59.2C-39.3,-66.6,-23.8,-68.9,-9.2,-67.1C5.4,-65.3,26.8,-72.1,37.9,-64.3Z"
      transform="translate(100 100)"
    />
    <defs>
      <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#bfdbfe' }} />
        <stop offset="100%" style={{ stopColor: '#fae8ff' }} />
      </linearGradient>
    </defs>
  </motion.svg>
);

const FloatingElement = ({ delay, duration, children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration }}
    className={className}
  >
    {children}
  </motion.div>
);

const ActionCard = ({ icon: Icon, title, description, color, link, className }) => (
  <Link to={link}>
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative overflow-hidden group ${className}`}
    >
      {/* Card Background with Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/50 dark:from-white/10 dark:to-white/5 backdrop-blur-sm rounded-2xl" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-pink-100/50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
      
      {/* Card Content */}
      <div className="relative p-8 rounded-2xl border border-white/20">
        {/* Icon Container with Gradient */}
        <div className={`relative w-16 h-16 ${color} rounded-2xl overflow-hidden mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-8 h-8 text-white transform group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>

        {/* Title with Gradient */}
        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-6 ">
          {description}
        </p>

        {/* Action Button */}
        <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
          Get Started <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-white/5 to-white/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      </div>
    </motion.div>
  </Link>
);

const HeroSection = () => {
  const stats = [
    { icon: Briefcase, label: "Active Jobs", value: "1000+", color: "from-blue-500 to-blue-600" },
    { icon: Users, label: "Job Seekers", value: "50k+", color: "from-purple-500 to-pink-500" },
    { icon: Building, label: "Companies", value: "200+", color: "from-indigo-500 to-violet-500" },
    { icon: Star, label: "Success Rate", value: "95%", color: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="relative min-h-[90vh] overflow-hidden">
      {/* Background SVG Shapes */}
      <BgShape1 />
      <BgShape2 />
      <BgShape3 />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="lg:flex items-center gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2 relative z-10">
            <FloatingElement delay={0} duration={0.6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 mb-8"
              >
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI-Powered Job Search Platform
                </span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-8">
                <motion.span 
                  className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Elevate Your Career Journey
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-12"
              >
                Transform your job search experience with AI-powered tools, professional resume building, 
                and intelligent job matching. Stand out from the crowd and land your dream job faster.
              </motion.p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <FloatingElement
                    key={index}
                    delay={0.4 + index * 0.1}
                    duration={0.5}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-colors"
                  >
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                      <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="mt-4 text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      {stat.value}
                    </h3>
                    <p className="text-gray-500">{stat.label}</p>
                  </FloatingElement>
                ))}
              </div>
            </FloatingElement>
          </div>

          {/* Right Content - Action Cards */}
          <div className="lg:w-1/2 mt-16 lg:mt-0 relative">
            <div className="grid gap-8 relative z-10">
              <ActionCard
                icon={Wand2}
                title="Smart Resume Builder"
                description="Create stunning resumes with AI-powered suggestions, modern templates, and real-time optimization tips. Stand out to employers with professionally crafted resumes."
                color="bg-gradient-to-r from-blue-500 to-cyan-500"
                link="/resume-builder"
                className="transform lg:translate-x-12"
              />
              
              <ActionCard
                icon={Target}
                title="ATS Score Analyzer"
                description="Get instant ATS compatibility scores, keyword optimization suggestions, and formatting recommendations to ensure your resume passes through ATS systems."
                color="bg-gradient-to-r from-purple-500 to-pink-500"
                link="/ats-score"
                className="transform lg:-translate-x-12"
              />

              <ActionCard
                icon={Zap}
                title="AI Career Assistant"
                description="Receive personalized career guidance, job recommendations, and interview preparation tips powered by advanced AI technology."
                color="bg-gradient-to-r from-amber-500 to-orange-500"
                className="transform lg:translate-x-12"
                link="/ai-assistant"
              />
            </div>

            {/* Decorative Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] -z-10">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-blue-100/40 via-purple-100/40 to-pink-100/40 rounded-full blur-3xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
