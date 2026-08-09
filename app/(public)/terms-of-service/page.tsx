import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service and usage policies for the Roblox Redeem Code Platform.",
};

export default function TermsOfServicePage() {
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
          Terms of Service
        </h1>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed relative z-10">
          <p><em>Last Updated: {new Date().toLocaleDateString()}</em></p>
          
          <p>
            Welcome to the Roblox Redeem Code Platform. By accessing or using our website, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing this website, you are agreeing to be bound by these web site Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily view the materials (information or software) on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on the website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          <p>
            This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Disclaimer Regarding Codes</h2>
          <p>
            The redeem codes and promotional codes provided on this website are gathered from public sources, developer announcements, and community sharing. While we make every effort to ensure the accuracy and validity of the codes we publish:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We do not guarantee that any code will work for every user, as codes may expire, have usage limits, or be region-locked.</li>
            <li>We are not responsible for any issues arising in your game accounts related to the redemption of these codes.</li>
            <li>Codes are provided "as is" and their availability is solely determined by the game developers.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Limitations</h2>
          <p>
            In no event shall the Roblox Redeem Code Platform or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Revisions and Errata</h2>
          <p>
            The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Links</h2>
          <p>
            We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked web site is at the users own risk.
          </p>
        </div>
      </div>
    </div>
  );
}
