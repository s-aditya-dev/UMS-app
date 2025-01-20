import newRequest from "@/utils/func/request";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";

export interface Permission {
  page: string;
  actions: string[];
}

export interface RoleType {
  _id: string;
  name: string;
  precedence: number;
  permissions: Permission[];
  createdBy: string;
  updatedBy: string;
}

export interface CombinedRoleType {
  highestRole: string;
  roles: string[];
  highestPrecedence: number;
  permissions: Permission[];
}

export interface PrecedenceUpdate {
  _id: string;
  precedence: number;
}

//Role Api
export const roleApi = {
  getRoles: async () => {
    const response = await newRequest.get<{ roles: RoleType[] }>("/role");
    return response.data.roles;
  },

  getRole: async (id: string) => {
    const response = await newRequest.get<{ role: RoleType }>(`/role/${id}`);
    return response.data.role;
  },

  getRolesArray: async () => {
    const response = await newRequest.get<{ roles: string[] }>(
      "/role/rolesArray",
    );
    return response.data.roles;
  },

  getCombinedRole: async (roles: string[]) => {
    const response = await newRequest.post<{ role: CombinedRoleType[] }>(
      "/role/combinedRole",
      { roles },
    );
    return response.data.role;
  },

  createRole: async (roleData: {
    name: string;
    permissions: Permission[];
    createdBy: string;
  }) => {
    const response = await newRequest.post<{ role: RoleType }>(
      "/role",
      roleData,
    );
    return response.data.role;
  },

  updateRole: async (
    id: string,
    roleData: {
      name?: string;
      permissions?: Permission[];
      updatedBy: string;
    },
  ) => {
    const response = await newRequest.patch<{ role: RoleType }>(
      `/role/${id}`,
      roleData,
    );
    return response.data.role;
  },

  deleteRole: async (id: string) => {
    const response = await newRequest.delete(`/role/${id}`);
    return response.data;
  },

  updateRolePrecedences: async (updates: PrecedenceUpdate[]) => {
    const response = await newRequest.patch<{ roles: RoleType[] }>(
      "/role/precedence",
      { updates },
    );
    return response.data.roles;
  },

  reorderPrecedence: async () => {
    const response = await newRequest.post("/role/reorder");
    return response.data;
  },
};

// roleStore.ts
interface RoleStore {
  selectedRole: RoleType | null;
  setSelectedRole: (role: RoleType | null) => void;
}

export const useRoleStore = create<RoleStore>((set) => ({
  selectedRole: null,
  setSelectedRole: (role) => set({ selectedRole: role }),
}));

// useRoles.ts
export const useRoles = () => {
  const queryClient = useQueryClient();

  // Fetch all roles
  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: roleApi.getRoles,
  });

  // Fetch single role
  const useRole = (id: string) =>
    useQuery({
      queryKey: ["role", id],
      queryFn: () => roleApi.getRole(id),
      enabled: !!id,
    });

  // Fetch array of role name
  const rolesArray = useQuery({
    queryKey: ["rolesArray"],
    queryFn: roleApi.getRolesArray,
  });

  // Fetch combined user roles
  const useCombinedRoles = (roles: string[]) =>
    useQuery({
      queryKey: ["combinedRoles", roles],
      queryFn: () => roleApi.getCombinedRole(roles),
      enabled: roles.length > 0,
    });

  // Create role
  const createRoleMutation = useMutation({
    mutationFn: roleApi.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", "rolesArray"] });
    },
  });

  // Update role
  const updateRoleMutation = useMutation({
    mutationFn: ({
      id,
      ...data
    }: { id: string } & Parameters<typeof roleApi.updateRole>[1]) =>
      roleApi.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", "rolesArray"] });
    },
  });

  // Delete role
  const deleteRoleMutation = useMutation({
    mutationFn: roleApi.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", "rolesArray"] });
    },
  });

  // Update precedences
  const updatePrecedencesMutation = useMutation({
    mutationFn: roleApi.updateRolePrecedences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", "rolesArray"] });
    },
  });

  // Reorder precedence
  const reorderPrecedenceMutation = useMutation({
    mutationFn: roleApi.reorderPrecedence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", "rolesArray"] });
    },
  });

  return {
    rolesQuery,
    rolesArray,
    useRole,
    useCombinedRoles,
    createRoleMutation,
    updateRoleMutation,
    deleteRoleMutation,
    updatePrecedencesMutation,
    reorderPrecedenceMutation,
  };
};
