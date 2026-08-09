import type { Metadata } from "next";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, query, where } from "firebase/firestore";

export const metadata: Metadata = {
  title: "Roblox Game Categories – Browse by Genre",
  description: "Browse Roblox redeem codes by category: Anime, Simulator, Roleplay, Obby, Fighting, and more.",
};

export const revalidate = 60;

export default async function CategoriesPage() {
  let categories: (Category & { description?: string; gameCount?: number })[] = [];

  try {
    const q = query(collection(db, "categories"), where("published", "==", true));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      
      categories.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-3">Game Categories</h1>
        <p className="text-muted-foreground">Browse Roblox redeem codes by game genre. Find the perfect codes for your favourite type of game.</p>
      </div>
      
      {categories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-2xl border border-border">
          <p>No categories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="block bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:bg-primary/5 transition-all group card-hover"
            >
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h2 className="font-display font-bold text-lg mb-1 group-hover:text-primary transition-colors">{cat.name}</h2>
              {cat.description && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{cat.description}</p>
              )}
              <div className="flex items-center justify-end">
                <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">Browse →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
