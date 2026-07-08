import { RiFoldersLine } from "react-icons/ri";
import { LiaHomeSolid } from "react-icons/lia";
import { IoCalendarOutline, IoSettingsOutline } from "react-icons/io5";
import { BsStars } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

function Navigation({ isOpen = true, setIsOpen }) {
  return (
    <>
      {/* Floating Hamburger Button (Desktop Only) - Shows when sidebar is closed */}
      {!isOpen && setIsOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="hidden md:flex fixed top-4 left-4 z-[70] p-2 bg-white dark:bg-stone-900 rounded-xl shadow-md border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all text-lime-800 dark:text-lime-400"
        >
          <FiMenu size={24} />
        </button>
      )}

      <div className={`fixed bottom-0 md:bottom-auto md:top-0 md:left-0 w-full md:w-24 md:h-screen flex md:flex-col justify-between md:justify-center md:gap-12 pb-6 pt-3 md:py-0 px-2 md:px-0 rounded-t-2xl md:rounded-t-none md:rounded-r-2xl border-t-2 md:border-t-0 border-lime-800 dark:border-stone-800 bg-white dark:bg-stone-900 transition-transform duration-300 z-[70] shadow-lg md:shadow-xl ${isOpen ? 'md:translate-x-0 md:border-r-2' : 'md:-translate-x-full md:border-r-0'}`}>
        
        {/* Close Button inside Sidebar (Desktop Only) */}
        {isOpen && setIsOpen && (
          <button 
            onClick={() => setIsOpen(false)}
            className="hidden md:flex absolute top-4 left-1/2 -translate-x-1/2 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        )}
      <NavLink
        to="/"
        className="w-1/4 md:w-full text-lime-800 dark:text-gray-400 justify-center gap-1.5 flex flex-col items-center group transition-colors"
      >
        {({ isActive }) => (
          <>
            <LiaHomeSolid
              size={26}
              className={`${isActive ? "text-black dark:text-lime-400" : "group-hover:text-black dark:group-hover:text-lime-200"} transition-colors`}
            />
            <span className={`text-[10px] md:text-sm geist-font wght-600 ${isActive ? "text-black dark:text-lime-400" : "group-hover:text-black dark:group-hover:text-lime-200"} transition-colors`}>Home</span>
          </>
        )}
      </NavLink>
      <NavLink
        to="/brackets"
        className="w-1/4 md:w-full text-lime-800 dark:text-gray-400 justify-center gap-1.5 flex flex-col items-center group transition-colors"
      >
        {({ isActive }) => (
          <>
            <RiFoldersLine
              size={26}
              className={`${isActive ? "text-black dark:text-lime-400" : "group-hover:text-black dark:group-hover:text-lime-200"} transition-colors`}
            />
            <span className={`text-[10px] md:text-sm geist-font wght-600 ${isActive ? "text-black dark:text-lime-400" : "group-hover:text-black dark:group-hover:text-lime-200"} transition-colors`}>Brackets</span>
          </>
        )}
      </NavLink>
      <NavLink
        to="/events"
        className="w-1/4 md:w-full text-lime-800 dark:text-gray-400 justify-center gap-1.5 flex flex-col items-center group transition-colors"
      >
        {({ isActive }) => (
          <>
            <IoCalendarOutline
              size={26}
              className={`${isActive ? "text-black dark:text-lime-400" : "group-hover:text-black dark:group-hover:text-lime-200"} transition-colors`}
            />
            <span className={`text-[10px] md:text-sm geist-font wght-600 ${isActive ? "text-black dark:text-lime-400" : "group-hover:text-black dark:group-hover:text-lime-200"} transition-colors`}>Events</span>
          </>
        )}
      </NavLink>
      <NavLink
        to="/ai-assistant"
        className="w-1/4 md:w-full text-lime-800 dark:text-gray-400 justify-center gap-1.5 flex flex-col items-center group transition-colors"
      >
        {({ isActive }) => (
          <>
            <BsStars size={26} className={`${isActive ? "text-black dark:text-lime-400" : "group-hover:text-black dark:group-hover:text-lime-200"} transition-colors`} />
            <span className={`text-[10px] md:text-sm geist-font wght-600 ${isActive ? "text-black dark:text-lime-400" : "group-hover:text-black dark:group-hover:text-lime-200"} transition-colors text-center leading-tight`}>
              AI<span className="hidden md:inline"><br/></span> Assist
            </span>
          </>
        )}
      </NavLink>
      <NavLink
        to="/profile"
        className="hidden md:flex md:w-full text-lime-800 dark:text-gray-400 justify-center gap-1.5 flex-col items-center group transition-colors"
      >
        {({ isActive }) => (
          <>
            <IoSettingsOutline
              size={26}
              className={`${isActive ? "text-black dark:text-lime-400" : "group-hover:text-black dark:group-hover:text-lime-200"} transition-colors`}
            />
            <span className={`text-[10px] md:text-sm geist-font wght-600 ${isActive ? "text-black dark:text-lime-400" : "group-hover:text-black dark:group-hover:text-lime-200"} transition-colors text-center leading-tight`}>
              Settings
            </span>
          </>
        )}
      </NavLink>
    </div>
    </>
  );
}

export default Navigation;
