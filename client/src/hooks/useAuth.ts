import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export interface User {
  id: string;
  email: string | null;
  username: string | null;
  role: string | null;
}

interface AuthResponse {
  success: boolean;
  user: User;
}

export function useAuth() {
  const { data, isLoading, error } = useQuery<AuthResponse | null>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
  });

  return {
    user: data?.user || null,
    isLoading,
    isAuthenticated: !!data?.user,
  };
}
