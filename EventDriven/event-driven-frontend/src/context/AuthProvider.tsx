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
    const refreshToken = async () => {
      const response = await fetch("http://localhost:8000/auth/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: localStorage.getItem("refreshToken"),
        }),
      });

      if(response.ok){
        const data = await response.json();
        localStorage.setItem("auth", JSON.stringify({ user: data.user }));
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        setAuth({ user: data.user });
      }
    };

    const interval = setInterval(() => {
      refreshToken();
    }, 1000 * 60 * 10);

    return () => clearInterval(interval);
  }, []);

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