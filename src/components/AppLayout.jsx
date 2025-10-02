import { Outlet } from 'react-router'
import Navigation from './Navigation'

function AppLayout( ) {
    return (
      <>
        <Outlet />
        <Navigation/>
      </>
    );
}

export default AppLayout