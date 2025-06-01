"use client";

import { useState } from "react";
import AppHeader from "@/components/partials/AppHeader";
import { AppSidebar } from "@/components/partials/AppSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function SysLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader />

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar (Desktop) */}
        <AppSidebar
          role="ADMIN"
          isOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isMobile={false}
        />

        {/* Sidebar (Mobile) */}
        <AppSidebar
          role="ADMIN"
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          isMobile={true}
        />

        {/* Main Content */}
        <main className="flex-1 min-h-screen pt-16">
          <div className="p-6 lg:p-8">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mb-4"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Page Content Slot */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
