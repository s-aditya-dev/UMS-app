import { create } from "zustand";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { userType } from "@/utils/types/user";
import newRequest from "@/utils/func/request";
import { CustomAxiosError } from "@/utils/types/axios";

interface LoginData {
  loginId: string;
  password: string;
}

interface AuthStore {
  user: userType | null;
  setUser: (user: userType | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export const useAuth = (enabled = false) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  const login = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const response = await newRequest.post("/auth/login", credentials);
      return response.data.data;
    },
    onSuccess: (userData) => {
      if (userData.settings.isPassChange) {
        navigate(`/auth/change-password/${userData._id}`);
      } else if (!userData.settings.isRegistered) {
        navigate(`/auth/register-user/${userData._id}`);
      } else if (userData.isLocked) {
        navigate("/auth/locked");
      } else {
        navigate("/panel/dashboard");
        setUser(userData);
      }
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      setUser(null);
      await newRequest.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["current-user"] });
      navigate("/auth/login");
    },
    onError: () => {
      navigate("/auth/login");
    },
  });

  const {
    data: currentUser,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await newRequest.post("/auth/current-user");
      // Extract the user data from the nested response
      const userData = response.data.data;
      setUser(userData);
      return userData; // Return just the user data
    },
    enabled,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    user: currentUser,
    isLoading,
    login: login.mutate,
    logout: logout.mutate,
    checkUser: refetch, // Expose refetch function to manually check user
    isLoggingIn: login.isPending,
    loginError: login.error as CustomAxiosError | null,
  };
};
