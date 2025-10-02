import { Outlet } from "react-router-dom";

const MainLayout = ({ props }) => (
  <div style={{ paddingTop: props.paddingTop || 0 }}>
    <Outlet />
  </div>
);
