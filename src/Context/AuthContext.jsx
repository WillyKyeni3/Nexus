import React, { createContext, useState, useEffect, useContext } from "react";
import Api from "../Services/Api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

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
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await Api.post("/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    // Optional: check session on mount, refresh token, etc.
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
