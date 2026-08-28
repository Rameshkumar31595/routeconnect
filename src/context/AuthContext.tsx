import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextValue {
  user: User | null;
  sessionId: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string, email: string, phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('routeconnect-user');
    return stored ? JSON.parse(stored) : null;
  });
  const [sessionId, setSessionId] = useState<string | null>(() => {
    return localStorage.getItem('routeconnect-session');
  });
  const navigate = useNavigate();

  const API_BASE = '/api';

  const handleResponse = async (response: Response, defaultError: string) => {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!response.ok) {
      if (isJson) {
        const errorData = await response.json();
        throw new Error(errorData.error || defaultError);
      } else {
        throw new Error('Unable to connect to the backend server. Please make sure the server is running.');
      }
    }

    if (!isJson) {
      throw new Error('Invalid response received from server.');
    }

    return response.json();
  };

  const login = async (identifier: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await handleResponse(response, 'Login failed');
      setUser(data.user);
      setSessionId(data.sessionId);
      localStorage.setItem('routeconnect-user', JSON.stringify(data.user));
      localStorage.setItem('routeconnect-session', data.sessionId);
      navigate('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, phone: string, password: string, confirmPassword: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, confirmPassword }),
      });

      const data = await handleResponse(response, 'Signup failed');
      setUser(data.user);
      setSessionId(data.sessionId);
      localStorage.setItem('routeconnect-user', JSON.stringify(data.user));
      localStorage.setItem('routeconnect-session', data.sessionId);
      navigate('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (sessionId) {
        await fetch(`${API_BASE}/auth/logout/${sessionId}`, {
          method: 'POST',
        });
      }
      setUser(null);
      setSessionId(null);
      localStorage.removeItem('routeconnect-user');
      localStorage.removeItem('routeconnect-session');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still log out on client side even if server request fails
      setUser(null);
      setSessionId(null);
      localStorage.removeItem('routeconnect-user');
      localStorage.removeItem('routeconnect-session');
      navigate('/login');
    }
  };

  const updateProfile = async (name: string, email: string, phone: string) => {
    try {
      if (!sessionId) throw new Error('No active session');

      const response = await fetch(`${API_BASE}/auth/profile/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });

      const data = await handleResponse(response, 'Update failed');
      setUser(data.user);
      localStorage.setItem('routeconnect-user', JSON.stringify(data.user));
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, sessionId, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
