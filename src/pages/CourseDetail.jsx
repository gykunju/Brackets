import { IoMdArrowBack } from "react-icons/io";
import { useLocation, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { FiBook, FiCheckCircle, FiClock, FiPlay, FiLock } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { generateText } from "../config/gemini";

function CourseDetail() {
  const location = useLocation();
  const { bracket, course } = useParams();
  const decodedBracket = decodeURIComponent(bracket);
  const decodedCourse = decodeURIComponent(course);
  
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseInfo, setCourseInfo] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);

  useEffect(() => {
    generateLearningPath();
  }, [decodedCourse]);

  const generateLearningPath = async () => {
    setLoading(true);
    
    // Check if we have cached content
    const cacheKey = `course-content-${decodedBracket}-${decodedCourse}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const data = JSON.parse(cached);
      setModules(data.modules);
      setCourseInfo(data.courseInfo);
      setLoading(false);
      return;
    }

    try {
      const prompt = `Create a comprehensive learning path for the course: "${decodedCourse}"

Generate a structured learning path from beginner to master level with 8-10 modules.

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "courseInfo": {
    "title": "${decodedCourse}",
    "description": "Brief 2-sentence description of the course",
    "duration": "estimated weeks",
    "difficulty": "beginner/intermediate/advanced",
    "objectives": ["3-4 key learning objectives"]
  },
  "modules": [
    {
      "id": 1,
      "title": "Module title",
      "level": "Beginner/Intermediate/Advanced/Master",
      "duration": "2-3 hours",
      "topics": ["topic 1", "topic 2", "topic 3"],
      "description": "What students will learn in this module",
      "content": "Detailed learning content for this module (3-5 paragraphs covering the key concepts, examples, and practical applications)",
      "completed": false
    }
  ]
}

Important: 
- Start with foundational concepts (Beginner level)
- Progress to practical applications (Intermediate)
- Include advanced topics (Advanced level)
- End with expert/master level content
- Make it practical and project-based where possible
- Include detailed content for each module that learners can read and learn from`;

      const response = await generateText(prompt);
      
      // Extract JSON from response
      let data;
      try {
        // Try to find JSON in the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          data = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found");
        }
      } catch (e) {
        console.error("Failed to parse AI response:", e);
        // Create default structure
        data = createDefaultLearningPath(decodedCourse);
      }

      // Validate and set data
      if (data.modules && Array.isArray(data.modules)) {
        setModules(data.modules);
        setCourseInfo(data.courseInfo || createDefaultCourseInfo(decodedCourse));
        
        // Cache the generated content
        localStorage.setItem(cacheKey, JSON.stringify({
          modules: data.modules,
          courseInfo: data.courseInfo || createDefaultCourseInfo(decodedCourse)
        }));
      } else {
        const defaultData = createDefaultLearningPath(decodedCourse);
        setModules(defaultData.modules);
        setCourseInfo(defaultData.courseInfo);
      }
    } catch (error) {
      console.error('Error generating learning path:', error);
      const defaultData = createDefaultLearningPath(decodedCourse);
      setModules(defaultData.modules);
      setCourseInfo(defaultData.courseInfo);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultCourseInfo = (courseName) => ({
    title: courseName,
    description: `Comprehensive course covering all aspects of ${courseName}. Learn through hands-on projects and practical examples.`,
    duration: "8-12 weeks",
    difficulty: "intermediate",
    objectives: [
      `Master the fundamentals of ${courseName}`,
      "Build real-world projects",
      "Understand advanced concepts",
      "Develop professional expertise"
    ]
  });

  const createDefaultLearningPath = (courseName) => ({
    courseInfo: createDefaultCourseInfo(courseName),
    modules: [
      {
        id: 1,
        title: "Introduction and Fundamentals",
        level: "Beginner",
        duration: "2 hours",
        topics: ["Course overview", "Basic concepts", "Setting up environment"],
        description: "Get started with the basics and understand core concepts",
        content: `Welcome to ${courseName}! This introductory module lays the foundation for your learning journey. We'll explore what ${courseName} is all about, why it's important, and how it's used in real-world applications. You'll understand the basic terminology and core principles that will be essential throughout this course.\n\nSetting up your learning environment is crucial for success. We'll guide you through the necessary tools, resources, and materials you'll need. Whether it's software, books, or online resources, you'll have everything ready to start your learning journey.\n\nBy the end of this module, you'll have a clear roadmap of what to expect, understand the fundamental concepts, and be ready to dive deeper into more complex topics. This foundation will serve as your launchpad for mastering ${courseName}.`,
        completed: false
      },
      {
        id: 2,
        title: "Core Concepts",
        level: "Beginner",
        duration: "3 hours",
        topics: ["Key principles", "Basic operations", "Simple examples"],
        description: "Learn the fundamental concepts that form the foundation",
        content: `Now that you're familiar with the basics, let's dive into the core concepts that form the backbone of ${courseName}. These fundamental principles are essential for understanding more advanced topics. We'll break down complex ideas into simple, digestible pieces that you can easily grasp.\n\nYou'll learn about key principles through practical examples and hands-on exercises. Each concept builds upon the previous one, creating a strong foundation of knowledge. We'll explore how these principles work together and why they're important in the broader context of ${courseName}.\n\nThrough simple examples and step-by-step explanations, you'll gain confidence in applying these concepts. By the end of this module, you'll have a solid understanding of the fundamentals and be ready to tackle more intermediate topics.`,
        completed: false
      },
      {
        id: 3,
        title: "Intermediate Techniques",
        level: "Intermediate",
        duration: "4 hours",
        topics: ["Advanced operations", "Best practices", "Common patterns"],
        description: "Apply your knowledge to more complex scenarios",
        content: `With a solid foundation in place, it's time to elevate your skills with intermediate techniques. This module introduces more sophisticated concepts and methods that professionals use in their daily work. You'll learn how to apply your foundational knowledge to solve more complex problems.\n\nBest practices and common patterns are essential for writing efficient, maintainable, and professional-quality work. We'll explore proven strategies that experts use, understanding not just how to do things, but why certain approaches are preferred. You'll learn to recognize patterns and apply them appropriately.\n\nThrough practical exercises and real-world scenarios, you'll develop the confidence to tackle intermediate-level challenges. These techniques will prepare you for more advanced topics while ensuring you're following industry standards and best practices.`,
        completed: false
      },
      {
        id: 4,
        title: "Practical Applications",
        level: "Intermediate",
        duration: "5 hours",
        topics: ["Real-world projects", "Problem-solving", "Hands-on practice"],
        description: "Build practical projects and solve real problems",
        content: `Theory becomes powerful when applied to real-world situations. In this module, you'll work on practical projects that mirror what professionals encounter in their work. These hands-on exercises will help you understand how ${courseName} is used to solve actual problems.\n\nProblem-solving is a critical skill that develops through practice. You'll face challenges that require you to think creatively, apply multiple concepts together, and find effective solutions. Each project is designed to reinforce your learning while building your portfolio.\n\nBy working through real-world scenarios, you'll gain practical experience and develop the confidence to apply your skills independently. These projects will serve as valuable examples of your capabilities and understanding of ${courseName}.`,
        completed: false
      },
      {
        id: 5,
        title: "Advanced Topics",
        level: "Advanced",
        duration: "4 hours",
        topics: ["Complex concepts", "Optimization", "Performance tuning"],
        description: "Dive deep into advanced concepts and techniques",
        content: `Advanced topics push the boundaries of your understanding and introduce you to sophisticated concepts that separate beginners from experts. This module explores complex ideas that require a strong foundation and intermediate skills to fully grasp.\n\nOptimization and performance are crucial considerations for professional work. You'll learn how to analyze efficiency, identify bottlenecks, and implement improvements. Understanding these concepts will help you create high-quality, performant solutions.\n\nThese advanced techniques require practice and patience to master. Take your time with each concept, experiment with different approaches, and don't hesitate to review earlier modules if needed. By the end, you'll have the skills that distinguish advanced practitioners in ${courseName}.`,
        completed: false
      },
      {
        id: 6,
        title: "Expert Techniques",
        level: "Advanced",
        duration: "5 hours",
        topics: ["Expert patterns", "System design", "Architecture"],
        description: "Learn expert-level techniques and architectural patterns",
        content: `Expert techniques represent the pinnacle of professional practice in ${courseName}. This module introduces sophisticated patterns and approaches used by leading professionals in the field. You'll learn to think at a higher level, considering not just individual components but entire systems.\n\nSystem design and architecture require understanding how different pieces fit together to create robust, scalable solutions. You'll explore design patterns, architectural principles, and strategic approaches to complex problems. These skills are essential for senior-level work and leadership roles.\n\nMastering these techniques takes time and experience, but understanding them now will accelerate your growth. You'll learn to make informed decisions about structure, organization, and implementation that reflect expert-level thinking in ${courseName}.`,
        completed: false
      },
      {
        id: 7,
        title: "Mastery Project",
        level: "Master",
        duration: "8 hours",
        topics: ["Capstone project", "Integration", "Professional standards"],
        description: "Build a comprehensive project demonstrating mastery",
        content: `The mastery project is your opportunity to demonstrate everything you've learned throughout this course. This comprehensive project will challenge you to integrate all concepts, techniques, and best practices into a single, cohesive solution that showcases your expertise in ${courseName}.\n\nYou'll work through the entire development lifecycle, from planning and design to implementation and optimization. This project should reflect professional standards and demonstrate your ability to handle complex challenges independently. It will serve as a centerpiece of your portfolio.\n\nTake pride in this work and don't rush through it. Apply everything you've learned about best practices, optimization, and expert techniques. When complete, you'll have a tangible demonstration of your mastery and the confidence to tackle professional-level challenges in ${courseName}.`,
        completed: false
      },
      {
        id: 8,
        title: "Beyond Mastery",
        level: "Master",
        duration: "4 hours",
        topics: ["Industry trends", "Future developments", "Continuous learning"],
        description: "Explore cutting-edge developments and continue your journey",
        content: `Mastery is not a destination but a continuous journey. This final module explores emerging trends, future developments, and the evolving landscape of ${courseName}. Staying current with industry changes is essential for maintaining expertise and remaining competitive.\n\nYou'll learn about cutting-edge techniques, experimental approaches, and future directions in the field. Understanding where ${courseName} is heading will help you anticipate changes and position yourself for continued success. We'll also discuss strategies for continuous learning and professional development.\n\nYour journey doesn't end here—it's just beginning. With the foundation you've built, you're equipped to explore specialized areas, contribute to the community, and continue growing as an expert. Stay curious, keep practicing, and never stop learning in your ${courseName} journey.`,
        completed: false
      }
    ]
  });

  const backPage = () => {
    window.history.back();
  };

  const getLevelColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return 'from-green-500 to-emerald-600';
      case 'intermediate': return 'from-yellow-500 to-orange-600';
      case 'advanced': return 'from-red-500 to-pink-600';
      case 'master': return 'from-purple-500 to-indigo-600';
      default: return 'from-indigo-500 to-purple-600';
    }
  };

  const getLevelBadge = (level) => {
    const colors = {
      beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      master: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    };
    
    const colorClass = colors[level?.toLowerCase()] || 'bg-gray-100 text-gray-700';
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
        {level}
      </span>
    );
  };

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const markModuleComplete = (moduleId) => {
    const updatedModules = modules.map(mod => 
      mod.id === moduleId ? { ...mod, completed: !mod.completed } : mod
    );
    setModules(updatedModules);
    
    // Update cache
    const cacheKey = `course-content-${decodedBracket}-${decodedCourse}`;
    localStorage.setItem(cacheKey, JSON.stringify({
      modules: updatedModules,
      courseInfo
    }));
  };

  const completedCount = modules.filter(m => m.completed).length;
  const progress = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;

  return (
    <div className="geist-font flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-5 max-w-6xl mx-auto w-full">
          <div className="flex justify-center gap-20 items-center relative">
            <h1 className="geist-font wght-700 text-xl lg:text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center px-12">
              {decodedCourse}
            </h1>
            <button
              onClick={backPage}
              className="absolute left-0 p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 hover:from-indigo-200 hover:to-purple-200 transition-colors"
            >
              <IoMdArrowBack size={24} className="text-indigo-600 dark:text-indigo-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-5 gap-6 max-w-6xl mx-auto w-full pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <BsStars className="text-indigo-600 dark:text-indigo-400 animate-pulse mb-4" size={48} />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Generating your personalized learning path...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take a moment</p>
          </div>
        ) : (
          <>
            {/* Course Info Card */}
            {courseInfo && (
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 lg:p-8 shadow-xl text-white">
                <div className="flex items-start gap-3 mb-4">
                  <BsStars size={32} className="flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">About This Course</h2>
                    <p className="text-indigo-100 mb-4">{courseInfo.description}</p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                        <FiClock className="mb-1" size={20} />
                        <p className="text-xs text-indigo-100">Duration</p>
                        <p className="font-semibold">{courseInfo.duration}</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                        <FiBook className="mb-1" size={20} />
                        <p className="text-xs text-indigo-100">Modules</p>
                        <p className="font-semibold">{modules.length} modules</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm col-span-2 lg:col-span-1">
                        <FiCheckCircle className="mb-1" size={20} />
                        <p className="text-xs text-indigo-100">Progress</p>
                        <p className="font-semibold">{progress}% Complete</p>
                      </div>
                    </div>

                    {courseInfo.objectives && (
                      <div>
                        <p className="text-sm font-semibold mb-2 text-indigo-100">Learning Objectives:</p>
                        <ul className="space-y-1">
                          {courseInfo.objectives.map((obj, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-indigo-200">•</span>
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {modules.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Your Progress</h3>
                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {completedCount} / {modules.length} modules
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Learning Path */}
            <div>
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Learning Path
              </h2>
              
              <div className="space-y-4">
                {modules.map((module, index) => {
                  const isExpanded = expandedModule === module.id;
                  const isLocked = index > 0 && !modules[index - 1].completed;
                  
                  return (
                    <div
                      key={module.id}
                      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all ${
                        isLocked ? 'opacity-60' : 'hover:shadow-xl'
                      }`}
                    >
                      <div
                        className={`p-6 cursor-pointer ${!isLocked ? 'hover:bg-gray-50 dark:hover:bg-gray-750' : 'cursor-not-allowed'}`}
                        onClick={() => !isLocked && toggleModule(module.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${getLevelColor(module.level)} flex-shrink-0`}>
                            {isLocked ? (
                              <FiLock size={24} className="text-white" />
                            ) : module.completed ? (
                              <FiCheckCircle size={24} className="text-white" />
                            ) : (
                              <FiPlay size={24} className="text-white" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                    Module {module.id}
                                  </span>
                                  {getLevelBadge(module.level)}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                  {module.title}
                                </h3>
                              </div>
                              {module.completed && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                  Completed
                                </span>
                              )}
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                              {module.description}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                                <FiClock size={16} />
                                <span>{module.duration}</span>
                              </div>
                              <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                                <FiBook size={16} />
                                <span>{module.topics.length} topics</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && !isLocked && (
                        <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                          <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Topics Covered:</h4>
                          <ul className="space-y-2 mb-6">
                            {module.topics.map((topic, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                          
                          {/* Module Content */}
                          {module.content && (
                            <div className="mb-6">
                              <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <FiBook className="text-indigo-600 dark:text-indigo-400" />
                                Learning Content
                              </h4>
                              <div className="bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-6 space-y-4">
                                {module.content.split('\n\n').map((paragraph, idx) => (
                                  <p key={idx} className="text-gray-800 dark:text-gray-200 leading-relaxed text-base">
                                    {paragraph}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <button
                            onClick={() => markModuleComplete(module.id)}
                            className={`w-full py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg ${
                              module.completed
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                            }`}
                          >
                            {module.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                          </button>
                        </div>
                      )}
                      
                      {isLocked && (
                        <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <FiLock size={16} />
                            Complete the previous module to unlock this one
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;
