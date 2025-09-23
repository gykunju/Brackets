import { RiFoldersLine } from "react-icons/ri";
import { LiaHomeSolid } from "react-icons/lia";
import { IoCalendarOutline } from "react-icons/io5";
import { BsStars } from "react-icons/bs";
import { NavLink } from "react-router"

function Navigation() {
  return (
    <div className="fixed bottom-0 border w-full flex justify-between p-2 pl-0 geist-font wght-600 text-md text-zinc-800">
      <NavLink to="/" className="w-1/4 justify-center gap-1 flex flex-col items-center">
        <LiaHomeSolid size={25} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/brackets" className="w-1/4 justify-center gap-1 flex flex-col items-center">
        <RiFoldersLine size={25} />
        <span>Brackets</span>
      </NavLink>
      <NavLink to="/events" className="w-1/4 justify-center gap-1 flex flex-col items-center">
        <IoCalendarOutline size={25} />
        <span>Events</span>
      </NavLink>
      <NavLink to="/ai-assistant" className="w-1/4 justify-center gap-1 flex flex-col items-center">
        <BsStars size={25} />
        <span>AI Assistant</span>
      </NavLink>
    </div>
  );
}

export default Navigation;
