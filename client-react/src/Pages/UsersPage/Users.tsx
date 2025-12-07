import { Spinner } from '@/components/ui/spinner'
import { PageWrapper } from '@/layouts/PageWrapper'
import useSWR from 'swr'

const Users = () => {
    const { data, isLoading } = useSWR(
        'http://localhost:5000/api/users/',
        (url) =>
            fetch(url, { credentials: 'include' }).then((res) => res.json())
    )

    return (
        <PageWrapper title="Users">
            {isLoading && <Spinner />}
            <div>
                {data?.map((user: { email: string; id: string }) => (
                    <h1 key={user.id}>{user.email}</h1>
                ))}
            </div>
        </PageWrapper>
    )
}

export default Users
