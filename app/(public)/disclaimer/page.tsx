import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Legal disclaimer regarding affiliation with Roblox Corporation.",
};

export default function DisclaimerPage() {
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
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
        
        <h1 className="text-3xl md:text-5xl font-display font-bold gradient-text mb-8 relative z-10">
          Disclaimer
        </h1>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed relative z-10 text-lg">
          <div className="bg-muted/30 border border-border/50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">No Affiliation with Roblox Corporation</h2>
            <p>
              The <strong>Roblox Redeem Code Platform</strong> is an independent, community-driven website and is <strong>not affiliated with, endorsed by, sponsored by, or specifically approved by Roblox Corporation</strong>.
            </p>
          </div>

          <p>
            "Roblox", the Roblox logo, and all related characters and elements are trademarks of and © Roblox Corporation. All other trademarks, service marks, and trade names used on this website are the property of their respective owners.
          </p>
          <p>
            The content provided on this website, including but not limited to promotional codes, guides, and game information, is intended for informational and educational purposes only. We aggregate publicly available codes shared by game developers on their official social media channels, Discord servers, and other public platforms.
          </p>
          <p>
            We do not sell codes, we do not require users to download malicious software to view codes, and we do not request any sensitive account information such as passwords. We strongly advise our users to never share their Roblox account passwords with anyone.
          </p>
          <p>
            If you are a representative of Roblox Corporation or any game developer and have concerns regarding the content on our website, please feel free to contact us so we can promptly address the issue.
          </p>
        </div>
      </div>
    </div>
  );
}
