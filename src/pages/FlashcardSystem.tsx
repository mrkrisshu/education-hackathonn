import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Filter, 
  BarChart3, 
  ArrowLeft, 
  ArrowRight, 
  Plus 
} from 'lucide-react';
import Flashcard from '../components/Flashcards/Flashcard';
import { useApp } from '../context/AppContext';

const FlashcardSystem: React.FC = () => {
  const { flashcards, updateFlashcards } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('due');
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);
  
  // Get unique deck names
  const decks = [...new Set(flashcards.map(card => card.deck))];
  
  // Filter cards based on active tab and selected deck
  const filteredCards = flashcards.filter(card => {
    if (selectedDeck && card.deck !== selectedDeck) return false;
    
    if (activeTab === 'due') {
      return new Date(card.nextReview) <= new Date();
    }
    
    return true;
  });

  const handleNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleKnow = () => {
    const updatedFlashcards = [...flashcards];
    const cardIndex = flashcards.findIndex(card => card.id === filteredCards[currentIndex].id);
    
    if (cardIndex !== -1) {
      const card = {...updatedFlashcards[cardIndex]};
      
      // Decrease difficulty (make easier, min 1)
      card.difficulty = Math.max(1, card.difficulty - 1);
      
      // Increase repetitions
      card.repetitions += 1;
      
      // Set next review date based on spaced repetition algorithm (simplified)
      const daysToAdd = card.repetitions * 2;
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + daysToAdd);
      
      card.nextReview = nextReview.toISOString();
      card.lastReviewed = new Date().toISOString();
      
      updatedFlashcards[cardIndex] = card;
      updateFlashcards(updatedFlashcards);
    }
    
    handleNext();
  };

  const handleDontKnow = () => {
    const updatedFlashcards = [...flashcards];
    const cardIndex = flashcards.findIndex(card => card.id === filteredCards[currentIndex].id);
    
    if (cardIndex !== -1) {
      const card = {...updatedFlashcards[cardIndex]};
      
      // Increase difficulty (make harder, max 5)
      card.difficulty = Math.min(5, card.difficulty + 1);
      
      // Reset repetitions
      card.repetitions = 0;
      
      // Set to review tomorrow
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + 1);
      
      card.nextReview = nextReview.toISOString();
      card.lastReviewed = new Date().toISOString();
      
      updatedFlashcards[cardIndex] = card;
      updateFlashcards(updatedFlashcards);
    }
    
    handleNext();
  };

  useEffect(() => {
    // Reset current index when filters change
    setCurrentIndex(0);
  }, [activeTab, selectedDeck]);

  // Calculate stats
  const totalCards = flashcards.length;
  const masteredCards = flashcards.filter(card => card.difficulty <= 2 && card.repetitions >= 3).length;
  const dueCards = flashcards.filter(card => new Date(card.nextReview) <= new Date()).length;
  
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
            <BookOpen className="mr-3 h-8 w-8 text-primary-600 dark:text-primary-400" />
            Flashcards
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Master concepts through spaced repetition
          </p>
        </div>
        
        <div className="flex mt-4 md:mt-0 space-x-2">
          <button 
            className="btn-outline flex items-center"
            onClick={() => setShowStats(!showStats)}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
          
          <button className="btn-primary flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            New Card
          </button>
        </div>
      </div>
      
      {showStats && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Cards</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCards}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Mastered</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{masteredCards}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  ({Math.round((masteredCards / totalCards) * 100)}%)
                </p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Due for Review</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dueCards}</p>
            </div>
          </div>
        </motion.div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex space-x-2 mb-4 md:mb-0">
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'due' 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30'
              }`}
              onClick={() => setActiveTab('due')}
            >
              Due Today ({dueCards})
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'all' 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All Cards
            </button>
          </div>
          
          <div className="relative">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <select 
                className="appearance-none bg-transparent border-0 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
                value={selectedDeck || ''}
                onChange={(e) => setSelectedDeck(e.target.value || null)}
              >
                <option value="">All Decks</option>
                {decks.map(deck => (
                  <option key={deck} value={deck}>{deck}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          {filteredCards.length > 0 ? (
            <>
              <Flashcard 
                question={filteredCards[currentIndex].question}
                answer={filteredCards[currentIndex].answer}
                onKnow={handleKnow}
                onDontKnow={handleDontKnow}
                deck={filteredCards[currentIndex].deck}
                difficulty={filteredCards[currentIndex].difficulty}
              />
              
              <div className="flex items-center justify-between mt-8">
                <button 
                  className="flex items-center text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentIndex + 1} of {filteredCards.length}
                </p>
                
                <button 
                  className="flex items-center text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleNext}
                  disabled={currentIndex === filteredCards.length - 1}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No flashcards {activeTab === 'due' ? 'due for review' : ''}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {activeTab === 'due' 
                  ? "You're all caught up! Check back later for more reviews." 
                  : "You haven't created any flashcards yet."}
              </p>
              <button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Create New Flashcard
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FlashcardSystem;