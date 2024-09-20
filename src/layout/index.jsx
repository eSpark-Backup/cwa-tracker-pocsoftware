import { Navigate, Outlet } from "react-router-dom";

const MainLayout = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
};

export default MainLayout;
