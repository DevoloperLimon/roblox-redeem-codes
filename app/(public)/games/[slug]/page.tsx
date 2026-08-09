import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, CheckCircle, XCircle, ExternalLink, Gamepad2, ChevronLeft } from "lucide-react";
import CodeList from "@/components/common/CodeList";
import type { Game, Code } from "@/lib/types";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, query, where, limit, doc, getDoc } from "firebase/firestore";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getGameBySlug(slug: string): Promise<(Game & { codes?: Code[] }) | null> {
  try {
    // First try to find by slug
    const q = query(collection(db, "games"), where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    
    let docRef;
    if (!snapshot.empty) {
      docRef = snapshot.docs[0];
    } else {
      // Fallback: try to find by document ID
      const docSnap = await getDoc(doc(db, "games", slug));
      if (docSnap.exists()) {
        docRef = docSnap;
      } else {
        return null;
      }
    }
    
    // Fetch codes for this game
    const codesQuery = query(collection(db, "codes"), where("gameId", "==", docRef.id));
    const codesSnapshot = await getDocs(codesQuery);
    const codes = codesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Code[];

    return {
      id: docRef.id,
      ...docRef.data(),
      codes,
    } as Game & { codes?: Code[] };
  } catch (error) {
    console.error("Error fetching game by slug:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return { title: "Game Not Found" };
  return {
    title: game.seoTitle || `${game.title} Codes 2025`,
    description: game.seoDescription || game.shortDescription,
    openGraph: { title: game.seoTitle, description: game.seoDescription, images: game.gameImage ? [game.gameImage] : [] },
  };
}


export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  
  if (!game) notFound();

  const codes = game.codes || [];
  const working = codes.filter((c) => c.status === "Working");
  const expired = codes.filter((c) => c.status === "Expired");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/games" className="hover:text-foreground transition-colors">Games</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium truncate">{game.title}</li>
        </ol>
      </nav>

      {/* Banner */}
      <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden mb-8 bg-muted">
        {game.bannerImage ? (
          <Image src={game.bannerImage} alt={game.title} fill sizes="(max-width: 768px) 100vw, 896px" className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 gradient-bg flex items-center justify-center">
            <Gamepad2 className="w-16 h-16 text-white/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="font-display font-extrabold text-3xl text-white">{game.title}</h1>
          <div className="flex items-center gap-3 mt-1 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Updated {new Date((game.lastUpdated as string) || (game.createdAt as string) || new Date()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            {game.officialGameUrl && (
              <a href={game.officialGameUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> Play on Roblox
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Working Codes */}
      <section className="mb-8">
        <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Working Codes
          <span className="ml-auto text-sm font-normal text-muted-foreground">{working.length} codes</span>
        </h2>
        {working.length === 0 ? (
          <div className="text-center py-8 bg-muted rounded-2xl text-muted-foreground">No active codes right now. Check back soon!</div>
        ) : (
          <CodeList codes={working} gameId={game.id} status="Working" />
        )}
      </section>

      {/* Expired Codes */}
      {expired.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2 text-muted-foreground">
            <XCircle className="w-5 h-5" />
            Expired Codes
          </h2>
          <CodeList codes={expired} gameId={game.id} status="Expired" />
        </section>
      )}

      {/* Game Description */}
      {game.description && (
        <section className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="font-display font-bold text-lg mb-4">About {game.title}</h2>
          <div
            className="prose prose-sm max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: game.description }}
          />
        </section>
      )}

      {/* Back link */}
      <Link href="/games" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to all games
      </Link>
    </div>
  );
}
