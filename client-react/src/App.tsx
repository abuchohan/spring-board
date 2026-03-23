import { useEffect } from "react";
import { fetchSession } from "./redux/auth/authThunks";
import { useAppDispatch } from "./redux/hooks/hooks";
import { Outlet } from "react-router";
import { Toaster } from "./components/ui/sonner";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSession());
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-center" />
      <Outlet />
    </>
  );
}

export default App;
