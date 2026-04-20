"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  totalXp: number;
  currentStreak: number;
  cefrLevel: string;
}

interface AppShellProps {
  children: React.ReactNode;
  user: AppUser | null;
}

export function AppShell({ children, user }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} user={user} />
        <main className="flex-1 px-5 lg:px-8 py-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
