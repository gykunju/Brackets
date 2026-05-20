import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiPlay, FiPause, FiRotateCcw, FiX } from 'react-icons/fi';

function PomodoroTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus or break

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a sound or notification here ideally
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'focus' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-50 geist-font">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="p-4 bg-stone-900 dark:bg-stone-800 text-white rounded-full shadow-lg hover:bg-stone-800 dark:hover:bg-stone-700 transition-colors flex items-center justify-center relative"
          >
            <FiClock size={24} />
            {isActive && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-lime-500 rounded-full border-2 border-stone-900"></span>
            )}
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-72 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden"
          >
            <div className="flex justify-between items-center p-3 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/50">
              <span className="font-semibold text-stone-700 dark:text-stone-300 text-sm">Study Timer</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-stone-200 dark:hover:bg-stone-700 rounded transition-colors text-stone-500"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="p-5 flex flex-col items-center">
              <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-lg mb-6 w-full">
                <button
                  onClick={() => switchMode('focus')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${mode === 'focus' ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-white' : 'text-stone-500'}`}
                >
                  Focus
                </button>
                <button
                  onClick={() => switchMode('break')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${mode === 'break' ? 'bg-white dark:bg-stone-700 shadow-sm text-lime-700 dark:text-lime-400' : 'text-stone-500'}`}
                >
                  Break
                </button>
              </div>

              <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90 absolute">
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-stone-100 dark:text-stone-800"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={377}
                    strokeDashoffset={377 - (377 * progress) / 100}
                    className={`transition-all duration-1000 ${mode === 'focus' ? 'text-stone-900 dark:text-stone-400' : 'text-lime-500'}`}
                  />
                </svg>
                <span className="text-3xl font-bold text-stone-900 dark:text-white tracking-widest">
                  {formatTime(timeLeft)}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTimer}
                  className={`p-4 rounded-full text-white shadow-sm ${mode === 'focus' ? 'bg-stone-900 hover:bg-stone-800' : 'bg-lime-600 hover:bg-lime-500'}`}
                >
                  {isActive ? <FiPause size={24} /> : <FiPlay size={24} className="ml-1" />}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetTimer}
                  className="p-3 text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
                >
                  <FiRotateCcw size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PomodoroTimer;
