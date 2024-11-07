// navLinks.js
export const NavLinks = [
  {
    pageName: "Dashboard",
    icon: "LayoutDashboard",
    label: "Dashboard",
    to: "/dashboard",
  },
  {
    pageName: "Users",
    icon: "UserRound",
    label: "Users",
    to: "/users/1",
  },
  {
    pageName: "Analytics",
    icon: "TrendingUp",
    label: "Analytics",
    to: "/analytics",
  },
  {
    pageName: "ClientList",
    icon: "ScrollText",
    label: "Client List",
    to: "/client-list/1",
  },
  {
    pageName: "Form",
    icon: "FileText",
    label: "Form",
    to: "/form",
  },
  {
    pageName: "Task",
    icon: "ClipboardList",
    label: "Task",
    to: "/task",
  },
  {
    pageName: "Reports",
    icon: "TriangleAlert",
    label: "Reports",
    to: "/reports",
  },
  {
    pageName: "Inventory",
    icon: "Inbox",
    label: "Inventory",
    to: "/inventory",
  },
  {
    pageName: "WebsitePages",
    icon: "Globe",
    label: "Pages",
    to: "/pages",
    notifications: "5",
  },
  {
    pageName: "Settings",
    icon: "Bolt",
    label: "Settings",
    to: "/settings",
  },
];

export const PermissionConfig = {
  Dashboard: {
    hasAccess: ["johnDoe", "janeSmith", "michaelBrown", "admin", "manager"],
    viewAccess: ["aliceGreen", "chrisWhite", "viewer", "support"],
    editAccess: ["johnDoe", "aliceGreen", "admin", "viewer"],
    deleteAccess: ["janeSmith", "manager"],
  },
  Users: {
    hasAccess: ["michaelBrown", "saraWilliams", "davidClark", "editor", "hr"],
    viewAccess: ["saraWilliams", "johnDoe", "hr", "admin"],
    editAccess: ["davidClark", "chrisWhite", "manager", "support"],
    deleteAccess: ["michaelBrown", "editor"],
  },
  Analytics: {
    hasAccess: [
      "emmaJohnson",
      "mikeDavis",
      "oliviaLee",
      "data_analyst",
      "manager",
    ],
    viewAccess: ["oliviaLee", "mikeDavis", "admin", "manager"],
    editAccess: ["emmaJohnson", "johnDoe", "data_analyst", "admin"],
    deleteAccess: ["mikeDavis", "manager"],
  },
  Settings: {
    hasAccess: [
      "lindaTaylor",
      "jasonMoore",
      "nancyWilson",
      "it_admin",
      "support",
    ],
    viewAccess: ["lindaTaylor", "jasonMoore", "it_admin", "support"],
    editAccess: ["nancyWilson", "emmaJohnson", "manager", "data_analyst"],
    deleteAccess: ["jasonMoore", "support"],
  },
};
