import React, { createContext, useState, useEffect } from "react";

interface AuthContextType {
  isSignedIn: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  signIn: () => {},
  signOut: () => {},
  isSignedIn: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSignedIn, setIsSignedIn] = useState(true);

  useEffect(() => {
    // Load sign-in state from localStorage on first render
    const token = localStorage.getItem("authToken");
    setIsSignedIn(!!token);
  }, []);

  const signIn = (token: string) => {
    localStorage.setItem("authToken", token);
    setIsSignedIn(true);
  };

  const signOut = () => {
    localStorage.removeItem("authToken");
    setIsSignedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
