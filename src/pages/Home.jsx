import { FiSettings, FiTrendingUp, FiUsers, FiZap, FiLogOut } from "react-icons/fi";
import { MdOutlineAssignmentLate } from "react-icons/md";
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

  useEffect(() => {
    if (user) {
      getLearnerStats(user.id).then(setStats);
    }
  }, [user]);

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

  const upcoming_events = [
    {
        event: 'systems programming ',
        type: 'exam',
        date: new Date("2025-09-27")
    },
    {
        event: 'Programming ',
        type: 'assignment',
        date: new Date("2025-09-25")
    },
    {
        event: 'Cat 1',
        type: 'exam',
        date: new Date("2025-09-24")
    },
    {
        event: 'Cat 1',
        type: 'exam',
        date: new Date("2025-09-25")
    },
  ]

  return (
    <div className="min-h-screen p-5 geist-font flex flex-col gap-10 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center relative">
        <h1 className="geist-font wght-700 text-xl">Brackets</h1>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-white font-bold">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </div>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
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

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-2">
          Welcome {user ? 'back' : 'to Brackets'}! 👋
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Community-powered learning platform. Join Village Learning Circles, get AI-powered recommendations, and learn together.
        </p>
        {!user && (
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-lime-600 text-white rounded-lg font-semibold hover:bg-lime-700 transition-colors">
              Sign Up
            </button>
            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-lime-600 text-lime-600 rounded-lg font-semibold hover:bg-lime-50 dark:hover:bg-gray-700 transition-colors">
              Sign In
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {user && stats && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-lime-50 dark:bg-lime-900/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-lime-700 dark:text-lime-500">{stats.completedModules}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Modules Done</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.averageScore}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Avg Score</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.totalTeachingPoints}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Points</div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link 
          to="/dashboard"
          className="bg-gradient-to-br from-lime-600 to-lime-700 text-white rounded-lg p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-shadow"
        >
          <FiTrendingUp size={32} />
          <span className="font-semibold">Dashboard</span>
        </Link>
        <Link 
          to="/village-circles"
          className="bg-gradient-to-br from-lime-700 to-lime-800 text-white rounded-lg p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-shadow"
        >
          <FiUsers size={32} />
          <span className="font-semibold text-sm">Village Circles</span>
          <span className="text-xs opacity-90">Peer Learning</span>
        </Link>
        <Link 
          to="/ai-assistant"
          className="bg-gradient-to-br from-lime-500 to-lime-600 text-white rounded-lg p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-shadow"
        >
          <FiZap size={32} />
          <span className="font-semibold text-sm">AI Tutor</span>
          <span className="text-xs opacity-90">Gemini Powered</span>
        </Link>
        <Link 
          to="/sponsor-board"
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-shadow"
        >
          <span className="text-3xl">💚</span>
          <span className="font-semibold text-sm">Sponsors</span>
          <span className="text-xs opacity-90">Community Support</span>
        </Link>
      </div>

      {/* Current Modules */}
      <div className="flex flex-col">
        <h1 className="text-2xl geist-font wght-600">Learning Modules</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Curriculum • Financial Literacy • Digital Skills • Agriculture</p>

        {/* Horizontal scroll row: snap + fixed-width cards */}
        <div className="mt-1">
          <div className="flex gap-6 overflow-x-auto py-2 horizontal-scroll snap-x snap-mandatory">
            {current_courses.map((course) => (
              <div
                key={course.id}
                className="course-card snap-center w-64 flex-shrink-0 bg-white/5 dark:bg-transparent rounded-lg shadow-sm overflow-hidden flex flex-col items-center text-center p-3"
                tabIndex={0}
                aria-label={course.title}
              >
                <div className="w-full h-40 overflow-hidden rounded-md">
                  <img
                    src={course.img}
                    alt={`${course.title} cover`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-3 text-sm font-medium">{course.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}

      <div>
        <h1 className="geist-font wght-600 text-2xl">Upcoming Events</h1>
        <div className="flex flex-col gap-5 mt-4">
          {upcoming_events.map((event, idx) => (
            <div className="flex items-center gap-4" key={idx}>
              <div className="p-3 rounded-lg bg-lime-100">
                {event.type == "assignment" ? (
                  <MdOutlineAssignmentLate size={26} />
                ) : (
                  <PiExam size={26} />
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="geist-font wght-600 text-lg">
                  {event.event}
                </h3>
                <p className="text-lime-800">
                  {event.date.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
