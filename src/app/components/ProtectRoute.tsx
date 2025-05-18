import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Children, useEffect } from "react";
const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/");
    }
  }, [user, isLoading]);
  if (!user && isLoading) return <div>載入中...</div>;

  return <>{children}</>;
};
export default ProtectRoute;
