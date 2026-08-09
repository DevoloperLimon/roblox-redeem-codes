"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import GameCard from "@/components/cards/GameCard";
import type { Game } from "@/lib/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/games/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data: Game[] = await res.json();
          setResults(data);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-3">Search Games</h1>
      <p className="text-muted-foreground mb-8">Find working redeem codes for any Roblox game.</p>

      {/* Search Input */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          id="game-search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a game name, e.g. Blox Fruits..."
          autoFocus
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base shadow-sm"
        />
      </div>

      {/* Results */}
      {query.trim() === "" ? (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Start typing to search</p>
          <p className="text-sm mt-1">Search across all available Roblox games</p>
        </div>
      ) : loading ? (
        <div className="text-center py-16 text-muted-foreground">
          <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin opacity-50" />
          <p className="text-lg font-medium">Searching…</p>
        </div>
      ) : searched && results.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No games found for &ldquo;{query}&rdquo;</p>
          <p className="text-sm mt-1">Try a different game name</p>
        </div>
      ) : results.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-5">{results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {results.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
