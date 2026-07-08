import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck, FiChevronRight, FiAward } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { useUser } from "../context/UserContext";
import { generateQuiz } from "../services/aiService";
import { toast } from "react-hot-toast";

function QuizModal({ unit, onClose }) {
  const { brackets, units, content, supabase } = useUser();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const userContext = { brackets, units, content };
        const generated = await generateQuiz(unit.id, userContext, supabase);
        setQuiz(generated);
      } catch (error) {
        toast.error(error.message || "Failed to generate quiz.");
        onClose();
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [unit.id]);

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    
    if (idx === quiz[currentQIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < quiz.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-stone-900/40 backdrop-blur-md flex items-center justify-center p-4 geist-font">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400 rounded-lg">
              <BsStars size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white leading-tight">AI Knowledge Check</h2>
              <p className="text-xs text-stone-500 font-medium">{unit.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors text-stone-500"
          >
            <FiX size={20} />
          </button>
        </div>

        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 border-4 border-lime-100 dark:border-lime-900/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-lime-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="mt-6 font-bold text-lg text-gray-900 dark:text-white">Generating your quiz...</h3>
            <p className="text-stone-500 text-sm mt-2 text-center max-w-xs">
              I'm reading through your documents for this unit and creating custom questions.
            </p>
          </div>
        ) : showResults ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center text-white shadow-lg mb-6">
              <FiAward size={48} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quiz Complete!</h3>
            <p className="text-stone-500 text-lg mb-8">
              You scored <span className="font-bold text-lime-600 dark:text-lime-400">{score}</span> out of {quiz.length}
            </p>
            <div className="flex gap-4 w-full max-w-sm">
               <button 
                 onClick={onClose}
                 className="flex-1 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 font-bold rounded-xl transition-colors"
               >
                 Close
               </button>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Question {currentQIndex + 1} of {quiz.length}
              </span>
              <div className="flex gap-1">
                {quiz.map((_, i) => (
                  <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i <= currentQIndex ? 'bg-lime-500' : 'bg-stone-200 dark:bg-stone-800'}`} />
                ))}
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {quiz[currentQIndex].question}
            </h3>

            <div className="flex flex-col gap-3">
              {quiz[currentQIndex].options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === quiz[currentQIndex].correctAnswer;
                
                let btnStyle = "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-lime-500 dark:hover:border-lime-500";
                let textStyle = "text-gray-700 dark:text-gray-300";
                let icon = null;

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "border-lime-500 bg-lime-50 dark:bg-lime-900/20";
                    textStyle = "text-lime-800 dark:text-lime-400 font-bold";
                    icon = <div className="w-5 h-5 rounded-full bg-lime-500 text-white flex items-center justify-center"><FiCheck size={12}/></div>;
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "border-red-500 bg-red-50 dark:bg-red-900/20";
                    textStyle = "text-red-800 dark:text-red-400 font-bold";
                    icon = <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"><FiX size={12}/></div>;
                  } else {
                    btnStyle = "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    className={`p-4 border-2 rounded-2xl flex items-center justify-between text-left transition-all ${btnStyle}`}
                  >
                    <span className={`text-base ${textStyle}`}>{option}</span>
                    {icon && <div className="ml-4">{icon}</div>}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/50 flex flex-col gap-4"
                >
                  <div>
                     <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Explanation</span>
                     <p className="text-gray-700 dark:text-gray-300 text-sm">
                       {quiz[currentQIndex].explanation}
                     </p>
                  </div>
                  <button
                    onClick={handleNext}
                    className="self-end px-6 py-2.5 bg-lime-700 hover:bg-lime-600 text-white font-bold rounded-xl flex items-center gap-2 transition-colors"
                  >
                    {currentQIndex < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'} <FiChevronRight />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default QuizModal;
