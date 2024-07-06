import React, { createContext, useState } from "react";

interface AuthContextType {
    auth: { user: string | null };
    setAuth: React.Dispatch<React.SetStateAction<{ user: string | null }>>;
  }
  
const AuthContext = createContext<AuthContextType | undefined>(undefined);
  

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState<{ user: string | null }>({ user: null });

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
          {children}
        </AuthContext.Provider>
      );
};

export default AuthContext;