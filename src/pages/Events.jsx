import { GrAdd } from "react-icons/gr";
import { CiCalendar, CiClock2, CiMapPin } from "react-icons/ci";
import { AiOutlineClose } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from '../context/UserContext';

function Events() {
  const { events, createEvent, deleteEvent, getEvents, isLoading } = useUser();
  const [addModal, setAddModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All Events");
  const [dateFilter, setDateFilter] = useState("upcoming");
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Event");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  // Load events on mount
  useEffect(() => {
    getEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter events by type
  const filteredByType = typeFilter === "All Events"
    ? events
    : events.filter(e => e.type === typeFilter);

  // Filter by date (upcoming or past)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredEvents = filteredByType.filter(event => {
    if (!event.date) return dateFilter === "upcoming";
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    if (dateFilter === "upcoming") {
      return eventDate >= today;
    } else {
      return eventDate < today;
    }
  });

  // Count upcoming and past events
  const upcomingCount = events.filter(e => {
    if (!e.date) return true;
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }).length;

  const pastCount = events.filter(e => {
    if (!e.date) return false;
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < today;
  }).length;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      await createEvent({
        title,
        type,
        description,
        date: date || null,
        time: time || null,
        location: location || null
      });

      // Reset form
      setTitle("");
      setType("Event");
      setDescription("");
      setDate("");
      setTime("");
      setLocation("");
      setAddModal(false);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete event
  const handleDelete = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteEvent(eventId);
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No date set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="geist-font flex flex-col min-h-screen bg-gradient-to-b from-white to-stone-50/30 pb-25 gap-2"
    >
      {/* Header */}
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
            onClick={() => setAddModal(true)}
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
          Upcoming ({upcomingCount})
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
          Past ({pastCount})
        </motion.button>
      </motion.div>

      {/* Events grid */}
      <div className={`px-5 pb-5 ${addModal ? 'blur-sm' : ''}`}>
        {isLoading.events ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-800" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="p-4 rounded-full bg-stone-100 mb-4">
              <CiCalendar size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Events Found
            </h3>
            <p className="text-gray-600 mb-6">
              {dateFilter === "upcoming"
                ? "You don't have any upcoming events yet"
                : "No past events to show"}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAddModal(true)}
              className="px-4 py-2 rounded-lg bg-lime-800 text-white hover:bg-lime-700 transition-colors shadow-sm geist-font wght-600"
            >
              Add Event
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 max-w-7xl mx-auto">
            {filteredEvents.map((event, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
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
                      onClick={() => handleDelete(event.id)}
                      className="p-1 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </motion.button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl geist-font wght-700 text-gray-900">
                      {event.title}
                    </h2>
                    {event.description && (
                      <p className="text-base geist-font wght-500 text-gray-600">
                        {event.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 mt-1">
                    {event.date && (
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-50">
                          <CiCalendar size={18} className="text-blue-700" />
                        </div>
                        <span className="text-sm text-gray-600 geist-font wght-500">
                          {formatDate(event.date)}
                        </span>
                      </div>
                    )}
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-purple-50">
                          <CiClock2 size={18} className="text-purple-700" />
                        </div>
                        <span className="text-sm text-gray-600 geist-font wght-500">
                          {event.time}
                        </span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-lime-50">
                          <CiMapPin size={18} className="text-lime-700" />
                        </div>
                        <span className="text-sm text-gray-600 geist-font wght-500">
                          {event.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {addModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50"
              onClick={() => !submitting && setAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 bottom-4 top-auto md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
                <form className="flex flex-col" onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between p-4 border-b border-stone-200 sticky top-0 bg-white z-10">
                    <h2 className="geist-font wght-700 text-lg text-gray-900">
                      Add Event
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => !submitting && setAddModal(false)}
                      disabled={submitting}
                      className="p-1 rounded-lg hover:bg-stone-100 text-gray-500 transition-colors disabled:opacity-50"
                    >
                      <AiOutlineClose size={20} />
                    </motion.button>
                  </div>

                  <div className="p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-700 geist-font wght-600">
                        Event Title
                      </label>
                      <input
                        placeholder="e.g., Physics Midterm Exam"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={submitting}
                        required
                        className="w-full p-3 rounded-lg border border-stone-200 text-base geist-font wght-500 bg-white/50 focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-700 geist-font wght-600">
                        Event Type
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        disabled={submitting}
                        className="w-full p-3 rounded-lg border border-stone-200 text-base geist-font wght-500 bg-white/50 focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all"
                      >
                        <option value="Event">Event</option>
                        <option value="Exam">Exam</option>
                        <option value="Assignment">Assignment</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-700 geist-font wght-600">
                        Description (Optional)
                      </label>
                      <textarea
                        placeholder="Brief description of the event"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={submitting}
                        rows={2}
                        className="w-full p-3 rounded-lg border border-stone-200 text-base geist-font wght-500 bg-white/50 focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-gray-700 geist-font wght-600">
                          Date
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          disabled={submitting}
                          className="w-full p-3 rounded-lg border border-stone-200 text-base geist-font wght-500 bg-white/50 focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-gray-700 geist-font wght-600">
                          Time
                        </label>
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          disabled={submitting}
                          className="w-full p-3 rounded-lg border border-stone-200 text-base geist-font wght-500 bg-white/50 focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-700 geist-font wght-600">
                        Location (Optional)
                      </label>
                      <input
                        placeholder="e.g., Room 101, Main Building"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        disabled={submitting}
                        className="w-full p-3 rounded-lg border border-stone-200 text-base geist-font wght-500 bg-white/50 focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 border-t border-stone-200">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setAddModal(false)}
                      disabled={submitting}
                      className="flex-1 py-2.5 px-4 rounded-lg border border-stone-200 text-gray-700 hover:bg-stone-50 geist-font wght-600 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: submitting ? 1 : 1.01 }}
                      whileTap={{ scale: submitting ? 1 : 0.98 }}
                      type="submit"
                      disabled={submitting || !title.trim()}
                      className="flex-1 py-2.5 px-4 rounded-lg bg-lime-800 text-white hover:bg-lime-700 disabled:bg-lime-800/70 geist-font wght-600 transition-colors shadow-sm"
                    >
                      {submitting ? "Creating..." : "Create Event"}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Events;
