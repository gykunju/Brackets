import { FiSettings, FiTrendingUp, FiUsers, FiZap, FiLogOut } from "react-icons/fi";
import { MdOutlineAssignmentLate, MdEvent } from "react-icons/md";
import { PiExam } from "react-icons/pi";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { getLearnerStats } from "../services/learningService";


function Home() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    if (user) {
      getLearnerStats(user.id).then(setStats);
    }
  }, [user]);

  // Load events from localStorage and filter upcoming ones
  useEffect(() => {
    const loadEvents = () => {
      const saved = localStorage.getItem('brackets-events');
      if (saved) {
        const parsed = JSON.parse(saved);
        const events = parsed.map(event => ({
          ...event,
          date: new Date(event.date)
        }));
        
        // Filter for upcoming events only (not in the past)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = events.filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= today;
        }).sort((a, b) => a.date - b.date).slice(0, 4); // Get next 4 events
        
        setUpcomingEvents(upcoming);
      }
    };

    loadEvents();
    // Reload events when window gains focus (in case they were updated in Events page)
    window.addEventListener('focus', loadEvents);
    return () => window.removeEventListener('focus', loadEvents);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const current_courses = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJvb2t8ZW58MHx8MHx8fDA%3D",
      title: "Calculus II",
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3N8ZW58MHx8MHx8fDA%3D",
      title: "World History",
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D",
      title: "Bio-Engineering",
    },
    {
      id: 4,
      img: "https://images.unsplash.com/photo-1705721357357-ab87523248f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJvb2tzfGVufDB8fDB8fHww",
      title: "Systems Programming",
    },
  ];

  return (
    <div className="min-h-screen geist-font flex flex-col gap-8 pb-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center relative p-5 max-w-6xl mx-auto w-full">
          <h1 className="geist-font wght-700 text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Brackets</h1>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </div>
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-semibold text-sm">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                >
                  <FiLogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 max-w-6xl mx-auto w-full flex flex-col gap-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-xl text-white">
          <h2 className="text-3xl font-bold mb-2">
            Welcome {user ? 'back' : 'to Brackets'}! 👋
          </h2>
          <p className="text-indigo-50 mb-4 text-lg">
            Community-powered learning platform. Join Village Learning Circles, get AI-powered recommendations, and learn together.
          </p>
          {!user && (
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-lg">
                Sign Up
              </button>
              <button className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">
                Sign In
              </button>
            </div>
          )}
        </div>

      {/* Quick Stats */}
      {user && stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-center shadow-lg">
            <div className="text-3xl font-bold text-white">{stats.completedModules}</div>
            <div className="text-sm text-indigo-100">Modules Done</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-center shadow-lg">
            <div className="text-3xl font-bold text-white">{stats.averageScore}%</div>
            <div className="text-sm text-purple-100">Avg Score</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 text-center shadow-lg">
            <div className="text-3xl font-bold text-white">{stats.totalTeachingPoints}</div>
            <div className="text-sm text-pink-100">Points</div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link 
          to="/dashboard"
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-6 flex flex-col items-center gap-3 hover:shadow-xl transition-all hover:scale-105 shadow-lg"
        >
          <FiTrendingUp size={36} />
          <span className="font-semibold text-lg">Dashboard</span>
        </Link>
        <Link 
          to="/village-circles"
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 flex flex-col items-center gap-3 hover:shadow-xl transition-all hover:scale-105 shadow-lg"
        >
          <FiUsers size={36} />
          <span className="font-semibold">Village Circles</span>
          <span className="text-sm opacity-90">Peer Learning</span>
        </Link>
        <Link 
          to="/ai-assistant"
          className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-2xl p-6 flex flex-col items-center gap-3 hover:shadow-xl transition-all hover:scale-105 shadow-lg"
        >
          <FiZap size={36} />
          <span className="font-semibold">AI Tutor</span>
          <span className="text-sm opacity-90">Gemini Powered</span>
        </Link>
        <Link 
          to="/sponsor-board"
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-6 flex flex-col items-center gap-3 hover:shadow-xl transition-all hover:scale-105 shadow-lg"
        >
          <span className="text-4xl">💚</span>
          <span className="font-semibold">Sponsors</span>
          <span className="text-sm opacity-90">Community Support</span>
        </Link>
      </div>

      {/* Current Modules */}
      <div className="flex flex-col">
        <h1 className="text-3xl geist-font wght-700 mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Learning Modules</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Curriculum • Financial Literacy • Digital Skills • Agriculture</p>

        {/* Horizontal scroll row: snap + fixed-width cards */}
        <div className="mt-2">
          <div className="flex gap-6 overflow-x-auto py-2 horizontal-scroll snap-x snap-mandatory">
            {current_courses.map((course) => (
              <div
                key={course.id}
                className="course-card snap-center w-72 flex-shrink-0 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden flex flex-col p-4 border border-gray-200 dark:border-gray-700 hover:scale-105"
                tabIndex={0}
                aria-label={course.title}
              >
                <div className="w-full h-48 overflow-hidden rounded-xl">
                  <img
                    src={course.img}
                    alt={`${course.title} cover`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-4 text-lg font-semibold text-center">{course.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h1 className="geist-font wght-700 text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Upcoming Events</h1>
          <Link 
            to="/events"
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View All →
          </Link>
        </div>
        {upcomingEvents.length > 0 ? (
          <div className="flex flex-col gap-4">
            {upcomingEvents.map((event) => (
              <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700" key={event.id}>
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                  {event.type === "assignment" ? (
                    <MdOutlineAssignmentLate size={28} />
                  ) : event.type === "exam" ? (
                    <PiExam size={28} />
                  ) : (
                    <MdOutlineAssignmentLate size={28} />
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="geist-font wght-600 text-lg">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                      {event.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <span className="text-gray-400">•</span>
                    <p className="text-purple-600 dark:text-purple-400 font-medium text-sm">
                      {event.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-5xl mb-3">📅</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">No upcoming events</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Stay organized by adding your events and deadlines</p>
            <Link 
              to="/events"
              className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Add Event
            </Link>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default Home;
