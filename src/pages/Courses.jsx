import { IoMdArrowBack } from "react-icons/io";
import { useLocation, Link, useNavigate } from 'react-router';
import { LuNotebookText } from "react-icons/lu";
import { GrFormNext, GrAdd } from "react-icons/gr";
import { useState, useEffect } from 'react';
import { FiBook, FiCheckCircle, FiClock, FiZap } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { generateText } from "../config/gemini";


function Courses() {
  const location = useLocation();
  const navigate = useNavigate();
  const bracket = decodeURIComponent(location.pathname.replace("/brackets/", ""));
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [generatingContent, setGeneratingContent] = useState(false);

  // Load courses from localStorage
  useEffect(() => {
    const loadCourses = () => {
      const saved = localStorage.getItem(`bracket-courses-${bracket}`);
      if (saved) {
        setCourses(JSON.parse(saved));
      } else {
        // Default courses for new brackets
        const defaultCourses = [
          { id: 1, title: "Systems Programming", items: 10, progress: 0 },
          { id: 2, title: "Data Analysis", items: 5, progress: 0 },
          { id: 3, title: "Statistics", items: 5, progress: 0 },
          { id: 4, title: "Calculus II", items: 8, progress: 0 },
          { id: 5, title: "Mathematics for Science", items: 4, progress: 0 },
        ];
        setCourses(defaultCourses);
        localStorage.setItem(`bracket-courses-${bracket}`, JSON.stringify(defaultCourses));
      }
    };
    loadCourses();
  }, [bracket]);

  // Save courses whenever they change
  useEffect(() => {
    if (courses.length > 0) {
      localStorage.setItem(`bracket-courses-${bracket}`, JSON.stringify(courses));
    }
  }, [courses, bracket]);

  const backPage = () => {
    window.history.back();
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    setGeneratingContent(true);
    
    try {
      // Generate learning path with AI
      const prompt = `Generate a brief course outline for "${newCourseTitle}". 
      Return ONLY a JSON object with this structure (no markdown, no code blocks):
      {
        "modules": 8,
        "difficulty": "beginner/intermediate/advanced",
        "description": "one sentence description"
      }`;

      const response = await generateText(prompt);
      
      // Try to parse the response
      let courseData = { modules: 6, difficulty: "intermediate", description: "Comprehensive course content" };
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          courseData = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log("Using default course data");
      }

      const newCourse = {
        id: Date.now(),
        title: newCourseTitle,
        items: courseData.modules || 6,
        progress: 0,
        difficulty: courseData.difficulty || "intermediate",
        description: courseData.description || "Comprehensive course content"
      };

      setCourses(prev => [...prev, newCourse]);
      setNewCourseTitle('');
      setShowAddModal(false);
    } catch (error) {
      console.error('Error generating course:', error);
      // Add course anyway with defaults
      const newCourse = {
        id: Date.now(),
        title: newCourseTitle,
        items: 6,
        progress: 0,
        difficulty: "intermediate",
        description: "Comprehensive course content"
      };
      setCourses(prev => [...prev, newCourse]);
      setNewCourseTitle('');
      setShowAddModal(false);
    } finally {
      setGeneratingContent(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'beginner': return 'from-green-500 to-emerald-600';
      case 'intermediate': return 'from-yellow-500 to-orange-600';
      case 'advanced': return 'from-red-500 to-pink-600';
      default: return 'from-indigo-500 to-purple-600';
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'beginner': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Beginner</span>;
      case 'intermediate': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Intermediate</span>;
      case 'advanced': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Advanced</span>;
      default: return null;
    }
  };

  return (
    <div className="geist-font flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-5 max-w-6xl mx-auto w-full">
          <div className="flex justify-center gap-20 items-center relative">
            <h1 className="geist-font wght-700 text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{bracket}</h1>
            <button
              onClick={backPage}
              className="absolute left-0 p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 hover:from-indigo-200 hover:to-purple-200 transition-colors"
            >
              <IoMdArrowBack size={24} className="text-indigo-600 dark:text-indigo-400" />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="absolute right-0 p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-colors shadow-lg"
            >
              <GrAdd size={22} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="flex flex-col p-5 gap-5 max-w-6xl mx-auto w-full">
        {courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">No courses yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Add your first course to get started</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Add Course
            </button>
          </div>
        ) : (
          courses.map((course) => (
            <Link
              key={course.id}
              to={`/brackets/${encodeURIComponent(bracket)}/${encodeURIComponent(course.title)}`}
              className="flex gap-5 items-center p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative hover:scale-[1.02] group"
            >
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${getDifficultyColor(course.difficulty)} shadow-md flex-shrink-0`}>
                <LuNotebookText size={32} className="text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="geist-font wght-700 text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{course.title}</h3>
                  {getDifficultyBadge(course.difficulty)}
                </div>
                
                {course.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {course.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <FiBook size={16} />
                    <span className="font-medium">{course.items} modules</span>
                  </div>
                  {course.progress > 0 && (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <FiCheckCircle size={16} />
                      <span className="font-medium">{course.progress}% complete</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <FiClock size={16} />
                    <span className="font-medium">~{course.items * 2}h</span>
                  </div>
                </div>
              </div>
              
              <GrFormNext className="text-indigo-400 group-hover:text-indigo-600 transition-colors" size={28} />
            </Link>
          ))
        )}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-5"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleAddCourse}>
              <div className="flex relative items-center justify-center mb-6">
                <div className="flex items-center gap-2">
                  <BsStars className="text-indigo-600 dark:text-indigo-400" size={24} />
                  <h1 className="geist-font wght-700 text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Add Course</h1>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="absolute right-0 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <AiOutlineClose size={24} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="e.g., Introduction to Python"
                  required
                  disabled={generatingContent}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                />
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FiZap className="text-indigo-600 dark:text-indigo-400 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 mb-1">AI-Powered Learning Path</p>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300">
                      Our AI will automatically generate a structured learning path with modules tailored to your course topic.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={generatingContent || !newCourseTitle.trim()}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {generatingContent ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating with AI...</span>
                  </>
                ) : (
                  <>
                    <BsStars size={20} />
                    <span>Add Course</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;
