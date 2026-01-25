import { Outlet } from "react-router";
import BottomNav from "./BottomNav";

export default function AppLayout() {
  return (
    <>
      <div
        style={{ paddingBottom: 100, overflowY: "scroll", height: "100dvh" }}
      >
        <Outlet />
      </div>
      <BottomNav />
    </>
  );
}
