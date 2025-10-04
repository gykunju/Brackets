import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  FolderOpen,
  Calendar,
  Sparkles,
  Menu,
  X,
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Modern, responsive navbar with mobile menu and dark mode
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dark mode
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Brackets', path: '/brackets', icon: FolderOpen },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'AI Assistant', path: '/ai-assistant', icon: Sparkles },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="flex items-center">
                <span className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 transition-transform group-hover:scale-110">
                  [ ]
                </span>
                <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white ml-1">
                  Brackets
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all',
                      isActive
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={cn('h-5 w-5', isActive && 'animate-pulse')} />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link to="/profile">
                    <Button variant="ghost" size="sm" leftIcon={<User className="h-4 w-4" />}>
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<LogOut className="h-4 w-4" />}
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/signin">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="h-6 w-6 text-gray-900 dark:text-white" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-900 dark:text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all',
                        isActive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={cn('h-5 w-5', isActive && 'animate-pulse')} />
                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                  {user ? (
                    <>
                      <Link to="/profile" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" size="default" leftIcon={<User className="h-5 w-5" />} className="w-full justify-start">
                          Profile
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="default"
                        leftIcon={<LogOut className="h-5 w-5" />}
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/signin" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" size="default" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsOpen(false)}>
                        <Button variant="primary" size="default" className="w-full">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 md:h-20" />
    </>
  );
}
