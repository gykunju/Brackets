import { GrAdd } from "react-icons/gr";
import { PiExam } from "react-icons/pi";
import { CiCalendar } from "react-icons/ci";
import { CiClock2 } from "react-icons/ci";
import { CiMapPin } from "react-icons/ci";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from '../context/UserContext'

function Events() {
  const [addModal, setAddModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All Events");
  const [dateFilter, setDateFilter] = useState("upcoming");
  const { events, setEvents } = useUser()
  console.log(events)

  const data = [
    {
      id: 0,
      title: "Systems Programming Exam",
      type: "Event",
      description: "Exams on topic 1 and 2",
      date: new Date("2025-9-10"),
      time: "10:00 AM",
      location: "HRD 102",
    },
    {
      id: 0,
      title: "Systems Programming Exam",
      type: "Exam",
      description: "Exams on topic 1 and 2",
      date: new Date("2025-9-10"),
      time: "10:00 AM",
      location: "HRD 102",
    },
    {
      id: 0,
      title: "Systems Programming Exam",
      type: "Assignment",
      description: "Exams on topic 1 and 2",
      date: new Date("2025-9-10"),
      time: "10:00 AM",
      location: "HRD 102",
    },
    {
      id: 0,
      title: "Systems Programming Exam",
      type: "Exam",
      description: "Exams on topic 1 and 2",
      date: new Date("2025-9-10"),
      time: "10:00 AM",
      location: "HRD 102",
    },
  ];

  let upcoming = 5;
  let past = 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    className="geist-font flex flex-col min-h-screen bg-gradient-to-b from-white to-stone-50/30 pb-25 gap-2"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-5 py-4 bg-white/80 backdrop-blur-sm sticky top-0 border-b border-stone-100 z-20"
      >
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="geist-font wght-700 text-xl text-gray-900">Events</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAddModal((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <GrAdd size={22} className="text-gray-700" />
          </motion.button>
        </div>
      </motion.div>

      {/* Type Filter */}
      <div className="px-5 pt-4 overflow-hidden lg:mx-auto">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex mx-auto gap-3 overflow-x-auto items-center pb-2 hide-scrollbar"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap geist-font wght-600 transition-all ${
              typeFilter === "All Events"
                ? "bg-lime-800 text-white shadow-sm"
                : "bg-white border border-stone-200 text-gray-700 hover:border-lime-600"
            }`}
            onClick={() => setTypeFilter("All Events")}
          >
            All Events
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap geist-font wght-600 transition-all ${
              typeFilter === "Exam"
                ? "bg-red-600 text-white shadow-sm"
                : "bg-white border border-stone-200 text-gray-700 hover:border-red-400"
            }`}
            onClick={() => setTypeFilter("Exam")}
          >
            Exams
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap geist-font wght-600 transition-all ${
              typeFilter === "Assignment"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-white border border-stone-200 text-gray-700 hover:border-purple-400"
            }`}
            onClick={() => setTypeFilter("Assignment")}
          >
            Assignments
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap geist-font wght-600 transition-all ${
              typeFilter === "Event"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white border border-stone-200 text-gray-700 hover:border-blue-400"
            }`}
            onClick={() => setTypeFilter("Event")}
          >
            Events
          </motion.button>
        </motion.div>
      </div>

      {/* Date filter */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-3 px-5 mb-2 mx-auto"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`py-2 px-4 rounded-lg geist-font wght-600 transition-all ${
            dateFilter === "upcoming"
              ? "bg-lime-100 text-lime-800"
              : "text-gray-600 hover:bg-stone-100"
          }`}
          onClick={() => setDateFilter("upcoming")}
        >
          Upcoming ({upcoming})
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`py-2 px-4 rounded-lg geist-font wght-600 transition-all ${
            dateFilter === "past"
              ? "bg-lime-100 text-lime-800"
              : "text-gray-600 hover:bg-stone-100"
          }`}
          onClick={() => setDateFilter("past")}
        >
          Past ({past})
        </motion.button>
      </motion.div>

      {/* Events grid */}
      <div className="px-5 pb-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 max-w-7xl mx-auto">
          {events.map((event, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              key={event.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={`px-3 py-1 rounded-lg text-xs geist-font wght-600 ${
                      event.type === "Exam"
                        ? "bg-red-100 text-red-700"
                        : event.type === "Assignment"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {event.type}
                  </motion.span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <AiOutlineClose size={18} />
                  </motion.button>
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-xl geist-font wght-700 text-gray-900">
                    {event.title}
                  </h2>
                  <p className="text-base geist-font wght-500 text-gray-600">
                    {event.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 mt-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-50">
                      <CiCalendar size={18} className="text-blue-700" />
                    </div>
                    <span className="text-sm text-gray-600 geist-font wght-500">
                      {event.date.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-50">
                      <CiClock2 size={18} className="text-purple-700" />
                    </div>
                    <span className="text-sm text-gray-600 geist-font wght-500">
                      {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-lime-50">
                      <CiMapPin size={18} className="text-lime-700" />
                    </div>
                    <span className="text-sm text-gray-600 geist-font wght-500">
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default Events;
