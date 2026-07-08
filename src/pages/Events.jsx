import { GrAdd } from "react-icons/gr";
import { CiCalendar, CiClock2, CiMapPin } from "react-icons/ci";
import { AiOutlineClose } from "react-icons/ai";
import { FiTrash2, FiCalendar } from "react-icons/fi";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from '../context/UserContext';
import { toast } from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function Events() {
  const { events, createEvent, deleteEvent, getEvents, isLoading } = useUser();
  const [addModal, setAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const selectedDateEvents = events.filter(event => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    // Important: Account for timezone by doing localized string comparison or simply:
    return eventDate.getUTCFullYear() === selectedDate.getFullYear() &&
           eventDate.getUTCMonth() === selectedDate.getMonth() &&
           eventDate.getUTCDate() === selectedDate.getDate();
  }).sort((a, b) => {
     if (a.time && b.time) return a.time.localeCompare(b.time);
     return 0;
  });

  const getDayEvents = (dateObj) => {
    return events.filter(e => {
        if (!e.date) return false;
        const eventDate = new Date(e.date);
        return eventDate.getUTCFullYear() === dateObj.getFullYear() &&
               eventDate.getUTCMonth() === dateObj.getMonth() &&
               eventDate.getUTCDate() === dateObj.getDate();
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayEvents = getDayEvents(date);
      if (dayEvents.length > 0) {
        return (
          <div className="flex flex-wrap gap-0.5 justify-center mt-1 px-1">
            {dayEvents.slice(0, 3).map((e, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full ${
                  e.type === 'Exam' ? 'bg-red-500' : 
                  e.type === 'Assignment' ? 'bg-purple-500' : 
                  'bg-lime-500'
                }`} 
              />
            ))}
            {dayEvents.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      // Check if it's today
      const today = new Date();
      if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
        return 'text-lime-700 font-bold bg-lime-50/50 rounded-lg';
      }
    }
    return 'rounded-lg hover:bg-stone-100 transition-colors py-2 text-sm font-medium';
  };

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
      toast.success("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      const errMsg = error.message || error.details || "Unknown error";
      toast.error(`Failed to create event: ${errMsg}`);
      alert(`Error creating event: ${errMsg}\nCheck your RLS policies or database schema.`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete event
  const handleDelete = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteEvent(eventId);
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.");
    }
  };

  const openAddModal = () => {
    // Pre-fill the date with the selected calendar date
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(selectedDate.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);
    setAddModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="geist-font flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950 pb-25 gap-2"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-5 py-4 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm sticky top-0 border-b border-stone-100 dark:border-stone-800 z-20"
      >
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="geist-font wght-700 text-xl text-gray-900 dark:text-white flex items-center gap-2">
             <FiCalendar /> Calendar
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAddModal}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <GrAdd size={22} className="text-gray-700 dark:text-gray-300" />
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto w-full px-5 py-6 grid lg:grid-cols-5 gap-8 items-start">
         
         {/* Calendar Column (Left on Desktop, Top on Mobile) */}
         <div className="lg:col-span-3">
            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-lg">
               {/* Custom CSS overrides for react-calendar to match our theme */}
               <style>{`
                  .react-calendar {
                     width: 100%;
                     border: none;
                     background: transparent;
                     font-family: inherit;
                  }
                  .react-calendar__navigation button {
                     min-width: 44px;
                     background: none;
                     font-weight: 700;
                     font-size: 1.2rem;
                     border-radius: 8px;
                     transition: background-color 0.2s;
                  }
                  .react-calendar__navigation button:enabled:hover,
                  .react-calendar__navigation button:enabled:focus {
                     background-color: #f5f5f4; /* stone-100 */
                  }
                  .dark .react-calendar__navigation button:enabled:hover,
                  .dark .react-calendar__navigation button:enabled:focus {
                     background-color: #292524; /* stone-800 */
                     color: white;
                  }
                  .dark .react-calendar__navigation button { color: white; }
                  
                  .react-calendar__month-view__weekdays {
                     text-transform: uppercase;
                     font-weight: 700;
                     font-size: 0.75rem;
                     color: #78716c; /* stone-500 */
                     padding-bottom: 0.5rem;
                     padding-top: 0.5rem;
                  }
                  .react-calendar__month-view__days__day--weekend { color: inherit; }
                  .react-calendar__month-view__days__day--neighboringMonth { color: #d6d3d1; /* stone-300 */ }
                  .dark .react-calendar__month-view__days__day--neighboringMonth { color: #57534e; /* stone-600 */ }
                  
                  .react-calendar__tile {
                     padding: 0.75em 0.5em;
                  }
                  .react-calendar__tile--now { background: transparent; }
                  
                  /* Selected Date Styling */
                  .react-calendar__tile--active,
                  .react-calendar__tile--active:enabled:hover,
                  .react-calendar__tile--active:enabled:focus {
                     background: #4d7c0f; /* lime-700 */
                     color: white !important;
                     border-radius: 8px;
                  }
                  .dark .react-calendar__tile { color: white; }
                  .react-calendar__tile--active * {
                     color: white;
                  }
               `}</style>
               <Calendar 
                  onChange={handleDateChange} 
                  value={selectedDate}
                  tileContent={tileContent}
                  tileClassName={tileClassName}
                  next2Label={null}
                  prev2Label={null}
                  formatShortWeekday={(locale, date) => date.toLocaleDateString(locale, { weekday: 'short' })}
               />
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 text-xs font-medium text-stone-500 dark:text-stone-400 justify-center">
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> Exam</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500" /> Assignment</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-lime-500" /> Event</div>
            </div>
         </div>

         {/* Events List Column (Right on Desktop, Bottom on Mobile) */}
         <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
               <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                 {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
               </h2>
               <span className="text-sm text-stone-500 font-medium">{selectedDateEvents.length} events</span>
            </div>

            {isLoading.events ? (
               <div className="flex flex-col items-center justify-center py-12">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-800 mb-4" />
               </div>
            ) : selectedDateEvents.length > 0 ? (
               <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                  {selectedDateEvents.map((event, index) => (
                     <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={event.id}
                        className="bg-white dark:bg-stone-900 rounded-xl p-4 shadow-sm border border-stone-200 dark:border-stone-800 hover:border-lime-300 dark:hover:border-lime-800 transition-colors group"
                     >
                        <div className="flex justify-between items-start mb-2">
                           <div className="flex flex-col">
                              <h3 className="font-bold text-gray-900 dark:text-white">{event.title}</h3>
                              <span className={`text-xs font-medium w-fit px-2 py-0.5 rounded-full mt-1 ${
                                 event.type === 'Exam' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                 event.type === 'Assignment' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400'
                              }`}>
                                 {event.type}
                              </span>
                           </div>
                           <button
                              onClick={() => handleDelete(event.id)}
                              className="p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                           >
                              <FiTrash2 size={16} />
                           </button>
                        </div>
                        
                        {event.description && (
                           <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">{event.description}</p>
                        )}
                        
                        <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                           {event.time && (
                              <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
                                 <CiClock2 size={14} className="text-stone-400" />
                                 {event.time}
                              </div>
                           )}
                           {event.location && (
                              <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
                                 <CiMapPin size={14} className="text-stone-400" />
                                 {event.location}
                              </div>
                           )}
                        </div>
                     </motion.div>
                  ))}
               </div>
            ) : (
               <div className="bg-white dark:bg-stone-900 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 p-8 text-center mt-2">
                  <div className="mx-auto w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-3">
                     <FiCalendar size={24} className="text-stone-400" />
                  </div>
                  <h3 className="text-stone-900 dark:text-white font-bold mb-1">No Events</h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">You have a clear schedule for this day.</p>
                  <button 
                     onClick={openAddModal}
                     className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                     Add Event
                  </button>
               </div>
            )}
         </div>
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
              className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-[60]"
              onClick={() => !submitting && setAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-full md:max-w-md z-[60]"
            >
              <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[90vh] overflow-y-auto">
                <form className="flex flex-col" onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-stone-800 sticky top-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm z-10">
                    <h2 className="geist-font wght-700 text-lg text-gray-900 dark:text-white">
                      Add New Event
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => !submitting && setAddModal(false)}
                      className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-gray-500 transition-colors"
                    >
                      <AiOutlineClose size={20} />
                    </motion.button>
                  </div>

                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-700 dark:text-gray-300 font-semibold">Title</label>
                      <input
                        placeholder="e.g., Final Exam"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-700 dark:text-gray-300 font-semibold">Type</label>
                      <div className="flex gap-2">
                        {['Event', 'Assignment', 'Exam'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                              type === t 
                                ? (t === 'Exam' ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400' 
                                 : t === 'Assignment' ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400'
                                 : 'bg-lime-50 border-lime-200 text-lime-800 dark:bg-lime-900/30 dark:border-lime-800 dark:text-lime-400')
                                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300 font-semibold">Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                          className="w-full p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-gray-700 dark:text-gray-300 font-semibold">Time</label>
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-700 dark:text-gray-300 font-semibold">Location (Optional)</label>
                      <input
                        placeholder="e.g., Room 302"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-700 dark:text-gray-300 font-semibold">Description (Optional)</label>
                      <textarea
                        placeholder="Add some details..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => !submitting && setAddModal(false)}
                      className="flex-1 py-2.5 px-4 rounded-lg border border-stone-200 dark:border-stone-700 text-gray-700 dark:text-gray-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-2.5 px-4 rounded-lg bg-lime-800 text-white hover:bg-lime-700 font-semibold transition-colors disabled:opacity-50"
                    >
                      {submitting ? "Adding..." : "Add Event"}
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
