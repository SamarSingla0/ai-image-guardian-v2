import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginUser = async (username, password) => {
    try {
      const response = await api.post('login/', { username, password });
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      localStorage.setItem('username', username);

      const decoded = jwtDecode(response.data.access);
      setUser({ ...decoded, username });
      return { success: true };
    } catch (error) {
      console.error('Login failed', error);
      return { success: false, msg: 'Invalid credentials' };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    setUser(null);
  };

  const registerUser = async (username, email, password) => {
    try {
      await api.post('register/', { username, email, password });
      return { success: true };
    } catch (error) {
      return { success: false, msg: error.response?.data || 'Registration failed' };
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const storedUsername = localStorage.getItem('username');
        setUser({
          ...decoded,
          username: storedUsername || decoded.username || decoded.user_id,
        });
      } catch (error) {
        logoutUser();
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, registerUser, loading }}>
      {loading ? <div className="text-center mt-10">Loading...</div> : children}
    </AuthContext.Provider>
  );
};