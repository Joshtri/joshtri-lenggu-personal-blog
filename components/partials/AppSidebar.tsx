"use client";

import type React from "react";

import { ChevronDown, ChevronRight, LogOut, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { navByRole } from "@/config/navigation";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface NavGroupProps {
  group: NavGroup;
  isOpen: boolean;
  expandedGroups: Record<string, boolean>;
  toggleGroup: (title: string) => void;
}

interface SidebarHeaderProps {
  href: string;
  onClose?: () => void;
  onToggleSidebar?: () => void;
  isOpen?: boolean;
}

interface SidebarNavProps {
  groups: NavGroup[];
  isOpen: boolean;
  toggleGroup: (title: string) => void;
  expandedGroups: Record<string, boolean>;
}

interface SidebarFooterProps {
  role: "ADMIN" | "SUPERADMIN";
  isOpen: boolean;
}

interface AppSidebarProps {
  role: "ADMIN" | "SUPERADMIN";
  isOpen: boolean;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const NavGroup: React.FC<NavGroupProps> = ({
  group,
  isOpen,
  expandedGroups,
  toggleGroup,
}) => {
  const pathname = usePathname();
  const isGroupExpanded = expandedGroups[group.title];
  const isDashboard = group.title === "Dashboard";

  return (
    <div className="mb-4">
      {!isDashboard && (
        <button
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => toggleGroup(group.title)}
        >
          <span
            className={cn(
              "transition-opacity duration-200",
              isOpen ? "opacity-100" : "opacity-0"
            )}
          >
            {group.title}
          </span>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isGroupExpanded ? "rotate-180" : ""
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      )}

      <AnimatePresence>
        {(isDashboard || isGroupExpanded || !isOpen) && (
          <motion.div
            initial={!isDashboard ? { height: 0, opacity: 0 } : false}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-1 overflow-hidden"
          >
            {group.items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <motion.div
                  key={item.href}
                  whileHover={{ x: isOpen ? 4 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    asChild
                    className={cn(
                      "w-full justify-start h-10 px-3 transition-all duration-200",
                      isActive
                        ? "bg-black text-white font-medium border-r-2 border-primary"
                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",

                      !isOpen && "justify-center px-0"
                    )}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 w-full"
                    >
                      <span className="text-base flex-shrink-0">
                        {item.icon}
                      </span>
                      <span
                        className={cn(
                          "transition-all duration-200 truncate",
                          isOpen
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-2"
                        )}
                      >
                        {item.title}
                      </span>
                      {item.badge && isOpen && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  href,
  onClose,
  onToggleSidebar,
  isOpen = true,
}) => {
  return (
    <div className="border-b px-4 py-4 h-16 flex items-center justify-between">
      <Link href={href} className="flex items-center gap-3 group">
        <motion.div
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-xs"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          CMS
        </motion.div>
        <span
          className={cn(
            "font-bold text-lg transition-all duration-200 group-hover:text-primary",
            isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
          )}
        >
          Panel
        </span>
      </Link>

      <div className="flex items-center gap-2">
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="hidden md:flex h-8 w-8 hover:bg-muted"
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <motion.div
              animate={{ rotate: isOpen ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </Button>
        )}
      </div>
    </div>
  );
};

const SidebarNav: React.FC<SidebarNavProps> = ({
  groups,
  isOpen,
  toggleGroup,
  expandedGroups,
}) => {
  return (
    <nav className="px-3 py-4 space-y-2 flex-1 overflow-y-auto">
      {groups.map((group) => (
        <NavGroup
          key={group.title}
          group={group}
          isOpen={isOpen}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
        />
      ))}
    </nav>
  );
};

const SidebarFooter: React.FC<SidebarFooterProps> = ({ role, isOpen }) => {
  const base = role === "SUPERADMIN" ? "/superadmin" : "/admin";

  return (
    <div className="border-t p-3 space-y-2">
      <Button
        variant="ghost"
        asChild
        className={cn(
          "w-full transition-all duration-200",
          isOpen ? "justify-start" : "justify-center px-0"
        )}
      >
        <Link href={`${base}/settings`} className="flex items-center gap-3">
          <Settings className="h-4 w-4 flex-shrink-0" />
          <span
            className={cn(
              "transition-all duration-200",
              isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
            )}
          >
            Settings
          </span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        asChild
        className={cn(
          "w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200",
          isOpen ? "justify-start" : "justify-center px-0"
        )}
      >
        <Link href="/login" className="flex items-center gap-3">
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span
            className={cn(
              "transition-all duration-200",
              isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
            )}
          >
            Logout
          </span>
        </Link>
      </Button>
    </div>
  );
};

export const AppSidebar: React.FC<AppSidebarProps> = ({
  role,
  isOpen,
  onToggleSidebar,
  isMobile,
  onClose,
}) => {
  const navigationGroups = navByRole[role] || [];

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(navigationGroups.map((g) => [g.title, true]))
  );

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const baseHref = role === "SUPERADMIN" ? "/superadmin" : "/admin";

  // Mobile sidebar
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r bg-background shadow-xl md:hidden"
            >
              <SidebarHeader href={baseHref} onClose={onClose} />
              <SidebarNav
                groups={navigationGroups}
                isOpen={true}
                toggleGroup={toggleGroup}
                expandedGroups={expandedGroups}
              />
              <SidebarFooter role={role} isOpen={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop sidebar
  return (
    <motion.aside
      animate={{ width: isOpen ? 256 : 64 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 hidden md:flex md:flex-col border-r bg-background h-screen overflow-hidden z-30"
      style={{ position: "sticky", top: 0 }}
    >
      <SidebarHeader
        href={baseHref}
        onToggleSidebar={onToggleSidebar}
        isOpen={isOpen}
      />

      <div className="flex-1 overflow-y-auto">
        <SidebarNav
          groups={navigationGroups}
          isOpen={isOpen}
          toggleGroup={toggleGroup}
          expandedGroups={expandedGroups}
        />
      </div>

      <SidebarFooter role={role} isOpen={isOpen} />
    </motion.aside>
  );
};
