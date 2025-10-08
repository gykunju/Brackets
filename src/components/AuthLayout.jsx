import { Outlet } from 'react-router'
import { useUser } from '../context/UserContext'

function AuthLayout() {
    const { isLoggedIn, checkSession } = useUser()

    checkSession()
    return( 
        <>
            {!isLoggedIn && (
                <Outlet/>   
            )}
        </>
    )
}

export default AuthLayout