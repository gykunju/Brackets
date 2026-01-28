import { FiSettings, FiArrowRight, FiCalendar, FiClock, FiPlus } from "react-icons/fi";
import { MdOutlineAssignmentLate } from "react-icons/md";
import { LuBookMinus, LuCalendarDays } from "react-icons/lu";
import { PiExam } from "react-icons/pi";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";

function Home() {
  const navigate = useNavigate();
  const { brackets, events, isLoading, authLoading } = useUser();

  const current_courses = brackets?.filter((course) => course.current === true) || [];

  const upcoming_events = events?.filter((event) => new Date(event.date) > new Date()) || [];

  const showLoading =
    authLoading ||
    (brackets.length === 0 && events.length === 0 && (isLoading.brackets || isLoading.events));

  if (showLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-2 w-24 bg-stone-200 rounded mb-4"></div>
          <div className="h-8 w-8 rounded-full border-2 border-stone-200 border-t-stone-800 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen geist-font flex flex-col gap-8 bg-gradient-to-b from-white to-stone-50/30 dark:from-stone-900 dark:to-stone-950 pb-25"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-5 py-4 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm sticky top-0 border-b border-stone-100 dark:border-stone-800 z-20"
      >
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="geist-font wght-700 text-xl text-gray-900 dark:text-white">Home</h1>
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

      {/* Current Courses */}
      <div className="px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl geist-font wght-700 text-gray-900 dark:text-white">
              Current Courses
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-sm text-lime-800 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 geist-font wght-600 transition-colors"
            >
              View All
            </motion.button>
          </div>

          {/* Horizontal scroll row */}
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto py-2 horizontal-scroll snap-x snap-mandatory">
              {current_courses.map((course, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  key={course.id}
                  className="group snap-center w-72 flex-shrink-0 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md hover:border-lime-200 dark:hover:border-lime-700 transition-all overflow-hidden"
                  tabIndex={0}
                  aria-label={course.title}
                >
                  <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-lime-50 to-stone-100 dark:from-lime-900/20 dark:to-stone-900 flex items-center justify-center group-hover:bg-lime-50 dark:group-hover:bg-lime-900/30 transition-colors">
                    <LuBookMinus 
                      className="text-lime-800 dark:text-lime-400 group-hover:text-lime-600 dark:group-hover:text-lime-300 transform group-hover:scale-110 transition-transform duration-300" 
                      size={64} 
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base geist-font wght-600 text-gray-900 dark:text-white group-hover:text-lime-800 dark:group-hover:text-lime-400 transition-colors">
                      {course.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upcoming Events */}
      <div className="px-5 mb-10 mt-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl geist-font wght-700 text-gray-900 dark:text-white">
              Upcoming Events
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-sm text-lime-800 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 geist-font wght-600 transition-colors"
            >
              <Link to='/events'>View Calendar</Link>
            </motion.button>
          </div>

          {/* Event Grid */}
          <div className="grid gap-3">
            {upcoming_events.map((event, index) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                key={event.event + event.date}
                className="group bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800/50 border border-stone-200 dark:border-stone-800 hover:border-lime-200 dark:hover:border-lime-700 w-full rounded-lg shadow-sm hover:shadow-md p-4 transition-all"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-3 rounded-lg bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400"
                  >
                    {event.type === "assignment" ? (
                      <MdOutlineAssignmentLate size={24} />
                    ) : (
                      <PiExam size={24} />
                    )}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-medium text-base text-gray-900 dark:text-white group-hover:text-lime-800 dark:group-hover:text-lime-400 transition-colors">
                      {event.event}
                    </h3>
                    <p className="text-sm text-lime-700 dark:text-lime-500 mt-1">
                      {event.date.toLocaleDateString()}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full hover:bg-lime-100 dark:hover:bg-lime-900/40 text-lime-700 dark:text-lime-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <FiArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
            {upcoming_events.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 mt-20">
                No upcoming events.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Home;
