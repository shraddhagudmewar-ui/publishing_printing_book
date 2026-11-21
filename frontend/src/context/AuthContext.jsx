import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ka_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ka_auth_token'));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      // Backend returns { success: true, message: '...', data: { id, name, email, role, token, ... } }
      const authData = response.data?.data || response.data;
      setUser(authData);
      setToken(authData.token);
      localStorage.setItem('ka_auth_token', authData.token);
      localStorage.setItem('ka_auth_user', JSON.stringify(authData));
      return { success: true, user: authData };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'customer') => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const authData = response.data?.data || response.data;
      setUser(authData);
      setToken(authData.token);
      localStorage.setItem('ka_auth_token', authData.token);
      localStorage.setItem('ka_auth_user', JSON.stringify(authData));
      return { success: true, user: authData };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ka_auth_token');
    localStorage.removeItem('ka_auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
