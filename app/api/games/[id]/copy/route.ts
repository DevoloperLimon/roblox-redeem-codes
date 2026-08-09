import { NextResponse } from "next/server";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // TODO: Increment copy count in Firestore once Firebase is configured
  console.log(`Copy count increment for game: ${id}`);
  return NextResponse.json({ success: true });
}
