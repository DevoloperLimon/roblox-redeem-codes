import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about the Roblox Redeem Code Platform.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors bg-muted/50 px-4 py-2 rounded-lg"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Home
      </Link>

      <div className="glass rounded-3xl p-8 md:p-12 border border-border/50 shadow-xl relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
        
        <h1 className="text-3xl md:text-5xl font-display font-bold gradient-text mb-8 relative z-10">
          About Us
        </h1>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed relative z-10 text-lg">
          <p>
            Welcome to the <strong>Roblox Redeem Code Platform</strong>, your premier destination for the most up-to-date and reliable Roblox redeem codes, game promo codes, and comprehensive guides for Roblox players worldwide.
          </p>
          <p>
            Our mission is simple: to help you enhance your Roblox experience by providing verified codes that unlock exclusive in-game items, currency, and rewards across hundreds of popular Roblox games. Whether you are battling in Blox Fruits, collecting pets in Pet Simulator, or defending towers in Anime Adventures, we have got you covered.
          </p>
          <p>
            We understand the frustration of finding expired or fake codes. That is why our dedicated team works tirelessly to scour the internet, test each code manually, and update our database daily. We strive to create a trusted community resource where players can quickly find working codes without the hassle.
          </p>
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Why Choose Us?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Daily Updates:</strong> We constantly monitor game updates, developer social media, and community forums to bring you the newest codes as soon as they are released.</li>
            <li><strong>Verified Working:</strong> Every code is tested before it is published on our platform.</li>
            <li><strong>Extensive Coverage:</strong> From massive hits to rising stars, we track codes for a vast array of Roblox experiences.</li>
            <li><strong>User-Friendly Design:</strong> Our sleek, modern interface makes finding and copying codes incredibly easy.</li>
          </ul>
          <p className="mt-8">
            Thank you for choosing the Roblox Redeem Code Platform. We are excited to be part of your gaming journey!
          </p>
        </div>
      </div>
    </div>
  );
}
