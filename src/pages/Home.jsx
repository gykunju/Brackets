import {FiSettings, FiArrowRight, FiCalendar, FiClock, FiPlus } from "react-icons/fi";
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
      className="min-h-screen geist-font flex flex-col gap-8 bg-gradient-to-b from-white to-stone-50/30 pb-25"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-5 py-4 bg-white/80 backdrop-blur-sm sticky top-0 border-b border-stone-100 z-20"
      >
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="geist-font wght-700 text-xl text-gray-900">Home</h1>
          <Link to="/profile">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <FiSettings size={22} className="text-gray-700" />
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
            <h2 className="text-2xl geist-font wght-700 text-gray-900">
              Current Courses
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-sm text-lime-800 hover:text-lime-700 geist-font wght-600 transition-colors"
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
                  className="group snap-center w-72 flex-shrink-0 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:border-lime-200 transition-all overflow-hidden"
                  tabIndex={0}
                  aria-label={course.title}
                >
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={course.img}
                      alt={`${course.title} cover`}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base geist-font wght-600 text-gray-900 group-hover:text-lime-800 transition-colors">
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
            <h2 className="text-2xl geist-font wght-700 text-gray-900">
              Upcoming Events
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-sm text-lime-800 hover:text-lime-700 geist-font wght-600 transition-colors"
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
                className="group bg-white hover:bg-stone-50 border border-stone-200 hover:border-lime-200 w-full rounded-lg shadow-sm hover:shadow-md p-4 transition-all"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-3 rounded-lg bg-lime-100 text-lime-700"
                  >
                    {event.type === "assignment" ? (
                      <MdOutlineAssignmentLate size={24} />
                    ) : (
                      <PiExam size={24} />
                    )}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-medium text-base text-gray-900 group-hover:text-lime-800 transition-colors">
                      {event.event}
                    </h3>
                    <p className="text-sm text-lime-700 mt-1">
                      {event.date.toLocaleDateString()}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full hover:bg-lime-100 text-lime-700 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <FiArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
            {upcoming_events.length === 0 && (
              <p className="text-center text-gray-500 mt-20">
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
