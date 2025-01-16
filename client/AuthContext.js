import React, { createContext, useState } from 'react';
import axios from 'axios';

// Create authentication context
export const AuthContext = createContext();

// AuthProvider component to wrap the entire application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:8081/login', credentials);
      const { token } = response.data;
      localStorage.setItem('token', token); // Store token in local storage
      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:8081/register', userData);
      const { token } = response.data;
      localStorage.setItem('token', token); // Store token in local storage
      setUser(response.data.user);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
