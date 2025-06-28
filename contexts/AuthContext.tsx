import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  token: string | null;
  role: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  login: (token: string, role: string, userId: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      const [t, r, id] = await Promise.all([
        AsyncStorage.getItem("token"),
        AsyncStorage.getItem("role"),
        AsyncStorage.getItem("userId"),
      ]);
      setToken(t);
      setRole(r);
      setUserId(id);
    };

    loadAuth();
  }, []);

  const login = async (t: string, r: string, id: string) => {
    await AsyncStorage.multiSet([
      ["token", t],
      ["role", r],
      ["userId", id],
    ]);
    setToken(t);
    setRole(r);
    setUserId(id);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "role", "userId"]);
    setToken(null);
    setRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        userId,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
