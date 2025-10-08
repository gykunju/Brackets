import { useNavigate, useParams } from 'react-router'

function NotFound() {

    const navigate = useNavigate()
    const params = useParams()

    if (params['*'] == 'signup' || params['*'] == 'signin') {
        navigate('/')
    }


    return (
        <div>
            <h2>404</h2>
            <p>The page does not exist</p>
        </div>
    )
}

export default NotFound