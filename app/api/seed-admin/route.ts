import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

/**
 * ONE-TIME seed route to create the admin user in Firebase Authentication.
 *
 * Usage:
 *   1. Make sure your dev server is running (`npm run dev`).
 *   2. Visit  http://localhost:3000/api/seed-admin  in your browser (GET request).
 *   3. The admin user will be created (or updated if it already exists).
 *   4. DELETE this file after use — it should NOT be deployed to production.
 */

const ADMIN_EMAIL = "mdlimonking10@gmail.com";
const ADMIN_PASSWORD = "mdlimonpass1";

export async function GET() {
  try {
    let uid: string;

    try {
      // Check if the user already exists
      const existingUser = await adminAuth.getUserByEmail(ADMIN_EMAIL);
      uid = existingUser.uid;

      // Update the password in case it was different
      await adminAuth.updateUser(uid, { password: ADMIN_PASSWORD });

      console.log(`✅ Existing user found (${uid}). Password updated.`);
    } catch {
      // User does not exist — create them
      const newUser = await adminAuth.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        emailVerified: true,
        displayName: "Admin",
      });
      uid = newUser.uid;

      console.log(`✅ New admin user created (${uid}).`);
    }

    // Set custom claims so the account is recognized as an admin
    await adminAuth.setCustomUserClaims(uid, { admin: true, role: "admin" });

    console.log("✅ Custom admin claims set.");

    return NextResponse.json(
      {
        status: "success",
        message: `Admin user ready (${uid}). You can now log in. DELETE this route before deploying!`,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("❌ Seed admin error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
