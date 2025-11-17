import { Spinner } from '@/components/ui/spinner'
import { useEffect, useState } from 'react'

const Users = () => {
    const [isLoading, setIsloading] = useState<boolean>(false)
    const [users, setUsers] = useState([])
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsloading(true)
                const res = await fetch('http://localhost:5000/api/users', {
                    method: 'GET',
                    credentials: 'include',
                })

                const data = await res.json()
                setUsers(data)
                console.log(data)
                setIsloading(false)
            } catch (error) {
                console.log(error)
                setIsloading(false)
            }
        }

        fetchUsers()
    }, [])

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <div>
                    {users.map((user: { email: string; id: string }) => (
                        <h1 key={user.id}>{user.email}</h1>
                    ))}
                </div>
            )}
        </>
    )
}

export default Users
