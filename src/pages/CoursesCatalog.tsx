import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Star, 
  Users, 
  Filter,
  ChevronDown,
  Brain,
  BarChart3,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const CoursesCatalog: React.FC = () => {
  const { courses } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique topics
  const topics = ['all', ...new Set(courses.map(course => course.topic))];

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    if (searchTerm && !course.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedTopic !== 'all' && course.topic !== selectedTopic) {
      return false;
    }
    if (selectedDifficulty !== 'all' && course.difficulty !== selectedDifficulty) {
      return false;
    }
    if (selectedDuration !== 'all') {
      const duration = parseInt(selectedDuration);
      if (duration === 60) {
        return course.estimatedTime >= 60;
      }
      return course.estimatedTime <= duration;
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <BookOpen className="mr-3 h-8 w-8 text-primary-600 dark:text-primary-400" />
            Course Catalog
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Explore our comprehensive collection of courses
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary-500"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="btn-outline flex items-center md:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Topic
                    </label>
                    <select
                      className="input"
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                    >
                      {topics.map(topic => (
                        <option key={topic} value={topic}>
                          {topic === 'all' ? 'All Topics' : topic}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Difficulty
                    </label>
                    <select
                      className="input"
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                    >
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration
                    </label>
                    <select
                      className="input"
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                    >
                      <option value="all">Any Duration</option>
                      <option value="20">Under 20 hours</option>
                      <option value="40">Under 40 hours</option>
                      <option value="60">60+ hours</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden"
                >
                  <div className="relative aspect-video">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center space-x-2 text-white mb-2">
                        <span className="text-sm bg-black/40 px-2 py-1 rounded-full">
                          {course.topic}
                        </span>
                        <span className="text-sm bg-black/40 px-2 py-1 rounded-full capitalize">
                          {course.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.estimatedTime}h
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-warning-500" />
                        {course.rating}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.enrollments}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
                          alt={course.instructor}
                          className="h-8 w-8 rounded-full object-cover mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {course.instructor}
                        </span>
                      </div>
                      <motion.button
                        className="btn-primary text-sm px-4"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Enroll Now
                      </motion.button>
                    </div>

                    {course.progress > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="text-primary-600 dark:text-primary-400">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                          <motion.div
                            className="bg-primary-500 h-1.5 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No courses found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Courses</h3>
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Learners</h3>
            <div className="p-2 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {courses.reduce((sum, course) => sum + course.enrollments, 0)}
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Rating</h3>
            <div className="p-2 rounded-lg bg-warning-50 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400">
              <Star className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CoursesCatalog;