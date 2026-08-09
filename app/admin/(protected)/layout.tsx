"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Gamepad2, Ticket, Tags, FileText,
  Settings, Megaphone, Users, Menu, X, LogOut, ChevronRight,
} from "lucide-react";
import { Toaster } from "sonner";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/games", label: "Games", icon: Gamepad2 },
  { href: "/admin/codes", label: "Codes", icon: Ticket },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/ads", label: "Ads", icon: Megaphone },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border flex-shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-display font-bold text-base">
          <div className="gradient-bg w-8 h-8 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">RRC Admin</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-md lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "gradient-bg text-white shadow-sm shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Link href="/" target="_blank" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3">
          <Gamepad2 className="w-3.5 h-3.5" /> View Public Site
        </Link>
        <button className="flex items-center gap-2 text-xs text-destructive hover:text-destructive/80 transition-colors w-full">
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </div>
  );
}

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const currentPage = NAV_ITEMS.find((n) => n.href === pathname || (n.href !== "/admin/dashboard" && pathname.startsWith(n.href)))?.label ?? "Dashboard";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 flex-col flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card flex items-center px-4 sm:px-6 gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-display font-semibold text-lg">{currentPage}</h1>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">A</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
