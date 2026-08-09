import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GameCard from "@/components/cards/GameCard";
import type { Game, Category } from "@/lib/types";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const q = query(collection(db, "categories"), where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    } as Category;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: "Category Not Found" };
  return {
    title: `${cat.name} Roblox Games – Working Codes 2025`,
    description: `Browse working redeem codes for all ${cat.name} Roblox games. Updated daily.`,
  };
}

export const revalidate = 60;

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  
  if (!cat) notFound();

  let games: Game[] = [];
  try {
    // We check both categoryId mapped to doc ID, or slug in case it was stored that way. 
    const gamesQ = query(collection(db, "games"), where("published", "==", true));
    const gamesSnapshot = await getDocs(gamesQ);
    games = gamesSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Game))
      .filter(game => game.categoryId === cat.id || game.categoryId === cat.slug);
      
  } catch (error) {
    console.error("Error fetching games for category:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/categories" className="hover:text-foreground transition-colors">Categories</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">{cat.name}</li>
        </ol>
      </nav>

      <div className="flex items-center gap-4 mb-8">
        <div className="text-5xl">{cat.icon}</div>
        <div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-1">{cat.name} Games</h1>
          {(cat as any).description && (
            <p className="text-muted-foreground">{(cat as any).description}</p>
          )}
        </div>
      </div>

      {games.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-2xl border border-border">
          <p>No games found in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
