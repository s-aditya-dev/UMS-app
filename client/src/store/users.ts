import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { userType, ChangeUserPassword } from "@/utils/types/user";
import newRequest from "@/utils/func/request";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types for pagination and response
interface PaginatedResponse {
  users: userType[];
  currentPage: number;
  limitNumber: number;
  totalPages: number;
  totalUsers: number;
}

interface UserQueryParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

// Updated API functions
export const userApi = {
  getUsers: async ({
    page = 1,
    limit = 5,
    role,
    search,
  }: UserQueryParams = {}) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(role && { role }),
      ...(search && { search }),
    });
    const response = await newRequest.get(`/user?${queryParams}`);
    return response.data as PaginatedResponse;
  },
  getUserById: async (userId: string) => {
    const response = await newRequest.get(`/user/${userId}`);
    return response.data;
  },
  createUser: async (userData: Omit<userType, "_id">) => {
    const response = await newRequest.post("/user", userData);
    return response.data;
  },
  updateUser: async ({
    userId,
    updates,
  }: {
    userId: string;
    updates: Partial<userType>;
  }) => {
    const response = await newRequest.patch(`/user/${userId}`, updates);
    return response.data;
  },
  changeUserPassword: async ({
    userId,
    passwords,
  }: {
    userId: string;
    passwords: ChangeUserPassword;
  }) => {
    const response = await newRequest.patch(
      `/user/${userId}/password`,
      passwords,
    );
    return response.data;
  },
  deleteUser: async (userId: string) => {
    const response = await newRequest.delete(`/user/${userId}`);
    return response.data;
  },
};

// Updated custom hooks for React Query operations
export const useUsers = (params: UserQueryParams = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.getUsers(params),
    keepPreviousData: true,
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => userApi.getUserById(userId),
    enabled: !!userId,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
    },
  });
};

export const useChangeUserPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.changeUserPassword,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Updated Zustand store to include pagination state
interface UserState {
  selectedUserId: string | null;
  currentPage: number;
  itemsPerPage: number;
  selectedRole: string | null;
  searchQuery: string; // Add search query state
  setSelectedUserId: (userId: string | null) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
  setSelectedRole: (role: string | null) => void;
  setSearchQuery: (query: string) => void; // Add search query setter
}

const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      selectedUserId: null,
      currentPage: 1,
      itemsPerPage: 5,
      selectedRole: null,
      searchQuery: "", // Initialize search query
      setSelectedUserId: (userId) => set({ selectedUserId: userId }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setItemsPerPage: (limit) => set({ itemsPerPage: limit }),
      setSelectedRole: (role) => set({ selectedRole: role }),
      setSearchQuery: (query) => set({ searchQuery: query }), // Add search query setter
    }),
    {
      name: "user-store",
    },
  ),
);

export default useUserStore;
