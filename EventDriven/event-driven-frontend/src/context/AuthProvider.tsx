import React, { createContext, useEffect, useState } from "react";
import {User} from "../dtos/User";

interface AuthContextType {
    auth: { user: User | null };
    setAuth: React.Dispatch<React.SetStateAction<{ user: User | null }>>;
  }
  
const AuthContext = createContext<AuthContextType | undefined>(undefined);
  

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState<{ user: User | null }>(() => {
      const storedAuth = localStorage.getItem("auth");
      return storedAuth ? JSON.parse(storedAuth) : { user: null };  
    });

    useEffect(() => {
        localStorage.setItem("auth", JSON.stringify(auth));
      }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
          {children}
        </AuthContext.Provider>
      );
};

export default AuthContext;