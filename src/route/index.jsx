import { Navigate, useRoutes } from "react-router-dom";
import MainLayout from "../layout";
import { SignIn, Dashboard } from "../pages";

const Routes = () => {
  return useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { path: "/", element: <Dashboard /> },
        { path: "/dashboard", element: <Dashboard /> },
      ],
    },
    { path: "/sign-in", element: <SignIn /> },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);
};

export default Routes;
