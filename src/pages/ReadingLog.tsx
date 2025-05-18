import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Star, 
  Search,
  ArrowUpDown,
  Calendar,
  Clock,
  Bookmark,
  X,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format, isValid, parseISO } from 'date-fns';

type SortField = 'title' | 'author' | 'dateStarted' | 'dateFinished' | 'rating' | 'progress';
type SortOrder = 'asc' | 'desc';

const ReadingLog: React.FC = () => {
  const { readingLogs, updateReadingLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('dateStarted');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: 'Programming',
    dateStarted: new Date().toISOString().split('T')[0],
    rating: 0,
    progress: 0,
    notes: '',
    coverImage: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
  });

  // Get unique genres
  const genres = ['all', ...new Set(readingLogs.map(log => log.genre))];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedLogs = [...readingLogs]
    .filter(log => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          log.title.toLowerCase().includes(searchLower) ||
          log.author.toLowerCase().includes(searchLower) ||
          log.genre.toLowerCase().includes(searchLower)
        );
      }
      if (selectedGenre !== 'all') {
        return log.genre === selectedGenre;
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'title':
        case 'author':
          comparison = a[sortField].localeCompare(b[sortField]);
          break;
        case 'dateStarted':
        case 'dateFinished':
          const dateA = a[sortField] ? new Date(a[sortField]).getTime() : 0;
          const dateB = b[sortField] ? new Date(b[sortField]).getTime() : 0;
          comparison = dateA - dateB;
          break;
        case 'rating':
        case 'progress':
          comparison = a[sortField] - b[sortField];
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const addBook = () => {
    if (!newBook.title || !newBook.author) return;
    
    // Use isValid to validate the date
    if (!isValid(parseISO(newBook.dateStarted))) {
      alert('Please enter a valid start date');
      return;
    }

    const newBookObj = {
      id: Math.max(0, ...readingLogs.map(log => log.id)) + 1,
      ...newBook,
      dateFinished: null,
    };

    updateReadingLogs([...readingLogs, newBookObj]);
    setNewBook({
      title: '',
      author: '',
      genre: 'Programming',
      dateStarted: new Date().toISOString().split('T')[0],
      rating: 0,
      progress: 0,
      notes: '',
      coverImage: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    });
    setShowAddModal(false);
  };

  const StarRating: React.FC<{ rating: number; onRate?: (rating: number) => void }> = ({ rating, onRate }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            className={`${
              star <= rating
                ? 'text-warning-500'
                : 'text-gray-300 dark:text-gray-600'
            }`}
            whileHover={onRate ? { scale: 1.2 } : {}}
            whileTap={onRate ? { scale: 0.9 } : {}}
            onClick={() => onRate?.(star)}
          >
            <Star className="h-5 w-5 fill-current" />
          </motion.button>
        ))}
      </div>
    );
  };

  // Count books currently being read (progress > 0 but not finished)
  const currentlyReadingCount = readingLogs.filter(log => !log.dateFinished && log.progress > 0).length;

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
            Reading Log
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track your reading progress and take notes
          </p>
        </div>
        
        <motion.button
          className="btn-primary flex items-center mt-4 md:mt-0"
          onClick={() => setShowAddModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Books</h3>
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{readingLogs.length}</p>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Books Completed</h3>
            <div className="p-2 rounded-lg bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400">
              <Bookmark className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {readingLogs.filter(log => log.dateFinished).length}
          </p>
        </motion.div>

        {/* Added Clock icon here */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Currently Reading</h3>
            <div className="p-2 rounded-lg bg-info-50 dark:bg-info-900/20 text-info-600 dark:text-info-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentlyReadingCount}</p>
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
            {(readingLogs.reduce((sum, log) => sum + (log.rating || 0), 0) / readingLogs.filter(log => log.rating > 0).length).toFixed(1)}
          </p>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary-500"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Using ChevronDown in the dropdown */}
            <div className="relative inline-block">
              <div className="flex items-center space-x-1 cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {selectedGenre === 'all' ? 'All Genres' : selectedGenre}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Book
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('author')}
                >
                  <div className="flex items-center">
                    Author
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                {/* Added Calendar icon in the date column */}
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('dateStarted')}
                >
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    Started
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('progress')}
                >
                  <div className="flex items-center">
                    Progress
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('rating')}
                >
                  <div className="flex items-center">
                    Rating
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedLogs.map((log) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={log.coverImage}
                        alt={log.title}
                        className="h-12 w-8 object-cover rounded mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {log.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {log.genre}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {log.author}
                  </td>
                  {/* Using isValid to check date validity before formatting */}
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {isValid(parseISO(log.dateStarted)) 
                      ? format(parseISO(log.dateStarted), 'MMM d, yyyy')
                      : 'Invalid date'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                      <motion.div
                        className="bg-primary-500 h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${log.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {log.progress}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StarRating rating={log.rating} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {sortedLogs.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No books found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your filters or add a new book
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Book Modal */}
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Book</h3>
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
                      value={newBook.title}
                      onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                      placeholder="Enter book title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={newBook.author}
                      onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                      placeholder="Enter author name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Genre
                    </label>
                    <div className="relative">
                      <select
                        className="input pr-8"
                        value={newBook.genre}
                        onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                      >
                        {genres.filter(g => g !== 'all').map(genre => (
                          <option key={genre} value={genre}>{genre}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    {/* Added Calendar icon in date input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        className="input pl-10"
                        value={newBook.dateStarted}
                        onChange={(e) => setNewBook({ ...newBook, dateStarted: e.target.value })}
                      />
                    </div>
                    {/* Using isValid to validate date on input change */}
                    {newBook.dateStarted && !isValid(parseISO(newBook.dateStarted)) && (
                      <p className="text-xs text-error-500 mt-1">Please enter a valid date</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Initial Progress
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        className="w-full"
                        value={newBook.progress}
                        onChange={(e) => setNewBook({ ...newBook, progress: parseInt(e.target.value) })}
                      />
                      <span className="ml-2 w-10 text-center">{newBook.progress}%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Initial Rating
                    </label>
                    <StarRating 
                      rating={newBook.rating} 
                      onRate={(rating) => setNewBook({ ...newBook, rating })} 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notes
                    </label>
                    <textarea
                      className="input"
                      value={newBook.notes}
                      onChange={(e) => setNewBook({ ...newBook, notes: e.target.value })}
                      placeholder="Add your notes..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reading Schedule
                    </label>
                    {/* Using the Clock icon for reading time allocation */}
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                      <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Set a regular time for reading to build a habit
                      </span>
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
                    onClick={addBook}
                    disabled={!newBook.title || !newBook.author}
                  >
                    Add Book
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

export default ReadingLog;