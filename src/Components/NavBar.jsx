import "../App.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to={user ? "/home" : "/"}>
           <span className="logo-main">NEX</span>
            <span className="logo-gradient">US</span>
		  </Link>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/home">Projects</Link>
              {user.role !== "mentor" && (
                <Link to="/projectform">Create Project</Link>
              )}
              <Link to="/profile">Profile</Link>
              <button className="navbar-btn" onClick={handleLogout}>
                 <i class="ri-logout-box-r-line"></i>Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-btn">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
