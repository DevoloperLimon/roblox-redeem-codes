import { Gamepad2, Search, TrendingUp, Star, Zap, Shield } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import GameCard from "@/components/cards/GameCard";
import type { Game, Category } from "@/lib/types";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, query, where } from "firebase/firestore";

export const metadata: Metadata = {
  title: "Roblox Redeem Codes 2025 – Free Working Codes",
  description:
    "Find all working Roblox redeem codes for 2025. Updated daily for Blox Fruits, Pet Simulator, Anime Adventures and 200+ Roblox games. 100% free.",
};

export const revalidate = 60;

export default async function HomePage() {
  let allGames: Game[] = [];
  let allCategories: Category[] = [];

  try {
    const qGames = query(collection(db, "games"), where("published", "==", true));
    const snapshotGames = await getDocs(qGames);
    
    if (!snapshotGames.empty) {
      allGames = snapshotGames.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Game[];
      
      // Sort by recency to avoid requiring composite indexes
      allGames.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
    }

    const qCats = query(collection(db, "categories"), where("published", "==", true));
    const snapshotCats = await getDocs(qCats);
    
    if (!snapshotCats.empty) {
      allCategories = snapshotCats.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      
      allCategories.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  } catch (error) {
    console.error("Error fetching homepage data:", error);
  }

  const featuredGames = allGames.filter((g) => g.featured || g.trending);

  const STATS = [
    { label: "Active Games", value: "200+", icon: Gamepad2 },
    { label: "Working Codes", value: "1,500+", icon: Zap },
    { label: "Verified Safe", value: "100%", icon: Shield },
    { label: "Daily Updates", value: "Every day", icon: TrendingUp },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 border border-primary/20">
            <Zap className="w-4 h-4 fill-current" />
            Updated Daily · 100% Free
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            <span className="gradient-text">Roblox Redeem Codes</span>
            <br />
            <span className="text-foreground">2025 – Free & Working</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Find verified, working redeem codes for 200+ Roblox games. Updated every day so you never miss a free reward.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/games"
              className="gradient-bg text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/25"
            >
              Browse All Games
            </Link>
            <Link
              href="/search"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base bg-card border border-border hover:bg-muted transition-colors"
            >
              <Search className="w-5 h-5" /> Search Codes
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 text-center">
                <div className="font-display font-bold text-2xl gradient-text">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl">Browse by Category</h2>
          <Link href="/categories" className="text-sm text-primary hover:underline font-medium">View all →</Link>
        </div>
        
        {allCategories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-2xl border border-border">
            <p>No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all group text-center"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-semibold text-foreground/80 group-hover:text-primary transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured & Trending */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Featured & Trending
          </h2>
          <Link href="/games" className="text-sm text-primary hover:underline font-medium">View all →</Link>
        </div>
        
        {featuredGames.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-2xl border border-border">
            <p>No featured games yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>

      {/* All Games */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-primary" />
            All Games
          </h2>
          <Link href="/games" className="text-sm text-primary hover:underline font-medium">View all →</Link>
        </div>
        
        {allGames.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-2xl border border-border">
            <p>No games published yet. Create one in the admin dashboard!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>

      {/* SEO Text Block */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="font-display font-bold text-xl mb-4">What are Roblox Redeem Codes?</h2>
          <div className="prose prose-sm text-muted-foreground space-y-3 leading-relaxed">
            <p>
              Roblox redeem codes are special promotional codes released by game developers and Roblox itself. When redeemed, these codes give players free in-game items like currency, skins, pets, boosts, and exclusive cosmetics — completely free of charge.
            </p>
            <p>
              Codes are typically shared during game milestones, developer streams, special events, or through official social media channels. They expire quickly, so bookmark this page and check back daily to never miss a free reward.
            </p>
            <p>
              <strong className="text-foreground">How to use codes:</strong> Open your Roblox game, find the codes/settings menu (usually a Twitter bird or gift icon), paste the code exactly as shown, and hit redeem. Our codes are always verified before publishing.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
