import { RiFoldersLine } from "react-icons/ri";
import { LiaHomeSolid } from "react-icons/lia";
import { IoCalendarOutline } from "react-icons/io5";
import { BsStars } from "react-icons/bs";
import { FiUsers, FiBarChart } from "react-icons/fi";
import { NavLink } from "react-router"
import { useState } from "react";

function Navigation() {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {/* Extended Menu */}
      {showMore && (
        <div className="fixed bottom-24 left-0 right-0 bg-white dark:bg-gray-900 border-t-2 border-lime-800 dark:border-lime-600 p-4 z-40">
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <NavLink 
              to="/dashboard" 
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-lime-800 dark:text-lime-500"
              onClick={() => setShowMore(false)}
            >
              <FiBarChart size={24} />
              <span className="text-xs text-center">Dashboard</span>
            </NavLink>
            <NavLink 
              to="/village-circles" 
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-lime-800 dark:text-lime-500"
              onClick={() => setShowMore(false)}
            >
              <FiUsers size={24} />
              <span className="text-xs text-center">Village Circles</span>
            </NavLink>
            <NavLink 
              to="/parent-dashboard" 
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-lime-800 dark:text-lime-500"
              onClick={() => setShowMore(false)}
            >
              <LiaHomeSolid size={24} />
              <span className="text-xs text-center">Parent View</span>
            </NavLink>
            <NavLink 
              to="/sponsor-board" 
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-lime-800 dark:text-lime-500"
              onClick={() => setShowMore(false)}
            >
              <span className="text-2xl">💚</span>
              <span className="text-xs text-center">Sponsors</span>
            </NavLink>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="fixed bottom-0 rounded-t-2xl border-2 w-full flex justify-between pb-6 pt-4 pl-0 geist-font wght-600 text-md border-lime-800 dark:border-lime-600 bg-white dark:bg-gray-900 z-50">
        <NavLink to="/" className="w-1/5 text-lime-800 dark:text-lime-500 justify-center gap-1 flex flex-col items-center">
          <LiaHomeSolid size={25} />
          <span className="text-xs">Home</span>
        </NavLink>
        <NavLink to="/brackets" className="w-1/5 text-lime-800 dark:text-lime-500 justify-center gap-1 flex flex-col items-center">
          <RiFoldersLine size={25} />
          <span className="text-xs">Brackets</span>
        </NavLink>
        <NavLink to="/events" className="w-1/5 text-lime-800 dark:text-lime-500 justify-center gap-1 flex flex-col items-center">
          <IoCalendarOutline size={25} />
          <span className="text-xs">Events</span>
        </NavLink>
        <NavLink to="/ai-assistant" className="w-1/5 text-lime-800 dark:text-lime-500 justify-center gap-1 flex flex-col items-center">
          <BsStars size={25} />
          <span className="text-xs">AI</span>
        </NavLink>
        <button 
          onClick={() => setShowMore(!showMore)}
          className="w-1/5 text-lime-800 dark:text-lime-500 justify-center gap-1 flex flex-col items-center"
        >
          <span className="text-2xl">{showMore ? '✕' : '☰'}</span>
          <span className="text-xs">More</span>
        </button>
      </div>
    </>
  );
}

export default Navigation;
