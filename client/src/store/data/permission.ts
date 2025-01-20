import { Permission } from "../role";

export const AdminPermissions: Permission[] = [
  {
    page: "Dashboard",
    actions: ["view"],
  },
  {
    page: "Users",
    actions: [
      "view",
      "view-password",
      "create-user",
      "lock-user",
      "view-details",
    ],
  },
];

export const DefaultPermissions: Permission[] = [
  {
    page: "Dashboard",
    actions: ["view"],
  },
];

interface PermissionAction {
  value: string;
  label: string;
}

interface AvailablePermissionPage {
  page: string;
  pageLabel: string;
  actions: PermissionAction[];
}

export const availablePermissionPages: AvailablePermissionPage[] = [
  {
    page: "Dashboard",
    pageLabel: "Dashboard Sections",
    actions: [{ value: "view-dashboard", label: "View Dashboard" }],
  },
  {
    page: "Users",
    pageLabel: "Users Sections",
    actions: [
      { value: "view-users", label: "View Users" },
      { value: "view-password", label: "View user password" },
      { value: "create-user", label: "Create new users" },
      { value: "lock-user", label: "Lock users" },
      { value: "view-details", label: "View user details" },
    ],
  },
];
