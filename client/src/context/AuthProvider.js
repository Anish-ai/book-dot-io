// src/context/AuthProvider.js
"use client";

import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    role: null,
    deptId: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const deptId = localStorage.getItem("deptId");

      setAuthState({
        isAuthenticated: !!token,
        role,
        deptId: deptId ? parseInt(deptId) : null,
        isLoading: false,
      });
    };

    checkAuth();
  }, []);

  const login = (token, role, deptId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("deptId", deptId);
    setAuthState({
      isAuthenticated: true,
      role,
      deptId: parseInt(deptId),
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.clear();
    setAuthState({
      isAuthenticated: false,
      role: null,
      deptId: null,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
