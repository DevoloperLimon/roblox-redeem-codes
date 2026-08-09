import Link from "next/link";
import Image from "next/image";
import { Gamepad2, TrendingUp, Star, Clock } from "lucide-react";
import type { Game } from "@/lib/types";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.slug}`} className="block group card-hover">
      <article className="bg-card border border-border rounded-2xl overflow-hidden h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          {game.gameImage ? (
            <Image
              src={game.gameImage}
              alt={game.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 gradient-bg flex items-center justify-center">
              <Gamepad2 className="w-12 h-12 text-white/60" />
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            {game.featured && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/90 text-yellow-900 text-xs font-semibold backdrop-blur-sm">
                <Star className="w-3 h-3 fill-current" /> Featured
              </span>
            )}
            {game.trending && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/90 text-white text-xs font-semibold backdrop-blur-sm">
                <TrendingUp className="w-3 h-3" /> Trending
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          <h3 className="font-display font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-1">
            {game.title}
          </h3>
          {game.shortDescription && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
              {game.shortDescription}
            </p>
          )}
          <div className="flex items-center justify-between mt-auto pt-2 text-xs text-muted-foreground border-t border-border">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Updated{" "}
              {game.lastUpdated
                ? new Date(game.lastUpdated as string).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "recently"}
            </span>
            <span className="text-primary font-semibold text-sm">View Codes →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
