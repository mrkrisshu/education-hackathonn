import React, { useState, useRef } from 'react';

import { motion, Reorder, useDragControls, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  Circle, 
  Plus,
  ChevronDown,
  ChevronUp,
  GripVertical,
  X,
  Edit,
  Trash2,
  Filter
} from 'lucide-react';
import { format, addDays, isBefore, isAfter, isSameDay, parseISO } from 'date-fns';
import { useApp } from '../context/AppContext';

// Types
interface Lesson {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  duration: number; // in minutes
  subject: string;
  priority: 'low' | 'medium' | 'high';
  color: string;
}

type FilterOption = 'all' | 'upcoming' | 'completed' | 'overdue';
type GroupByOption = 'date' | 'subject' | 'priority';

const LessonTracker: React.FC = () => {
  const { lessons: initialLessons, updateLessons } = useApp();
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons || []);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [groupBy, setGroupBy] = useState<GroupByOption>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([format(new Date(), 'yyyy-MM-dd')]);
  
  const dragControls = useDragControls();
  const containerRef = useRef<HTMLDivElement>(null);

  // New lesson template
  const [newLesson, setNewLesson] = useState<Omit<Lesson, 'id'>>({
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    completed: false,
    duration: 60,
    subject: 'General',
    priority: 'medium',
    color: '#3B82F6'
  });

  // Handler for saving lessons back to context
  const saveLessons = (updatedLessons: Lesson[]) => {
    setLessons(updatedLessons);
    updateLessons(updatedLessons);
  };

  // Filter lessons based on active filter and search query
  const filteredLessons = lessons.filter(lesson => {
    // Filter by status
    if (activeFilter === 'upcoming') {
      if (lesson.completed || isBefore(parseISO(lesson.dueDate), new Date()) && !isSameDay(parseISO(lesson.dueDate), new Date())) {
        return false;
      }
    } else if (activeFilter === 'completed') {
      if (!lesson.completed) return false;
    } else if (activeFilter === 'overdue') {
      if (lesson.completed || !isBefore(parseISO(lesson.dueDate), new Date())) return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        lesson.title.toLowerCase().includes(query) ||
        lesson.description.toLowerCase().includes(query) ||
        lesson.subject.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Group lessons based on groupBy option
  const groupedLessons = filteredLessons.reduce<Record<string, Lesson[]>>((acc, lesson) => {
    let groupKey: string;
    
    if (groupBy === 'date') {
      groupKey = lesson.dueDate;
    } else if (groupBy === 'subject') {
      groupKey = lesson.subject;
    } else {
      groupKey = lesson.priority;
    }
    
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    
    acc[groupKey].push(lesson);
    return acc;
  }, {});

  // Sort group keys based on groupBy option
  const sortedGroupKeys = Object.keys(groupedLessons).sort((a, b) => {
    if (groupBy === 'date') {
      return parseISO(a).getTime() - parseISO(b).getTime();
    } else if (groupBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a as 'high' | 'medium' | 'low'] - priorityOrder[b as 'high' | 'medium' | 'low'];
    }
    return a.localeCompare(b);
  });

  // Toggle completion status
  const toggleComplete = (id: string) => {
    const updatedLessons = lessons.map(lesson => 
      lesson.id === id ? { ...lesson, completed: !lesson.completed } : lesson
    );
    saveLessons(updatedLessons);
  };

  // Add new lesson
  const addLesson = () => {
    if (!newLesson.title) return;

    const lesson: Lesson = {
      ...newLesson,
      id: Date.now().toString()
    };

    saveLessons([...lessons, lesson]);
    setShowAddModal(false);
    setNewLesson({
      title: '',
      description: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      completed: false,
      duration: 60,
      subject: 'General',
      priority: 'medium',
      color: '#3B82F6'
    });
    
    // Expand the group containing the new lesson
    if (groupBy === 'date') {
      setExpandedGroups(prev => [...prev, lesson.dueDate]);
    } else if (groupBy === 'subject') {
      setExpandedGroups(prev => [...prev, lesson.subject]);
    } else {
      setExpandedGroups(prev => [...prev, lesson.priority]);
    }
  };

  // Update existing lesson
  const updateLesson = () => {
    if (!editingLesson) return;
    
    const updatedLessons = lessons.map(lesson => 
      lesson.id === editingLesson.id ? editingLesson : lesson
    );
    saveLessons(updatedLessons);
    setEditingLesson(null);
  };

  // Delete a lesson
  const deleteLesson = (id: string) => {
    const updatedLessons = lessons.filter(lesson => lesson.id !== id);
    saveLessons(updatedLessons);
    
    if (editingLesson?.id === id) {
      setEditingLesson(null);
    }
  };

  // Handle drag-to-reschedule
  const handleDragEnd = (id: string, destinationGroup: string) => {
    if (groupBy !== 'date') return; // Only allow rescheduling when grouped by date
    
    const updatedLessons = lessons.map(lesson => 
      lesson.id === id ? { ...lesson, dueDate: destinationGroup } : lesson
    );
    saveLessons(updatedLessons);
  };

  // Toggle group expansion
  const toggleGroupExpansion = (groupKey: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupKey) 
        ? prev.filter(g => g !== groupKey) 
        : [...prev, groupKey]
    );
  };

  // Format group title based on groupBy option
  const formatGroupTitle = (groupKey: string): string => {
    if (groupBy === 'date') {
      const date = parseISO(groupKey);
      const today = new Date();
      const tomorrow = addDays(today, 1);
      
      if (isSameDay(date, today)) {
        return `Today - ${format(date, 'MMMM d, yyyy')}`;
      } else if (isSameDay(date, tomorrow)) {
        return `Tomorrow - ${format(date, 'MMMM d, yyyy')}`;
      } else {
        return format(date, 'EEEE, MMMM d, yyyy');
      }
    } else if (groupBy === 'priority') {
      return groupKey.charAt(0).toUpperCase() + groupKey.slice(1) + ' Priority';
    } else {
      return groupKey;
    }
  };

  // Get subjects and priorities lists for dropdowns
  const subjects = Array.from(new Set(lessons.map(lesson => lesson.subject)));
  const priorities = ['low', 'medium', 'high'];

  // Calculate statistics
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const overdueLessons = lessons.filter(lesson => 
    !lesson.completed && isBefore(parseISO(lesson.dueDate), new Date())
  ).length;
  const upcomingLessons = lessons.filter(lesson => 
    !lesson.completed && (isAfter(parseISO(lesson.dueDate), new Date()) || isSameDay(parseISO(lesson.dueDate), new Date()))
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
      ref={containerRef}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Calendar className="mr-3 h-8 w-8 text-primary-600 dark:text-primary-400" />
            Lesson Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Schedule and track your learning journey
          </p>
        </div>
        
        <motion.button
          className="btn-primary flex items-center mt-4 md:mt-0"
          onClick={() => setShowAddModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Lesson
        </motion.button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Lessons</h3>
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalLessons}</p>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</h3>
            <div className="p-2 rounded-lg bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{completedLessons}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0}% completion rate
          </p>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming</h3>
            <div className="p-2 rounded-lg bg-info-50 dark:bg-info-900/20 text-info-600 dark:text-info-400">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{upcomingLessons}</p>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue</h3>
            <div className="p-2 rounded-lg bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{overdueLessons}</p>
        </motion.div>
      </div>

      {/* Filters and search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search lessons..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 flex-wrap">
            <div className="min-w-[150px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status Filter</label>
              <div className="relative">
                <select
                  className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary-500"
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value as FilterOption)}
                >
                  <option value="all">All Lessons</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="min-w-[150px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Group By</label>
              <div className="relative">
                <select
                  className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary-500"
                  value={groupBy}
                  onChange={(e) => {
                    setGroupBy(e.target.value as GroupByOption);
                    // Reset expanded groups when changing grouping
                    setExpandedGroups([]);
                  }}
                >
                  <option value="date">Due Date</option>
                  <option value="subject">Subject</option>
                  <option value="priority">Priority</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons timeline */}
      <div className="space-y-6 mb-10">
        {sortedGroupKeys.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No lessons found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {activeFilter !== 'all' || searchQuery 
                ? "Try adjusting your filters or search query"
                : "Start by adding your first lesson to track your learning journey"}
            </p>
            {(activeFilter === 'all' && !searchQuery) && (
              <button 
                className="btn-primary inline-flex items-center"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Lesson
              </button>
            )}
          </div>
        ) : (
          sortedGroupKeys.map(groupKey => (
            <motion.div
              key={groupKey}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer"
                onClick={() => toggleGroupExpansion(groupKey)}
              >
                <div className="flex items-center">
                  {groupBy === 'priority' && (
                    <div 
                                            className={`w-3 h-3 rounded-full mr-3 ${
                        groupKey === 'high' 
                          ? 'bg-error-500' 
                          : groupKey === 'medium' 
                            ? 'bg-warning-500'
                            : 'bg-success-500'
                      }`}
                    />
                  )}
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {formatGroupTitle(groupKey)}
                  </h3>
                  <div className="ml-3 px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {groupedLessons[groupKey].length} {groupedLessons[groupKey].length === 1 ? 'lesson' : 'lessons'}
                  </div>
                </div>
                <div className="flex items-center">
                  {expandedGroups.includes(groupKey) ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {expandedGroups.includes(groupKey) && (
                <Reorder.Group 
                  axis="y" 
                  values={groupedLessons[groupKey].map(l => l.id)} 
                  onReorder={(newOrder) => {
                    const reorderedLessons = [...lessons];
                    // Update the lesson order based on the new arrangement
                    newOrder.forEach((id, index) => {
                      const lessonIndex = reorderedLessons.findIndex(l => l.id === id);
                      if (lessonIndex !== -1) {
                        const [lesson] = reorderedLessons.splice(lessonIndex, 1);
                        reorderedLessons.splice(index, 0, lesson);
                      }
                    });
                    saveLessons(reorderedLessons);
                  }}
                  className="divide-y divide-gray-200 dark:divide-gray-700"
                >
                  {groupedLessons[groupKey].map(lesson => (
                    <Reorder.Item
                      key={lesson.id}
                      value={lesson.id}
                      dragListener={false}
                      dragControls={dragControls}
                      className="bg-white dark:bg-gray-800 transition-colors"
                    >
                      <div 
                        className={`p-4 flex items-start gap-3 ${lesson.completed ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
                        onDragOver={(e) => {
                          // Prevent default to allow drop
                          e.preventDefault();
                        }}
                        onDrop={(e) => {
                          // Handle dropping a lesson into this date group
                          e.preventDefault();
                          const draggedId = e.dataTransfer.getData('lesson-id');
                          if (draggedId && groupBy === 'date') {
                            handleDragEnd(draggedId, groupKey);
                          }
                        }}
                      >
                        {/* Drag handle */}
                        <div 
                          className="cursor-move mt-1"
                          onPointerDown={(e) => dragControls.start(e)}
                          draggable
                          onDragStart={(e) => {
                            // Set the lesson ID in the drag data
                            e.dataTransfer.setData('lesson-id', lesson.id);
                          }}
                        >
                          <GripVertical className="h-5 w-5 text-gray-400" />
                        </div>
                        
                        {/* Completion checkbox */}
                        <button 
                          className="mt-1 text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                          onClick={() => toggleComplete(lesson.id)}
                        >
                          {lesson.completed ? (
                            <CheckCircle className="h-5 w-5 text-success-500" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </button>
                        
                        {/* Lesson content */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h4 className={`font-medium ${lesson.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                              {lesson.title}
                            </h4>
                            <div className="flex items-center space-x-3">
                              {/* Show relevant metadata based on grouping */}
                              {groupBy !== 'date' && (
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>{format(parseISO(lesson.dueDate), 'MMM d')}</span>
                                </div>
                              )}
                              
                              {groupBy !== 'subject' && lesson.subject && (
                                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                  {lesson.subject}
                                </span>
                              )}
                              
                              {groupBy !== 'priority' && (
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  lesson.priority === 'high' 
                                    ? 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300' 
                                    : lesson.priority === 'medium' 
                                      ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300' 
                                      : 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                                }`}>
                                  {lesson.priority.charAt(0).toUpperCase() + lesson.priority.slice(1)}
                                </span>
                              )}
                              
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{lesson.duration} min</span>
                              </div>
                            </div>
                          </div>
                          
                          {lesson.description && (
                            <p className={`mt-1 text-sm ${lesson.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                              {lesson.description}
                            </p>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="relative">
                          <button 
                            onClick={() => setEditingLesson(lesson)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => deleteLesson(lesson.id)}
                            className="p-1 text-gray-400 hover:text-error-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Add Lesson Modal */}
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Lesson</h3>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setShowAddModal(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                    placeholder="Enter lesson title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    className="input"
                    value={newLesson.description}
                    onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                    placeholder="Enter lesson description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Due Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        className="input pl-10"
                        value={newLesson.dueDate}
                        onChange={(e) => setNewLesson({ ...newLesson, dueDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration (minutes)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        className="input pl-10"
                        min="5"
                        max="240"
                        step="5"
                        value={newLesson.duration}
                        onChange={(e) => setNewLesson({ ...newLesson, duration: parseInt(e.target.value) || 60 })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subject
                    </label>
                    <div className="relative">
                      <select
                        className="input pr-8"
                        value={newLesson.subject}
                        onChange={(e) => setNewLesson({ ...newLesson, subject: e.target.value })}
                      >
                        {[...new Set(['General', ...subjects])].map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                        <option value="custom">+ Add New Subject</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    {newLesson.subject === 'custom' && (
                      <input
                        type="text"
                        className="input mt-2"
                        placeholder="Enter new subject"
                        onChange={(e) => setNewLesson({ ...newLesson, subject: e.target.value })}
                        autoFocus
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <div className="relative">
                      <select
                        className="input pr-8"
                        value={newLesson.priority}
                        onChange={(e) => setNewLesson({ ...newLesson, priority: e.target.value as 'low' | 'medium' | 'high' })}
                      >
                        {priorities.map(priority => (
                          <option key={priority} value={priority}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
                    onClick={addLesson}
                    disabled={!newLesson.title}
                  >
                    Add Lesson
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Lesson Modal */}
      <AnimatePresence>
        {editingLesson && (
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Lesson</h3>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setEditingLesson(null)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={editingLesson.title}
                    onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                    placeholder="Enter lesson title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    className="input"
                    value={editingLesson.description}
                    onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                    placeholder="Enter lesson description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Due Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        className="input pl-10"
                        value={editingLesson.dueDate}
                        onChange={(e) => setEditingLesson({ ...editingLesson, dueDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration (minutes)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        className="input pl-10"
                        min="5"
                        max="240"
                        step="5"
                        value={editingLesson.duration}
                        onChange={(e) => setEditingLesson({ ...editingLesson, duration: parseInt(e.target.value) || 60 })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subject
                    </label>
                    <div className="relative">
                      <select
                        className="input pr-8"
                        value={subjects.includes(editingLesson.subject) ? editingLesson.subject : 'custom'}
                        onChange={(e) => {
                          if (e.target.value !== 'custom') {
                            setEditingLesson({ ...editingLesson, subject: e.target.value });
                          }
                        }}
                      >
                        {[...new Set(['General', ...subjects])].map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                        <option value="custom">+ Add New Subject</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    {!subjects.includes(editingLesson.subject) && (
                      <input
                        type="text"
                        className="input mt-2"
                        placeholder="Enter new subject"
                        value={editingLesson.subject}
                        onChange={(e) => setEditingLesson({ ...editingLesson, subject: e.target.value })}
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <div className="relative">
                      <select
                        className="input pr-8"
                        value={editingLesson.priority}
                        onChange={(e) => setEditingLesson({ ...editingLesson, priority: e.target.value as 'low' | 'medium' | 'high' })}
                      >
                        {priorities.map(priority => (
                          <option key={priority} value={priority}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center mt-2">
                  <input
                                        id="completed-checkbox"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    checked={editingLesson.completed}
                    onChange={(e) => setEditingLesson({ ...editingLesson, completed: e.target.checked })}
                  />
                  <label htmlFor="completed-checkbox" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Mark as completed
                  </label>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    className="btn-outline"
                    onClick={() => setEditingLesson(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary"
                    onClick={updateLesson}
                    disabled={!editingLesson.title}
                  >
                    Update Lesson
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help tooltip */}
      <div className="fixed bottom-5 right-5">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-help">
          <div className="relative group">
            <span className="sr-only">Help with lesson tracker</span>
            <div className="absolute bottom-full right-0 mb-2 w-64 hidden group-hover:block">
              <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg text-sm">
                <p className="font-medium mb-1">Drag & Drop Tips:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Drag lessons to reorder within a group</li>
                  {groupBy === 'date' && (
                    <li>Drag lessons between dates to reschedule</li>
                  )}
                  <li>Click group headers to expand/collapse</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-medium">Drag to Reorder</span>
              <GripVertical className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LessonTracker;