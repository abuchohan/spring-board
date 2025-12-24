import { Spinner } from "@/components/ui/spinner";
import { PageWrapper } from "@/layouts/PageWrapper";
import useSWR from "swr";
const API_URL = import.meta.env.VITE_API_URL;

const Users = () => {
  const { data, isLoading } = useSWR(`${API_URL}/users/`, (url) =>
    fetch(url, { credentials: "include" }).then((res) => res.json())
  );

  return (
    <PageWrapper title="Users">
      {isLoading && <Spinner />}
      {data && (
        <div>
          {data?.map((user: { email: string; id: string }) => (
            <h1 key={user.id}>{user.email}</h1>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default Users;
