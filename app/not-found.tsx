import Link from "next/link";
import { Gamepad2, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl gradient-bg shadow-2xl shadow-primary/25 mb-8">
          <Gamepad2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="font-display font-extrabold text-6xl gradient-text mb-4">404</h1>
        <h2 className="font-display font-bold text-2xl mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist. It may have been moved or the URL is incorrect.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="gradient-bg text-white px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link href="/search" className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 border border-border hover:bg-muted transition-colors">
            <Search className="w-4 h-4" /> Search Games
          </Link>
        </div>
      </div>
    </div>
  );
}
