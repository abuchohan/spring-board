import { Spinner } from '@/components/ui/spinner'
import { useEffect, useState } from 'react'
import { PageWrapper } from '@/layouts/PageWrapper'

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
            } catch (error) {
                console.log(error)
            } finally {
                setIsloading(false)
            }
        }

        fetchUsers()
    }, [])

    return (
        <PageWrapper title="Users">
            {isLoading ? (
                <Spinner />
            ) : (
                <div>
                    {users.map((user: { email: string; id: string }) => (
                        <h1 key={user.id}>{user.email}</h1>
                    ))}
                </div>
            )}
        </PageWrapper>
    )
}

export default Users
