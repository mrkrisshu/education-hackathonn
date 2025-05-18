import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Search, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { userData } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when changing routes
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/app" className="text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400">
              EduMastery
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-primary-500 w-40 lg:w-60 transition-all"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button className="hidden md:flex relative items-center justify-center w-10 h-10 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary-600"></span>
            </button>

            <div className="hidden md:block">
              <Link to="/app" className="flex items-center space-x-2">
                <div className="relative">
                  <img 
                    src={userData.avatar} 
                    alt={userData.name} 
                    className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-800"
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success-500 border-2 border-white dark:border-gray-800"></span>
                </div>
              </Link>
            </div>

            <button 
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-1"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center mb-4 space-x-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-primary-500 w-full transition-all"
                />
                <Search className="absolute left-7 top-[5.2rem] h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              
              <button 
                className="flex items-center justify-center w-10 h-10 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={userData.avatar} 
                alt={userData.name} 
                className="h-10 w-10 rounded-full object-cover" 
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{userData.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{userData.email}</p>
              </div>
            </div>

            <nav>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/app" 
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/app/flashcards" 
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Flashcards
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/app/quiz" 
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Quizzes
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/app/habits" 
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Habits
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/app/courses" 
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Courses
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/app/reading" 
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Reading Log
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/app/notes" 
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Notes
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/app/videos" 
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Videos
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/app/schedule" 
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Schedule
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;