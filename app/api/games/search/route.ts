import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim().toLowerCase();

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    // Fetch all published games and filter on the server.
    // Firestore doesn't support native substring / case-insensitive search,
    // so we pull the published set and filter in-memory. For small-to-medium
    // catalogues this is perfectly fine and avoids third-party search services.
    const snapshot = await adminDb
      .collection("games")
      .where("published", "==", true)
      .get();

    const results = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((game: any) => {
        const title = (game.title || "").toLowerCase();
        const shortDesc = (game.shortDescription || "").toLowerCase();
        return title.includes(q) || shortDesc.includes(q);
      });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search games" },
      { status: 500 }
    );
  }
}
