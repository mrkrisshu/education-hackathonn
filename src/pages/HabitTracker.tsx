import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  TrendingUp, 
  BarChart3,
  Trash2,
  Edit,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { parseISO, isToday } from 'date-fns';

// Define types first for better error checking
interface Habit {
  id: number;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly';
  category: string;
  color: string;
  streak: number;
  completedDates: string[];
}

interface NewHabit {
  title: string;
  description: string;
  frequency: 'daily' | 'weekly';
  category: string;
  color: string;
}

const HabitTracker: React.FC = () => {
  const { habits, updateHabits } = useApp();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newHabit, setNewHabit] = useState<NewHabit>({
    title: '',
    description: '',
    frequency: 'daily',
    category: 'Education',
    color: '#4F46E5',
  });

  const categories: string[] = ['Education', 'Health', 'Productivity', 'Personal'];
  const colors: string[] = [
    '#4F46E5', // primary
    '#0EA5E9', // secondary
    '#8B5CF6', // accent
    '#22C55E', // success
    '#F59E0B', // warning
    '#EF4444', // error
  ];

  const toggleHabitCompletion = (habitId: number): void => {
    const today = new Date().toISOString().split('T')[0];
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(today);
        const completedDates = isCompleted
          ? habit.completedDates.filter((date: string) => date !== today)
          : [...habit.completedDates, today];
        
        return {
          ...habit,
          completedDates,
          streak: isCompleted 
            ? Math.max(0, habit.streak - 1)
            : habit.streak + 1,
        };
      }
      return habit;
    });
    
    updateHabits(updatedHabits);
  };

  const addHabit = (): void => {
    if (!newHabit.title) return;

    const newHabitObj: Habit = {
      id: Math.max(0, ...habits.map(h => h.id)) + 1,
      ...newHabit,
      streak: 0,
      completedDates: [],
    };

    updateHabits([...habits, newHabitObj]);
    setNewHabit({
      title: '',
      description: '',
      frequency: 'daily',
      category: 'Education',
      color: '#4F46E5',
    });
    setShowAddModal(false);
  };

  const deleteHabit = (habitId: number): void => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    updateHabits(updatedHabits);
  };

  const calculateProgress = (habit: Habit): number => {
    if (habit.frequency === 'daily') {
      return habit.completedDates.filter((date: string) => {
        const parsedDate: Date = parseISO(date);
        return isToday(parsedDate);
      }).length > 0 ? 100 : 0;
    }

    // For weekly habits
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const completedThisWeek = habit.completedDates.filter((date: string) => {
      const parsedDate: Date = parseISO(date);
      return parsedDate >= startOfWeek;
    }).length;

    return Math.min((completedThisWeek / 7) * 100, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <CheckSquare className="mr-3 h-8 w-8 text-primary-600 dark:text-primary-400" />
            Habit Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Build and maintain positive learning habits
          </p>
        </div>
        
        <motion.button
          className="btn-primary flex items-center mt-4 md:mt-0"
          onClick={() => setShowAddModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Habit
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Habits</h3>
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
              <CheckSquare className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{habits.length}</p>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Today</h3>
            <div className="p-2 rounded-lg bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {habits.filter(habit => 
              habit.completedDates.some((date: string) => {
                const parsedDate: Date = parseISO(date);
                return isToday(parsedDate);
              })
            ).length}
          </p>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Longest Streak</h3>
            <div className="p-2 rounded-lg bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {Math.max(0, ...habits.map(h => h.streak))} days
          </p>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Habits</h2>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {habits.map(habit => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <div 
                      className="h-10 w-10 rounded-lg flex items-center justify-center mr-4" 
                      style={{ 
                        backgroundColor: `${habit.color}20`,
                        color: habit.color
                      }}
                    >
                      <CheckSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{habit.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{habit.description}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                          {habit.category}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                          {habit.frequency}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                          {habit.streak} day streak
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteHabit(habit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      className={`p-2 rounded-lg ${
                        habit.completedDates.some((date: string) => {
                          const parsedDate: Date = parseISO(date);
                          return isToday(parsedDate);
                        })
                          ? 'bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleHabitCompletion(habit.id)}
                    >
                      <CheckSquare className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>

                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-primary-600 dark:text-primary-400">
                        Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-primary-600 dark:text-primary-400">
                        {calculateProgress(habit)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-600">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${calculateProgress(habit)}%` }}
                      transition={{ duration: 0.5 }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                    ></motion.div>
                  </div>
                </div>

                <div className="flex space-x-1">
                  {[...Array(7)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 flex-1 rounded-full ${
                        i < habit.streak % 7
                          ? 'bg-primary-500 dark:bg-primary-400'
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    ></div>
                  ))}
                </div>
              </motion.div>
            ))}

            {habits.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No habits yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Start building positive habits by adding your first one
                </p>
                <button 
                  className="btn-primary"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Habit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Habit</h3>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setShowAddModal(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={newHabit.title}
                      onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                      placeholder="Enter habit title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      className="input"
                      value={newHabit.description}
                      onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                      placeholder="Enter habit description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      className="input"
                      value={newHabit.category}
                      onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Frequency
                    </label>
                    <select
                      className="input"
                      value={newHabit.frequency}
                      onChange={(e) => setNewHabit({ 
                        ...newHabit, 
                        frequency: e.target.value as 'daily' | 'weekly'
                      })}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Color
                    </label>
                    <div className="flex space-x-2">
                      {colors.map(color => (
                                                <motion.button
                          key={color}
                          className={`w-8 h-8 rounded-full ${
                            newHabit.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setNewHabit({ ...newHabit, color })}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    className="btn-outline"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary"
                    onClick={addHabit}
                    disabled={!newHabit.title}
                  >
                    Add Habit
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HabitTracker;