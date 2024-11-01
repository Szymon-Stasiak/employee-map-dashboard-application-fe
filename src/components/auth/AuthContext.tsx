import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import CustomJwtPayload from '../../utils/CustomJwtPayload';

const AuthContext = createContext<
  | {
      userEmail: string | null;
      setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
      isLoggedIn: boolean;
      setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
      userRoles: string[];
      setUserRoles: React.Dispatch<React.SetStateAction<string[]>>;
      logIn(email: string | null, role: string[]): void;
      logOut(): void;
    }
  | undefined
>(undefined);

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = (props) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token) as CustomJwtPayload;
      const sub = decodedToken.sub;
      const authorities = decodedToken.authorities;
      const roleArray = authorities.map((authority: { authority: string }) => authority.authority);

      if (typeof sub === 'string') {
        logIn(sub, roleArray);
      } else {
        console.log('Email is undefined');
      }
    }
  }, []);

  const logIn = (email: string, role: string[]) => {
    setUserEmail(email);
    setIsLoggedIn(true);
    setUserRoles(role);
  };

  const logOut = () => {
    setUserEmail(null);
    setIsLoggedIn(false);
    setUserRoles([]);
    localStorage.removeItem('token');
  };

  const value = {
    userEmail,
    setUserEmail,
    isLoggedIn,
    setIsLoggedIn,
    userRoles: userRoles,
    setUserRoles: setUserRoles,
    logIn,
    logOut,
  };

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};
