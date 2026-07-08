import { useState } from 'react';
import { Outlet, useNavigate } from "react-router";
import Navigation from "./Navigation";
import { AnimatePresence } from "framer-motion";
import { useUser } from '../context/UserContext'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { motion } from 'framer-motion'
import { MdCloudOff } from 'react-icons/md'
import { Toaster } from 'react-hot-toast'
import PomodoroTimer from './PomodoroTimer'
import { useNotifications } from '../hooks/useNotifications'

function AppLayout() {
  const { isLoggedIn } = useUser()
  const isOnline = useOnlineStatus()
  useNotifications()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <Toaster />
      <AnimatePresence mode="wait">
        { isLoggedIn && (
            <div key="layout" className="min-h-screen flex flex-col relative w-full overflow-hidden">
              { !isOnline && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-stone-800 text-stone-200 px-4 py-1 text-xs font-medium text-center flex items-center justify-center gap-2"
                >
                  <MdCloudOff size={14} />
                  <span>You are currently offline. Some features may be unavailable.</span>
                </motion.div>
              )}
              <div className={`flex-1 w-full relative z-0 pb-20 md:pb-0 transition-all duration-300 ${isSidebarOpen ? 'md:pl-24' : 'md:pl-0'}`}>
                <Outlet />
              </div>
              <PomodoroTimer />
              <Navigation isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            </div>
          )
        }
      </AnimatePresence>
    </>
  );
}

export default AppLayout;
