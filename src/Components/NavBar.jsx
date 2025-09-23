import "../App.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Nexus
            </Link>
          </div>

          {/* Links */}
          <div className="flex space-x-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              to="/projectdetail"
              className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
            >
              Projects
            </Link>
            {user && user.role !== "mentor" && (
              <Link
                to="/projectform"
                className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
              >
                Create Project
              </Link>
            )}

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
