"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, TrendingUp, Star, Loader2 } from "lucide-react";
import type { Game } from "@/lib/types";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, orderBy, query, doc, deleteDoc, where, writeBatch } from "firebase/firestore";
import { toast } from "sonner";

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const q = query(collection(db, "games"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const fetchedGames = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        })) as Game[];
        setGames(fetchedGames);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this game? This will also delete all associated codes. This action cannot be undone.")) return;
    
    try {
      // First, query all codes associated with this game
      const codesQuery = query(collection(db, "codes"), where("gameId", "==", id));
      const codesSnapshot = await getDocs(codesQuery);
      
      // Create a batch for atomic deletion
      const batch = writeBatch(db);
      
      // Add all code deletions to the batch
      codesSnapshot.docs.forEach((codeDoc) => {
        batch.delete(codeDoc.ref);
      });
      
      // Add the game deletion to the batch
      batch.delete(doc(db, "games", id));
      
      // Commit the batch
      await batch.commit();
      
      // Update local state
      setGames(games.filter((game) => game.id !== id));
      
      const deletedCodesCount = codesSnapshot.size;
      toast.success(`Game and ${deletedCodesCount} associated code(s) deleted successfully.`);
    } catch (error: any) {
      console.error("Error deleting game:", error);
      toast.error(error.message || "Failed to delete game.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mt-1">{games.length} total games</p>
        </div>
        <Link
          href="/admin/games/new"
          className="gradient-bg text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Game
        </Link>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Game</th>
                <th className="text-left px-4 py-3.5 font-semibold text-muted-foreground hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3.5 font-semibold text-muted-foreground hidden md:table-cell">Views</th>
                <th className="text-left px-4 py-3.5 font-semibold text-muted-foreground hidden lg:table-cell">Copies</th>
                <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {games.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    No games found. Create one!
                  </td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-muted gradient-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {game.title?.[0] || "?"}
                        </div>
                        <div>
                          <div className="font-semibold flex items-center gap-1.5">
                            {game.title}
                            {game.featured && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                            {game.trending && <TrendingUp className="w-3 h-3 text-red-500" />}
                          </div>
                          <div className="text-xs text-muted-foreground">/games/{game.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${game.published ? "badge-working" : "badge-expired"}`}>
                        {game.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell text-muted-foreground">{game.viewCount?.toLocaleString() || 0}</td>
                    <td className="px-4 py-4 hidden lg:table-cell text-muted-foreground">{game.copyCount?.toLocaleString() || 0}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/games/${game.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="View public page">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/admin/games/${game.id}/edit`} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(game.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
