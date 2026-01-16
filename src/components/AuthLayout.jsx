import { Outlet } from 'react-router'
import { useUser } from '../context/UserContext'

function AuthLayout() {
    const { isLoggedIn } = useUser()

    return( 
        <>
            {!isLoggedIn && (
                <Outlet/>   
            )}
        </>
    )
}

export default AuthLayout