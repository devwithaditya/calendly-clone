import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  Users,
  Clock,
  Contact,
  GitBranch,
  Puzzle,
  BarChart3,
  Settings,
  HelpCircle,
  Plus,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

const mainNav = [
  { label: "Scheduling", icon: Calendar, path: "/" },
  { label: "Meetings", icon: Users, path: "/meetings" },
  { label: "Availability", icon: Clock, path: "/availability" },
  { label: "Contacts", icon: Contact, path: "/contacts" },
  { label: "Workflows", icon: GitBranch, path: "/workflows" },
  { label: "Integrations", icon: Puzzle, path: "/integrations" },
];

const bottomNav = [
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Admin center", icon: Settings, path: "/admin" },
  { label: "Help", icon: HelpCircle, path: "/help" },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col border-r border-border bg-card h-screen sticky top-0 transition-all duration-200 ${
        collapsed ? "w-16" : "w-260px"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-border">
        {!collapsed && (
          <span className="text-xl font-bold text-primary tracking-tight  text-blue-600">
            Calendly
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Create button */}
      <div className="px-3 py-3">
        <Link
          to="/create-event"
          className={`flex items-center justify-center gap-2 rounded-full border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors ${
            collapsed ? "px-2.5" : "px-4"
          }`}
        >
          <Plus className="h-4 w-4" />
          {!collapsed && "Create"}
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {mainNav.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${active ? "active" : ""}`}
            >
              <item.icon className="h-18px w-18px shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 pb-4 space-y-0.5">
        {bottomNav.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${active ? "active" : ""}`}
            >
              <item.icon className="h-18px w-18px shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}