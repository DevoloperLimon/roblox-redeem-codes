import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and data collection practices for the Roblox Redeem Code Platform.",
};

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed relative z-10">
          <p><em>Last Updated: {new Date().toLocaleDateString()}</em></p>
          
          <p>
            At the Roblox Redeem Code Platform, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by us and how we use it.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <p>
            If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect in various ways, including to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you for customer service, to provide you with updates and other information relating to the website</li>
            <li>Find and prevent fraud</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Log Files</h2>
          <p>
            We follow a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Cookies and Web Beacons</h2>
          <p>
            Like any other website, we use "cookies". These cookies are used to store information including visitors preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users experience by customizing our web page content based on visitors browser type and/or other information.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Google DoubleClick DART Cookie</h2>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" className="text-primary hover:underline">https://policies.google.com/technologies/ads</a>
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Advertising Partners Privacy Policies</h2>
          <p>
            Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on our site, which are sent directly to users browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>
          <p>
            Note that we have no access to or control over these cookies that are used by third-party advertisers.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Third Party Privacy Policies</h2>
          <p>
            Our Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.
          </p>
        </div>
      </div>
    </div>
  );
}
