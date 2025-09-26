import React, { useEffect } from "react";
import NavBar from "./Components/NavBar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect logic
    if (user) {
      // If user is authenticated and on landing page, redirect to home
      if (location.pathname === '/') {
        navigate('/home');
      }
    } else {
      // If user is not authenticated and tries to access protected routes
      const protectedRoutes = ['/home', '/profile', '/projectform'];
      if (protectedRoutes.includes(location.pathname)) {
        navigate('/');
      }
    }
  }, [user, location.pathname, navigate]);

  return (
    <div>
      <NavBar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;