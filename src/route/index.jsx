import { Navigate, useRoutes } from "react-router-dom";
import MainLayout from "../layout";
import { SignIn, SignUp, FAuth,  Dashboard } from "../pages";

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
    { path: "/sign-up", element: <SignUp /> },
    { path: "/2fa", element: <FAuth /> },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);
};

export default Routes;
