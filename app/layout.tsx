import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://robloxredeemcodes.com"),
  title: {
    default: "Roblox Redeem Codes 2025 – Free Working Codes",
    template: "%s | RobloxRedeemCodes.com",
  },
  description:
    "Find all working Roblox redeem codes for 2025. Updated daily with free codes for Blox Fruits, Pet Simulator, Anime Adventures and 200+ Roblox games.",
  keywords: ["roblox codes", "roblox redeem codes", "free roblox codes", "blox fruits codes", "roblox promo codes"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "RobloxRedeemCodes.com",
    title: "Roblox Redeem Codes 2025 – Free Working Codes",
    description:
      "Find all working Roblox redeem codes for 2025. Updated daily with codes for 200+ Roblox games.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
