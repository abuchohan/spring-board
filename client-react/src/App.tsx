import { useEffect } from 'react'
import { fetchSession } from './redux/auth/authThunks'
import { useAppDispatch } from './redux/hooks/hooks'
import { Outlet } from 'react-router'

function App() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchSession())
    }, [dispatch])

    return <Outlet />
}

export default App
