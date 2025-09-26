import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx"; 
import Projectdetail from "../pages/Projectdetail.jsx";
import Profile from "../pages/Profile.jsx";
import Projectform from "../pages/Projectform.jsx";
import Signup from "../pages/Signup.jsx";
import LandingPage from "../pages/Landingpage.jsx";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import EditProject from "../pages/EditProject.jsx";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
};

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/projects/:id",
        element: (
          <ProtectedRoute>
            <Projectdetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/projectform",
        element: (
          <ProtectedRoute>
            <Projectform />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/projects/:id/edit",
        element:(
          <ProtectedRoute>
            <EditProject/>
          </ProtectedRoute>
        )
      }
    ]
  }
];

export default routes;