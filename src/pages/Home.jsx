import { useState } from "react";
import { FiSettings, FiArrowRight, FiFileText, FiFolder, FiBookOpen, FiCalendar } from "react-icons/fi";
import { MdOutlineAssignmentLate } from "react-icons/md";
import { PiExam } from "react-icons/pi";
import { BsStars } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";

function Home() {
  const navigate = useNavigate();
  const { brackets, units, content, events, isLoading, authLoading } = useUser();
  const [aiQuery, setAiQuery] = useState("");

  const current_courses = brackets?.filter((course) => course.current === true) || [];
  
  // Sort events by date ascending and filter out past events (keep today's events until their specific time)
  const upcoming_events = events?.filter((event) => {
    if (!event.date) return false;
    const now = new Date();
    const eventDate = new Date(event.date);
    
    if (event.time) {
      const [hours, minutes] = event.time.split(':');
      eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    } else {
      // If no time is specified, keep it until the end of the day
      eventDate.setHours(23, 59, 59, 999);
    }
    
    return eventDate > now;
  }).sort((a, b) => {
    const dateA = new Date(a.date);
    if (a.time) {
      const [hA, mA] = a.time.split(':');
      dateA.setHours(parseInt(hA, 10), parseInt(mA, 10), 0, 0);
    } else {
      dateA.setHours(23, 59, 59, 999);
    }
    
    const dateB = new Date(b.date);
    if (b.time) {
      const [hB, mB] = b.time.split(':');
      dateB.setHours(parseInt(hB, 10), parseInt(mB, 10), 0, 0);
    } else {
      dateB.setHours(23, 59, 59, 999);
    }
    
    return dateA - dateB;
  }) || [];

  const showLoading =
    authLoading ||
    (brackets.length === 0 && events.length === 0 && (isLoading.brackets || isLoading.events));

  if (showLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-2 w-24 bg-stone-200 dark:bg-stone-800 rounded mb-4"></div>
          <div className="h-8 w-8 rounded-full border-2 border-stone-200 border-t-lime-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  const handleAiSearch = (e) => {
    e.preventDefault();
    if (aiQuery.trim()) {
      navigate(`/ai-assistant?q=${encodeURIComponent(aiQuery)}`);
    }
  };

  const getEventUrgencyClass = (dateString) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const eventDate = new Date(dateString);
    const diffTime = Math.abs(eventDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays <= 2) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    if (diffDays <= 7) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    return "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen geist-font flex flex-col bg-stone-50 dark:bg-stone-950 pb-25"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-5 py-4 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 border-b border-stone-100 dark:border-stone-800 z-20"
      >
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="geist-font wght-700 text-xl text-gray-900 dark:text-white">Study Hub</h1>
          <Link to="/profile">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <FiSettings size={22} className="text-gray-700 dark:text-gray-200" />
            </motion.div>
          </Link>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto w-full px-5 flex flex-col gap-8 mt-8">
        
        {/* AI Quick Ask Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lime-900 to-stone-900 shadow-xl border border-stone-800"
        >
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-lime-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          
          <div className="relative p-8 md:p-12 text-center flex flex-col items-center">
            <BsStars className="text-lime-400 mb-4" size={32} />
            <h2 className="text-3xl md:text-4xl wght-700 text-white mb-2">What do you want to learn today?</h2>
            <p className="text-stone-300 mb-8 max-w-lg">Ask any question about your study materials and your AI assistant will find the answer instantly.</p>
            
            <form onSubmit={handleAiSearch} className="w-full max-w-2xl relative">
              <input 
                type="text" 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="e.g., Explain the process of mitosis..."
                className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-lime-500 backdrop-blur-md shadow-inner text-lg"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-lime-500 hover:bg-lime-400 text-stone-900 rounded-full font-bold transition-colors"
              >
                Ask AI
              </button>
            </form>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Active Brackets", value: current_courses.length, icon: FiFolder, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/20" },
            { label: "Total Units", value: units?.length || 0, icon: FiBookOpen, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/20" },
            { label: "Documents", value: content?.length || 0, icon: FiFileText, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
            { label: "Upcoming Events", value: upcoming_events.length, icon: FiCalendar, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-900/20" }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white leading-none mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Continue Studying (Left 2 columns) */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl geist-font wght-700 text-gray-900 dark:text-white">
                Continue Studying
              </h2>
              <Link to="/brackets" className="text-sm text-lime-600 dark:text-lime-400 hover:underline font-semibold">
                View All
              </Link>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {current_courses.length > 0 ? (
                current_courses.slice(0, 4).map((course, index) => (
                  <Link to={`/brackets/${course.id}`} key={course.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="group bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-lime-500 dark:hover:border-lime-500 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-lime-100 to-transparent dark:from-lime-900/20 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl">
                          <FiFolder className="w-6 h-6 text-stone-700 dark:text-stone-300 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors" />
                        </div>
                        <FiArrowRight className="w-5 h-5 text-stone-400 group-hover:text-lime-500 transform group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate relative z-10">{course.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 relative z-10">
                        {units?.filter(u => u.bracket_id === course.id).length || 0} Units
                      </p>
                    </motion.div>
                  </Link>
                ))
              ) : (
                <div className="col-span-2 text-center p-10 bg-white dark:bg-stone-900 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700">
                  <p className="text-stone-500 dark:text-stone-400 mb-4">You haven't set any active study brackets yet.</p>
                  <Link to="/brackets" className="px-4 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-lg font-medium inline-block">
                    Create a Bracket
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Timeline (Right 1 column) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl geist-font wght-700 text-gray-900 dark:text-white">
                Timeline
              </h2>
              <Link to="/events" className="text-sm text-lime-600 dark:text-lime-400 hover:underline font-semibold">
                Calendar
              </Link>
            </div>
            
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm p-5 h-full max-h-[400px] overflow-y-auto">
              {upcoming_events.length > 0 ? (
                <div className="space-y-4">
                  {upcoming_events.slice(0, 5).map((event, index) => {
                    const urgencyClass = getEventUrgencyClass(event.date);
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        key={event.id} 
                        className="flex gap-4 items-start"
                      >
                        <div className="flex flex-col items-center mt-1">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${urgencyClass.split(' ')[1]} bg-white dark:bg-stone-900 border-2 shadow-sm z-10 shrink-0`}>
                            {event.type === "assignment" ? <MdOutlineAssignmentLate size={14} /> : <PiExam size={14} />}
                          </div>
                          {index !== Math.min(upcoming_events.length, 5) - 1 && (
                            <div className="w-0.5 h-full min-h-[2rem] bg-stone-200 dark:bg-stone-700 mt-1"></div>
                          )}
                        </div>
                        
                        <div className="pb-4 pt-1 flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 leading-tight">{event.title}</h3>
                          <div className="flex gap-2 items-center">
                            <p className={`text-xs font-semibold px-2 py-0.5 rounded inline-block ${urgencyClass}`}>
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                            {event.time && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                {new Date(`1970-01-01T${event.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                 <div className="text-center py-12">
                   <FiCalendar className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto mb-3" />
                   <p className="text-stone-500 dark:text-stone-400 text-sm">No upcoming deadlines! Time to relax.</p>
                 </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}

export default Home;
