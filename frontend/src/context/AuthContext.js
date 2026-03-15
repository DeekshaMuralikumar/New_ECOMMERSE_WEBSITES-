import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../api/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          const userId = decoded.userId || decoded.sub;
          setUser({
            id: userId,
            role: decoded.role || 'CUSTOMER',
            email: decoded.email,
          });
          setIsAuthenticated(true);
          // Fetch full user profile to get address, name, etc.
          axiosInstance.get(`/users/${userId}`).then(res => {
            setUser(prev => ({ ...prev, ...res.data }));
          }).catch(console.error);
        }
      } catch (err) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser({
      id: decoded.userId || decoded.sub,
      role: decoded.role || 'CUSTOMER',
      email: decoded.email,
    });
    setIsAuthenticated(true);
    // Optionally fetch profile
    axiosInstance.get(`/users/${decoded.userId || decoded.sub}`).then(res => {
      setUser(prev => ({ ...prev, ...res.data }));
    }).catch(console.error);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async () => {
    if (!user?.id) return;
    try {
      const res = await axiosInstance.get(`/users/${user.id}`);
      setUser(prev => ({ ...prev, ...res.data }));
    } catch (err) {
      console.error('Failed to update user context', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};