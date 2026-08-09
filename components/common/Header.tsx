import Link from "next/link";
import { Gamepad2, Search, Menu, X } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="gradient-bg w-9 h-9 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-800 text-lg hidden sm:block">
              <span className="gradient-text">RRC</span>
              <span className="text-foreground text-sm font-medium ml-1 opacity-80">Codes</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              Home
            </Link>
            <Link href="/games" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              All Games
            </Link>
            <Link href="/categories" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              Categories
            </Link>
          </nav>

          {/* Search */}
          <Link
            href="/search"
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg border border-border transition-colors flex-shrink-0 md:w-48"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:block">Search games...</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
