// src/utils/auth.js

import api from "@/app/utils/api";

export const login = async (credentials) => {
    try {
      console.log('Logging in with credentials:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('deptId', response.data.deptId);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('deptId');
  };
  
  export const getAuthToken = () => localStorage.getItem('token');
  export const getCurrentUser = () => ({
    role: localStorage.getItem('role'),
    deptId: parseInt(localStorage.getItem('deptId')),
  });
  
  export const isAuthenticated = () => !!localStorage.getItem('token');