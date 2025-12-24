
import { MdNotifications, MdSettings, MdAnalytics } from "react-icons/md";
import { FaUsers, FaClipboardList, FaBook, FaShieldAlt, FaHistory } from "react-icons/fa";

export const sidebarLinks = [
  { name: "Analytics", path: "/", icon: <MdAnalytics /> },
  { name: "User Management", path: "/user-management", icon: <FaUsers /> },
  { name: "Questionnaires", path: "/questionnaires", icon: <FaClipboardList /> },
  { name: "Content Management", path: "/content-management", icon: <FaBook /> },

  { name: "Notifications", path: "/notifications", icon: <MdNotifications /> },
  { name: "Access Control", path: "/access-control", icon: <FaShieldAlt /> },
  { name: "Admin Logs", path: "/admin-logs", icon: <FaHistory /> },
  { name: "Settings", path: "/settings", icon: <MdSettings /> },
];

export const transactionsReports = [
  { id: 1, user: "Alice", amount: "$200", status: "Completed", date: "2025-07-20" },
  { id: 2, user: "Bob", amount: "$150", status: "Pending", date: "2025-07-19" },
  { id: 3, user: "John", amount: "$300", status: "Completed", date: "2025-07-18" },
];

export const reportsData = [
  { id: 1, heading: "Total Payments", amount: "$200", },
  { id: 2, heading: "Total Users", amount: "$150" },
  { id: 3, heading: "Avg. Transaction", amount: "$300" },
]