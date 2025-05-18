import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface FlashcardProps {
  question: string;
  answer: string;
  onKnow: () => void;
  onDontKnow: () => void;
  deck: string;
  difficulty: number;
}

const Flashcard: React.FC<FlashcardProps> = ({ 
  question, 
  answer, 
  onKnow, 
  onDontKnow,
  deck,
  difficulty
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnow = () => {
    setIsFlipped(false);
    onKnow();
  };

  const handleDontKnow = () => {
    setIsFlipped(false);
    onDontKnow();
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div 
        className="flashcard-container w-full aspect-[4/3] mb-6 cursor-pointer"
        onClick={handleFlip}
      >
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
          <div className="flashcard-front bg-white dark:bg-gray-800 shadow-lg p-8 flex flex-col">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex justify-between items-center">
              <span className="pill bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                {deck}
              </span>
              <span>Difficulty: {difficulty}/5</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white">{question}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">Click to flip</p>
          </div>
          <div className="flashcard-back bg-white dark:bg-gray-800 shadow-lg p-8 flex flex-col">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex justify-between items-center">
              <span className="pill bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                {deck}
              </span>
              <span>Difficulty: {difficulty}/5</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white">{answer}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">Click to flip back</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-outline flex items-center justify-center px-6 py-3 text-error-600 dark:text-error-400 border-error-300 dark:border-error-700"
          onClick={handleDontKnow}
        >
          <X className="mr-2 h-5 w-5" />
          Don't Know
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-outline flex items-center justify-center px-6 py-3 text-success-600 dark:text-success-400 border-success-300 dark:border-success-700"
          onClick={handleKnow}
        >
          <Check className="mr-2 h-5 w-5" />
          Know
        </motion.button>
      </div>
    </div>
  );
};

export default Flashcard;