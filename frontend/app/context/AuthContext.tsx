"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

type Usuario = {
  id: string;
  nombre: string;
  email: string;
  role: "admin" | "cliente";
};

type AuthContextType = {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (nombre: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Cargar sesión del localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("usuario");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulación - En producción esto iría al backend
      if (email === "admin@suministros.com" && password === "admin123") {
        const userData = {
          id: "1",
          nombre: "Administrador",
          email: "admin@suministros.com",
          role: "admin" as const
        };
        const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFkbWluQHN1bWluaXN0cm9zLmNvbSIsInJvbGUiOiJhZG1pbiJ9";
        
        setUsuario(userData);
        setToken(fakeToken);
        localStorage.setItem("token", fakeToken);
        localStorage.setItem("usuario", JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  const register = async (nombre: string, email: string, password: string) => {
    try {
      // Simulación - En producción iría al backend
      const userData = {
        id: Date.now().toString(),
        nombre,
        email,
        role: "cliente" as const
      };
      const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJlbWFpbCI6ImNsaWVudGVAZ21haWwuY29tIiwicm9sZSI6ImNsaWVudGUifQ";
      
      setUsuario(userData);
      setToken(fakeToken);
      localStorage.setItem("token", fakeToken);
      localStorage.setItem("usuario", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Error en registro:", error);
      return false;
    }
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!usuario,
        isAdmin: usuario?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};