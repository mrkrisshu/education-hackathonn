import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, BarChart, CheckSquare, Calendar, Brain } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const featuresList = [
    {
      title: "Interactive Flashcards",
      description: "Master concepts with spaced repetition flashcards featuring beautiful 3D flip animations",
      icon: BookOpen,
      color: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
    },
    {
      title: "Adaptive Quizzes",
      description: "Challenge yourself with quizzes that adjust difficulty based on your performance",
      icon: BarChart,
      color: "bg-secondary-50 text-secondary-600 dark:bg-secondary-900/20 dark:text-secondary-400"
    },
    {
      title: "Daily Habit Tracking",
      description: "Build consistent study habits with visual progress indicators and streaks",
      icon: CheckSquare,
      color: "bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400"
    },
    {
      title: "Course Catalog",
      description: "Browse and filter courses by topic, difficulty, and estimated completion time",
      icon: Calendar,
      color: "bg-accent-50 text-accent-600 dark:bg-accent-900/20 dark:text-accent-400"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="py-4 px-6 md:px-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            EduMastery
          </Link>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              )}
            </button>
            <Link 
              to="/app"
              className="btn btn-primary"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="md:w-1/2 mb-12 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white mb-6">
                Master Your Learning Journey
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
                EduMastery combines powerful learning tools with beautiful design to help you learn more effectively and track your progress.
              </p>
              <Link 
                to="/app"
                className="btn btn-primary inline-flex items-center text-lg px-6 py-3"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg blur opacity-30 dark:opacity-40"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Student learning with EduMastery" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 md:px-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Learning Tools
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Every feature is designed to help you learn more effectively and enjoy the process.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuresList.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container mx-auto px-6 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your learning?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of students who've already improved their studying efficiency with EduMastery.
            </p>
            <Link 
              to="/app"
              className="btn inline-flex items-center bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium rounded-lg"
            >
              Start Learning Now <Brain className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-lg font-bold text-primary-600 dark:text-primary-400">EduMastery</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">© 2025 EduMastery. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                Terms
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                Privacy
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;