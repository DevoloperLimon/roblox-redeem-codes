"use client";

import Link from "next/link";
import { Gamepad2, Share2, Video, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function Footer() {
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title || "Roblox Redeem Codes",
          url: url,
        });
      } catch (err) {
        // Ignore abort errors (user closed share sheet)
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="gradient-bg w-9 h-9 rounded-xl flex items-center justify-center shadow">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg gradient-text">RobloxRedeemCodes</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Your #1 source for free, working Roblox redeem codes. Updated daily for 200+ popular Roblox games.
            </p>
            <div className="flex gap-3 mt-4">
              <button onClick={handleShare} aria-label="Share" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <a href="https://t.me/theanmking" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors">
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display font-semibold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/games", label: "All Games" },
                { href: "/categories", label: "Categories" },
                { href: "/search", label: "Search" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms-of-service", label: "Terms of Service" },
                { href: "/disclaimer", label: "Disclaimer" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} RobloxRedeemCodes.com. All rights reserved.</p>
          <p>Not affiliated with Roblox Corporation.</p>
        </div>
      </div>
    </footer>
  );
}