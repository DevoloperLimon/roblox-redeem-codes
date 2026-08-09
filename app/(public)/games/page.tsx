import type { Metadata } from "next";
import GameCard from "@/components/cards/GameCard";
import type { Game } from "@/lib/types";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, query, where } from "firebase/firestore";

export const metadata: Metadata = {
  title: "All Roblox Games – Codes & Rewards",
  description: "Browse redeem codes for all popular Roblox games. Working codes updated daily for Blox Fruits, Pet Simulator, Anime Adventures and more.",
};

export const revalidate = 60; // Optional: revalidate every 60 seconds

export default async function GamesPage() {
  let games: Game[] = [];

  try {
    const q = query(collection(db, "games"), where("published", "==", true));
    const snapshot = await getDocs(q);
    games = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Game[];
    
    // Sort in memory to avoid requiring a composite index in Firestore immediately
    games.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error fetching published games:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-3">All Roblox Games</h1>
        <p className="text-muted-foreground">
          Browse working redeem codes for all popular Roblox games. Codes are verified and updated daily.
        </p>
      </div>
      
      {games.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-2xl border border-border">
          <p>No published games found.</p>
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
