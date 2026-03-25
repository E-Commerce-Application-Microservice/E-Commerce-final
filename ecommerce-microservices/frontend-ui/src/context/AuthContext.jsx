import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyToken, login, register, registerAdmin, getProfile } from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token).then(res => {
        if (res.data.valid) {
          // get user robustly
          getProfile(res.data.decoded.userId)
             .then(p => setUser({ ...p.data, id: p.data._id }))
             .catch(() => setUser(res.data.decoded));
        } else {
          localStorage.removeItem('token');
        }
      }).catch(() => {
        localStorage.removeItem('token');
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = async (email, password) => {
    const res = await login({ email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    setShowLoginModal(false);
    return res.data;
  };

  const registerUser = async (data) => {
    const res = await register(data);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    setShowLoginModal(false);
    return res.data;
  };

  const registerAdminUser = async (data) => {
    const res = await registerAdmin(data);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const requireAuth = (action) => {
    if (user) { action(); } else { setShowLoginModal(true); }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, registerUser, registerAdminUser, logout, showLoginModal, setShowLoginModal, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
