import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  uid: string;
  role: string;
  name: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      
      if (isAuthenticated === 'true') {
        setUser({
          uid: localStorage.getItem('uid') || '',
          role: localStorage.getItem('userRole') || '',
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || undefined
        });
      }
      setIsLoading(false);
    };

    checkAuth();
    
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('uid', userData.uid);
    if (userData.email) {
      localStorage.setItem('userEmail', userData.email);
    }
    
    setUser({
      uid: userData.uid,
      role: userData.role,
      name: userData.name,
      email: userData.email
    });
    
    window.dispatchEvent(new Event('authChange'));
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('uid');
    localStorage.removeItem('userEmail');
    
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);