import React, { createContext, useState, useEffect } from "react";
import Api from "../Services/Api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const stored = localStorage.getItem("user");
		return stored ? JSON.parse(stored) : null;
	});

	const login = async (email, password) => {
		try {
			const res = await Api.post("/login", { email, password });
			setUser(res.data);
			localStorage.setItem("user", JSON.stringify(res.data));
			return { success: true };
		} catch (err) {
			return { success: false, error: err.response?.data?.error || "Login failed" };
		}
	};

	const logout = async () => {
		await Api.post("/logout");
		setUser(null);
		localStorage.removeItem("user");
	};

	useEffect(() => {
		// Optionally, check session on mount
	}, []);

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
