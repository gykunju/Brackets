import { RiFoldersLine } from "react-icons/ri";
import { LiaHomeSolid } from "react-icons/lia";
import { IoCalendarOutline } from "react-icons/io5";
import { BsStars } from "react-icons/bs";
import { NavLink } from "react-router"

function Navigation() {
  return (
    <div className="fixed bottom-0 rounded-t-2xl border-t-2 w-full flex justify-between pb-6 pt-2 pl-0 geist-font wght-600 text-sm border-lime-800 dark:border-stone-800 bg-white dark:bg-stone-900 transition-colors z-50">
      <NavLink
        to="/"
        className="w-1/4 text-lime-800 dark:text-gray-400 justify-center gap-1 flex flex-col items-center"
      >
        {({ isActive }) => (
          <>
            <LiaHomeSolid
              size={25}
              className={`${isActive ? "text-black dark:text-lime-400" : ""}`}
            />
            <span className={`${isActive ? "text-black dark:text-lime-400" : ""}`}>Home</span>
          </>
        )}
      </NavLink>
      <NavLink
        to="/brackets"
        className="w-1/4 text-lime-800 dark:text-gray-400 justify-center gap-1 flex flex-col items-center"
      >
        {({ isActive }) => (
          <>
            <RiFoldersLine
              size={25}
              className={`${isActive ? "text-black dark:text-lime-400" : ""}`}
            />
            <span className={`${isActive ? "text-black dark:text-lime-400" : ""}`}>Brackets</span>
          </>
        )}
      </NavLink>
      <NavLink
        to="/events"
        className="w-1/4 text-lime-800 dark:text-gray-400 justify-center gap-1 flex flex-col items-center"
      >
        {({ isActive }) => (
          <>
            <IoCalendarOutline
              size={25}
              className={`${isActive ? "text-black dark:text-lime-400" : ""}`}
            />
            <span className={`${isActive ? "text-black dark:text-lime-400" : ""}`}>Events</span>
          </>
        )}
      </NavLink>
      <NavLink
        to="/ai-assistant"
        className="w-1/4 text-lime-800 dark:text-gray-400 justify-center gap-1 flex flex-col items-center"
      >
        {({ isActive }) => (
          <>
            <BsStars size={25} className={`${isActive ? "text-black dark:text-lime-400" : ""}`} />
            <span className={`${isActive ? "text-black dark:text-lime-400" : ""}`}>
              AI Assistant
            </span>
          </>
        )}
      </NavLink>
    </div>
  );
}

export default Navigation;
