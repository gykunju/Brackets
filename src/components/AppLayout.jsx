import { Outlet, useNavigate } from "react-router";
import Navigation from "./Navigation";
import { AnimatePresence } from "framer-motion";
import { useUser } from '../context/UserContext'

function AppLayout() {
  const { isLoggedIn } = useUser()

  const navigate = useNavigate()
  return (
    <AnimatePresence mode="wait">
      { isLoggedIn && (
          <div key="layout">
            <Outlet />
            <Navigation />
          </div>
        )
      }
      </AnimatePresence>
  );
}

export default AppLayout;
