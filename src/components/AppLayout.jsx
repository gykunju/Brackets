import { Outlet } from 'react-router'
import Navigation from './Navigation'
import { AnimatePresence } from 'framer-motion'

function AppLayout( ) {
    return (
      <AnimatePresence>
        <Outlet />
        <Navigation/>
      </AnimatePresence>
    );
}

export default AppLayout