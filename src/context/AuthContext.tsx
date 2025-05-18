"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

type AuthContextProps = {
  user: User | null;
  isLoading: boolean;
  logOut: () => Promise<void>;
};
type AuthProviderProps = {
  children: React.ReactNode;
};
const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  logOut: async () => {},
});
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userFromFirebase) => {
      setUser(userFromFirebase);
      setIsloading(false);
    });
    return () => unsubscribe();
  }, []);
  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsloading(false);
      router.push("/");
    } catch (e) {
      if (e instanceof Error) console.log("登出失敗:", e.message);
    }
  };
  return (
    <>
      <AuthContext.Provider value={{ user, isLoading, logOut }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export const useAuth = () => useContext(AuthContext);
