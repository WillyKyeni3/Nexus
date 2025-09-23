import "../App.css";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";


const NavBar = () => {
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<nav className="navbar">
			<div className="navbar-logo">
				<Link to="/">Nexus</Link>
			</div>
			<ul className="navbar-links">
				   <li>
					   <Link to="/">Home</Link>
				   </li>
				   <li>
					   <Link to="/projectdetail">Projects</Link>
				   </li>
					 {user && user.role !== "mentor" && (
						 <li>
							 <Link to="/projectform">Create Project</Link>
						 </li>
					 )}
				{user ? (
					<>
						<li>
							<Link to="/profile">Profile</Link>
						</li>
						<li>
							<button className="navbar-btn" onClick={handleLogout}>
								Logout
							</button>
						</li>
					</>
				) : (
					<>
						<li>
							<Link to="/login">Login</Link>
						</li>
						<li>
							<Link to="/signup">Signup</Link>
						</li>
					</>
				)}
			</ul>
		</nav>
	);
};

export default NavBar;
