/** @format */

import "./App.css";
import Registeration from "./Components/Registeration/Registeration";
import {
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
} from "react-router-dom";
import LayOut from "./Components/LayOut/LayOut";
import Login from "./Components/Login/Login";
import ProfilePage from "./Components/ProfilePage/ProfilePage";
import Settings from "./Components/Settings/Settings";
import ComingSoon from "./Components/ComingSoon/ComingSoon";
import Dashboard from "./Components/Dashboard/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

function App() {
  const routers = createHashRouter([
    {
      path: "/",
      element: <LayOut />,
      children: [
        {
          path: "reg",
          element: <Registeration />,
        },
        {
          path: "soon",
          element: (
            <ProtectedRoute>
              {" "}
              <ComingSoon />
            </ProtectedRoute>
          ),
        },
        {
          path: "dashboard",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          index: true,
          element: <Login />,
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: ":username",
          element: <ProfilePage />,
        },
        {
          path: "settings",
          element: (
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={routers} />
    </>
  );
}

export default App;
