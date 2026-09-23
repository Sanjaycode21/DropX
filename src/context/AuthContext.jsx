import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEMO_ACCOUNTS = {
  admin: {
    email: 'admin@dropx.com',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin',
    property: 'City Horizon Smart District (Zone 4)',
    meterId: 'ESP32-GATEWAY-M01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    title: 'Water Grid Supervisor'
  },
  user: {
    email: 'user@dropx.com',
    password: 'user123',
    name: 'Omkar Sharma',
    role: 'user',
    property: 'Villa #42, Cyan Valley Heights',
    meterId: 'ESP32-WTR-8842',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    title: 'Homeowner'
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dropx_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse saved user', e);
      return null;
    }
  });

  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dropx_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('dropx_user');
    }
  }, [currentUser]);

  const login = (email, password, remember = true) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (trimmedEmail === DEMO_ACCOUNTS.admin.email && password === DEMO_ACCOUNTS.admin.password) {
      const user = { ...DEMO_ACCOUNTS.admin };
      setRememberMe(remember);
      setCurrentUser(user);
      return { success: true, user };
    }
    
    if (trimmedEmail === DEMO_ACCOUNTS.user.email && password === DEMO_ACCOUNTS.user.password) {
      const user = { ...DEMO_ACCOUNTS.user };
      setRememberMe(remember);
      setCurrentUser(user);
      return { success: true, user };
    }

    // Allow flexible login for demo if entered standard admin or user credentials
    if (trimmedEmail.includes('admin')) {
      const user = { ...DEMO_ACCOUNTS.admin, email: trimmedEmail };
      setCurrentUser(user);
      return { success: true, user };
    }

    if (trimmedEmail.includes('user') || trimmedEmail) {
      const user = { ...DEMO_ACCOUNTS.user, email: trimmedEmail };
      setCurrentUser(user);
      return { success: true, user };
    }

    return { success: false, error: 'Invalid credentials. Please use demo credentials.' };
  };

  const loginAsDemo = (role = 'user') => {
    const user = DEMO_ACCOUNTS[role] || DEMO_ACCOUNTS.user;
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dropx_user');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAdmin: currentUser?.role === 'admin',
      login,
      loginAsDemo,
      logout,
      rememberMe,
      setRememberMe,
      DEMO_ACCOUNTS
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
