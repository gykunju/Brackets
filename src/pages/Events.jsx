import { useState, useEffect } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { MdOutlineAssignmentLate, MdEvent } from 'react-icons/md';
import { PiExam } from 'react-icons/pi';
import { FiCalendar, FiClock } from 'react-icons/fi';
import { GrAdd } from 'react-icons/gr';
import { AiOutlineClose } from 'react-icons/ai';

function Events() {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showPastEvents, setShowPastEvents] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        type: 'event',
        date: '',
        time: '',
        location: '',
        description: ''
    });
    
    // Load events from localStorage
    const [events, setEvents] = useState(() => {
        const saved = localStorage.getItem('brackets-events');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Convert date strings back to Date objects
            return parsed.map(event => ({
                ...event,
                date: new Date(event.date)
            }));
        }
        return [
            {
                id: 1,
                title: 'Systems Programming Exam',
                type: 'exam',
                date: new Date('2025-10-15'),
                time: '09:00 AM',
                location: 'Main Hall',
                description: 'Final examination for Systems Programming course',
            },
            {
                id: 2,
                title: 'Programming Assignment',
                type: 'assignment',
                date: new Date('2025-10-10'),
                time: '11:59 PM',
                location: 'Online Submission',
                description: 'Complete the data structures assignment',
            },
            {
                id: 3,
                title: 'Village Circle Meetup',
                type: 'event',
                date: new Date('2025-10-08'),
                time: '02:00 PM',
                location: 'Community Center',
                description: 'Monthly peer learning session',
            },
            {
                id: 4,
                title: 'Calculus II CAT 1',
                type: 'exam',
                date: new Date('2025-10-12'),
                time: '10:00 AM',
                location: 'Room 203',
                description: 'Continuous Assessment Test',
            },
            {
                id: 5,
                title: 'World History Presentation',
                type: 'assignment',
                date: new Date('2025-10-18'),
                time: '03:00 PM',
                location: 'Lecture Hall B',
                description: 'Group presentation on World War II',
            },
        ];
    });

    // Save events to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('brackets-events', JSON.stringify(events));
    }, [events]);

    // Check if an event is in the past
    const isPastEvent = (eventDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const compareDate = new Date(eventDate);
        compareDate.setHours(0, 0, 0, 0);
        return compareDate < today;
    };

    // Separate events into upcoming and past
    const upcomingEvents = events.filter(event => !isPastEvent(event.date));
    const pastEvents = events.filter(event => isPastEvent(event.date));

    // Apply filter
    const getFilteredEvents = (eventsList) => {
        return selectedFilter === 'all' 
            ? eventsList 
            : eventsList.filter(event => event.type === selectedFilter);
    };

    const filteredUpcomingEvents = getFilteredEvents(upcomingEvents);
    const filteredPastEvents = getFilteredEvents(pastEvents);

    const displayEvents = showPastEvents ? filteredPastEvents : filteredUpcomingEvents;

    const backPage = () => {
        window.history.back();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddEvent = (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.title || !formData.date || !formData.time) {
            alert('Please fill in all required fields (Title, Date, Time)');
            return;
        }

        // Create new event
        const newEvent = {
            id: Date.now(),
            title: formData.title,
            type: formData.type,
            date: new Date(formData.date),
            time: formData.time,
            location: formData.location || 'TBD',
            description: formData.description || 'No description provided',
        };

        // Add to events list
        setEvents(prev => [...prev, newEvent].sort((a, b) => a.date - b.date));

        // Reset form and close modal
        setFormData({
            title: '',
            type: 'event',
            date: '',
            time: '',
            location: '',
            description: ''
        });
        setShowAddModal(false);
    };

    const handleDeleteEvent = (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            setEvents(prev => prev.filter(event => event.id !== eventId));
        }
    };

    const getEventIcon = (type) => {
        switch(type) {
            case 'exam':
                return <PiExam size={28} className="text-white" />;
            case 'assignment':
                return <MdOutlineAssignmentLate size={28} className="text-white" />;
            case 'event':
                return <MdEvent size={28} className="text-white" />;
            default:
                return <FiCalendar size={28} className="text-white" />;
        }
    };

    const getEventColor = (type) => {
        switch(type) {
            case 'exam':
                return 'from-red-500 to-pink-600';
            case 'assignment':
                return 'from-indigo-500 to-purple-600';
            case 'event':
                return 'from-emerald-500 to-teal-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getEventBadge = (type) => {
        switch(type) {
            case 'exam':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Exam</span>;
            case 'assignment':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">Assignment</span>;
            case 'event':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Event</span>;
            default:
                return null;
        }
    };

    return (
        <div className="geist-font flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="p-5 max-w-6xl mx-auto w-full">
                    <div className="flex justify-center gap-20 items-center relative">
                        <h1 className="geist-font wght-700 text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Events & Deadlines</h1>
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

            <div className="flex flex-col gap-6 p-5 max-w-6xl mx-auto w-full">
                {/* Filter Tabs */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                    <button
                        onClick={() => setSelectedFilter('all')}
                        className={`px-6 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                            selectedFilter === 'all'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                        }`}
                    >
                        All Events
                    </button>
                    <button
                        onClick={() => setSelectedFilter('exam')}
                        className={`px-6 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                            selectedFilter === 'exam'
                                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-red-300'
                        }`}
                    >
                        Exams
                    </button>
                    <button
                        onClick={() => setSelectedFilter('assignment')}
                        className={`px-6 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                            selectedFilter === 'assignment'
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                        }`}
                    >
                        Assignments
                    </button>
                    <button
                        onClick={() => setSelectedFilter('event')}
                        className={`px-6 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                            selectedFilter === 'event'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                        }`}
                    >
                        Events
                    </button>
                </div>

                {/* Upcoming/Past Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowPastEvents(false)}
                            className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                                !showPastEvents
                                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            Upcoming ({filteredUpcomingEvents.length})
                        </button>
                        <button
                            onClick={() => setShowPastEvents(true)}
                            className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                                showPastEvents
                                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            Past ({filteredPastEvents.length})
                        </button>
                    </div>
                </div>

                {/* Events List */}
                <div className="flex flex-col gap-4">
                    {displayEvents.map((event) => (
                        <div
                            key={event.id}
                            className={`flex gap-5 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:scale-[1.01] ${
                                isPastEvent(event.date) ? 'opacity-70' : ''
                            }`}
                        >
                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${getEventColor(event.type)} shadow-md flex-shrink-0`}>
                                {getEventIcon(event.type)}
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="geist-font wght-700 text-xl">{event.title}</h3>
                                    {getEventBadge(event.type)}
                                </div>
                                
                                <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
                                    {event.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                        <FiCalendar size={16} />
                                        <span className="font-medium">{event.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                        <FiClock size={16} />
                                        <span className="font-medium">{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">📍 {event.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 transition-colors self-start"
                                title="Delete event"
                            >
                                <AiOutlineClose size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                {displayEvents.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            No {showPastEvents ? 'past' : 'upcoming'} events found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {showPastEvents 
                                ? 'No past events to display' 
                                : 'Try changing your filter or add a new event'}
                        </p>
                    </div>
                )}
            </div>

            {/* Add Event Modal */}
            {showAddModal && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-5"
                    onClick={() => setShowAddModal(false)}
                >
                    <div 
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleAddEvent}>
                            <div className="flex relative items-center justify-center mb-6">
                                <h1 className="geist-font wght-700 text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Add Event</h1>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="absolute right-0 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <AiOutlineClose size={24} className="text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter event title..."
                                        required
                                        className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                        Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="event">Event</option>
                                        <option value="exam">Exam</option>
                                        <option value="assignment">Assignment</option>
                                    </select>
                                </div>

                                {/* Date and Time */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                            Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                            Time <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="Enter location..."
                                        className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter description..."
                                        rows={3}
                                        className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full mt-2 p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
                                >
                                    Add Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Events;