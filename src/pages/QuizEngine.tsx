import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  ArrowRight,
  Filter,
  Timer,
  Brain,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface QuizState {
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  score: number;
  answers: boolean[];
  completed: boolean;
  timeSpent: number;
}

const QuizEngine: React.FC = () => {
  const { quizzes } = useApp();
  const [selectedQuiz, setSelectedQuiz] = useState(quizzes[0]);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswer: null,
    score: 0,
    answers: [],
    completed: false,
    timeSpent: 0,
  });
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [topic, setTopic] = useState<string>('all');

  // Get unique topics
  const topics = ['all', ...new Set(quizzes.map(quiz => quiz.topic))];

  // Filter quizzes based on selected filters
  const filteredQuizzes = quizzes.filter(quiz => {
    if (topic !== 'all' && quiz.topic !== topic) return false;
    if (quiz.difficulty !== difficulty) return false;
    return true;
  });

  useEffect(() => {
    if (!quizState.completed && selectedQuiz) {
      const timerInstance = setInterval(() => {
        setQuizState(prev => ({
          ...prev,
          timeSpent: prev.timeSpent + 1,
        }));
      }, 1000);
      setTimer(timerInstance);

      return () => {
        if (timerInstance) clearInterval(timerInstance);
      };
    }
  }, [quizState.completed, selectedQuiz]);

  const handleAnswerSelect = (answer: string) => {
    if (quizState.selectedAnswer !== null) return;

    const currentQuestion = selectedQuiz.questions[quizState.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answer,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: [...prev.answers, isCorrect],
    }));

    // Proceed to next question after delay
    setTimeout(() => {
      if (quizState.currentQuestionIndex < selectedQuiz.questions.length - 1) {
        setQuizState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          selectedAnswer: null,
        }));
      } else {
        if (timer) clearInterval(timer);
        setQuizState(prev => ({
          ...prev,
          completed: true,
        }));
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      selectedAnswer: null,
      score: 0,
      answers: [],
      completed: false,
      timeSpent: 0,
    });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!selectedQuiz) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 dark:text-gray-400">No quizzes available for the selected filters.</p>
      </div>
    );
  }

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
            <Brain className="mr-3 h-8 w-8 text-primary-600 dark:text-primary-400" />
            Quiz Engine
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Test your knowledge and track your progress
          </p>
        </div>
      </div>

      {!quizState.completed ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedQuiz.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{selectedQuiz.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Timer className="h-4 w-4 mr-1" />
                  <span>{formatTime(quizState.timeSpent)}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Question </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {quizState.currentQuestionIndex + 1}/{selectedQuiz.questions.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={quizState.currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
                  {selectedQuiz.questions[quizState.currentQuestionIndex].question}
                </h3>

                <div className="space-y-4">
                  {selectedQuiz.questions[quizState.currentQuestionIndex].options.map((option, index) => {
                    const isSelected = quizState.selectedAnswer === option;
                    const isCorrect = option === selectedQuiz.questions[quizState.currentQuestionIndex].correctAnswer;
                    const showResult = quizState.selectedAnswer !== null;

                    return (
                      <motion.button
                        key={index}
                        className={`w-full p-4 rounded-lg border-2 transition-colors ${
                          isSelected
                            ? isCorrect
                              ? 'border-success-500 bg-success-50 dark:bg-success-900/20'
                              : 'border-error-500 bg-error-50 dark:bg-error-900/20'
                            : showResult && isCorrect
                            ? 'border-success-500 bg-success-50 dark:bg-success-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500'
                        }`}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={quizState.selectedAnswer !== null}
                        whileHover={quizState.selectedAnswer === null ? { scale: 1.02 } : {}}
                        whileTap={quizState.selectedAnswer === null ? { scale: 0.98 } : {}}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-left ${
                            isSelected
                              ? isCorrect
                                ? 'text-success-700 dark:text-success-300'
                                : 'text-error-700 dark:text-error-300'
                              : showResult && isCorrect
                              ? 'text-success-700 dark:text-success-300'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {option}
                          </span>
                          {showResult && (isSelected || isCorrect) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              {isCorrect ? (
                                <CheckCircle2 className="h-5 w-5 text-success-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-error-500" />
                              )}
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  (quizState.score / selectedQuiz.questions.length) >= 0.7
                    ? 'bg-success-100 dark:bg-success-900/20 text-success-500'
                    : 'bg-warning-100 dark:bg-warning-900/20 text-warning-500'
                }`}
              >
                <BarChart3 className="h-8 w-8" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Quiz Completed!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                You scored {quizState.score} out of {selectedQuiz.questions.length}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Accuracy</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round((quizState.score / selectedQuiz.questions.length) * 100)}%
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatTime(quizState.timeSpent)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Time per Question</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatTime(Math.round(quizState.timeSpent / selectedQuiz.questions.length))}
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <motion.button
                className="btn-outline flex items-center"
                onClick={resetQuiz}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </motion.button>
              <motion.button
                className="btn-primary flex items-center"
                onClick={() => setSelectedQuiz(quizzes[Math.floor(Math.random() * quizzes.length)])}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next Quiz
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Available Quizzes</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <select
                className="bg-transparent border-0 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {topics.map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <select
                className="bg-transparent border-0 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedQuiz.id === quiz.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500'
                }`}
                onClick={() => {
                  setSelectedQuiz(quiz);
                  resetQuiz();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">{quiz.title}</h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Timer className="h-3.5 w-3.5 mr-1" />
                  <span>{quiz.estimatedTime} min</span>
                  <span className="mx-2">•</span>
                  <span className="capitalize">{quiz.difficulty}</span>
                  <span className="mx-2">•</span>
                  <span>{quiz.questions.length} questions</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizEngine;