import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setLocation(requireAdmin ? "/admin/login" : "/login");
      } else if (requireAdmin && !isAdmin) {
        setLocation("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, setLocation, requireAdmin]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null; // Will redirect
  }

  return <>{children}</>;
}