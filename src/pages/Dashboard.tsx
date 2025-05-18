import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  BookOpen, 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Calendar 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const Dashboard: React.FC = () => {
  const { userData, flashcards, courses, habits } = useApp();
  
  const todayHabits = habits.filter(habit => 
    habit.frequency === 'daily' && !habit.completedDates.includes(new Date().toISOString().split('T')[0])
  );
  
  const dueTodayFlashcards = flashcards.filter(card => 
    new Date(card.nextReview).toDateString() === new Date().toDateString()
  );

  const inProgressCourses = courses.filter(course => 
    course.progress > 0 && course.progress < 100
  ).sort((a, b) => b.progress - a.progress);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {userData.name.split(' ')[0]}</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Here's an overview of your learning journey</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Study Streak</h3>
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{userData.progress.streak} days</p>
          <div className="flex space-x-1 mt-2">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 flex-1 rounded-full ${
                  i < userData.progress.streak % 7 
                    ? 'bg-primary-500' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              ></div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Courses Progress</h3>
            <div className="p-2 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {userData.progress.completedCourses}/{userData.progress.totalCourses}
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
            <div 
              className="bg-secondary-500 h-1.5 rounded-full" 
              style={{ width: `${(userData.progress.completedCourses / userData.progress.totalCourses) * 100}%` }}
            ></div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Flashcards Mastered</h3>
            <div className="p-2 rounded-lg bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {userData.progress.completedFlashcards}/{userData.progress.totalFlashcards}
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
            <div 
              className="bg-accent-500 h-1.5 rounded-full" 
              style={{ width: `${(userData.progress.completedFlashcards / userData.progress.totalFlashcards) * 100}%` }}
            ></div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Habits Completed</h3>
            <div className="p-2 rounded-lg bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400">
              <CheckSquare className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {habits.reduce((total, habit) => total + habit.completedDates.length, 0)}
          </p>
          <p className="text-sm text-success-600 dark:text-success-400 flex items-center mt-2">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+12% from last week</span>
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's habits */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Today's Habits</h2>
              <Link to="/app/habits" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {todayHabits.length > 0 ? (
              <div className="space-y-4">
                {todayHabits.slice(0, 3).map(habit => (
                  <div key={habit.id} className="flex items-center">
                    <div className="mr-4">
                      <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${habit.color}20`, color: habit.color }}>
                        <CheckSquare className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{habit.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{habit.description}</p>
                    </div>
                    <button className="ml-auto p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <CheckSquare className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">All habits completed for today!</p>
                <p className="text-sm text-success-600 dark:text-success-400 mt-1">Great job!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Due flashcards */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Due Today</h2>
              <Link to="/app/flashcards" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                Review all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {dueTodayFlashcards.length > 0 ? (
              <div className="space-y-4">
                {dueTodayFlashcards.slice(0, 3).map(card => (
                  <div key={card.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">{card.question}</p>
                    <div className="flex items-center text-sm">
                      <span className="pill bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 mr-2">
                        {card.deck}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        Difficulty: {card.difficulty}/5
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">No flashcards due for review today!</p>
                <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">Check back tomorrow</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* In progress courses */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Continue Learning</h2>
              <Link to="/app/courses" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                All courses
              </Link>
            </div>
          </div>
          <div className="p-6">
            {inProgressCourses.length > 0 ? (
              <div className="space-y-5">
                {inProgressCourses.slice(0, 2).map(course => (
                  <div key={course.id} className="flex">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="h-20 w-20 object-cover rounded-lg mr-4" 
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">{course.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{course.estimatedTime} hours</span>
                        <span className="mx-2">•</span>
                        <span>{course.difficulty}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-secondary-500 h-1.5 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{course.progress}% complete</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">No courses in progress</p>
                <Link to="/app/courses" className="text-sm text-primary-600 dark:text-primary-400 mt-1 block hover:underline">
                  Browse courses
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;