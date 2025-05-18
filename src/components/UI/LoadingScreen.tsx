import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-secondary-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-white mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          EduMastery
        </motion.h1>
        
        <div className="loading-dots flex justify-center items-center">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        
        <motion.p 
          className="text-white mt-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Loading your personalized learning experience...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;