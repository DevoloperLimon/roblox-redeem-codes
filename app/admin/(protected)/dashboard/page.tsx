import Link from "next/link";
import { Gamepad2, Ticket, Tags, TrendingUp, Users, Copy, Eye, Plus } from "lucide-react";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, query, where } from "firebase/firestore";

async function getDashboardStats() {
  try {
    // Fetch total games
    const gamesSnapshot = await getDocs(collection(db, "games"));
    const totalGames = gamesSnapshot.size;

    // Fetch total codes
    const codesSnapshot = await getDocs(collection(db, "codes"));
    const totalCodes = codesSnapshot.size;

    // Fetch active codes (status == "Working")
    const activeCodesQuery = query(collection(db, "codes"), where("status", "==", "Working"));
    const activeCodesSnapshot = await getDocs(activeCodesQuery);
    const activeCodes = activeCodesSnapshot.size;

    // Fetch categories
    const categoriesSnapshot = await getDocs(collection(db, "categories"));
    const totalCategories = categoriesSnapshot.size;

    // Calculate total views from games
    let totalViews = 0;
    gamesSnapshot.forEach((doc) => {
      totalViews += doc.data().viewCount || 0;
    });

    return {
      totalGames,
      totalCodes,
      activeCodes,
      totalCategories,
      totalViews,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalGames: 0,
      totalCodes: 0,
      activeCodes: 0,
      totalCategories: 0,
      totalViews: 0,
    };
  }
}

const QUICK_ACTIONS = [
  { label: "Add New Game", icon: Plus, href: "/admin/games/new", description: "Publish a new game and its codes" },
  { label: "Add Code", icon: Ticket, href: "/admin/codes/new", description: "Add a redeem code to a game" },
  { label: "New Category", icon: Tags, href: "/admin/categories/new", description: "Create a new game category" },
  { label: "View Public Site", icon: TrendingUp, href: "/", description: "See the live public website" },
];

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const STATS = [
    { label: "Total Games", value: stats.totalGames.toString(), icon: Gamepad2, color: "text-blue-500", bg: "bg-blue-500/10", href: "/admin/games" },
    { label: "Active Codes", value: stats.activeCodes.toString(), icon: Ticket, color: "text-green-500", bg: "bg-green-500/10", href: "/admin/codes" },
    { label: "Categories", value: stats.totalCategories.toString(), icon: Tags, color: "text-purple-500", bg: "bg-purple-500/10", href: "/admin/categories" },
    { label: "Total Views", value: stats.totalViews.toString(), icon: Eye, color: "text-orange-500", bg: "bg-orange-500/10", href: "#" },
  ];
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="font-display font-bold text-2xl">Welcome back 👋</h2>
        <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-colors group"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="font-display font-bold text-2xl">{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-0.5 group-hover:text-foreground transition-colors">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-display font-semibold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <action.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="font-semibold text-sm group-hover:text-primary transition-colors">{action.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{action.description}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-6">
        <h3 className="font-display font-bold text-lg mb-2">Getting Started</h3>
        <p className="text-sm text-muted-foreground mb-4">Follow these steps to launch your platform:</p>
        <ol className="space-y-2 text-sm">
          {[
            { step: "1", text: "Set your Firebase env vars in .env.local", done: false },
            { step: "2", text: "Create your first admin user in Firebase Auth", done: false },
            { step: "3", text: "Add game categories", done: false },
            { step: "4", text: "Publish your first game and codes", done: false },
            { step: "5", text: "Deploy to Vercel", done: false },
          ].map((item) => (
            <li key={item.step} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full border-2 border-primary/40 text-xs flex items-center justify-center text-primary font-bold flex-shrink-0">{item.step}</span>
              <span className="text-foreground/80">{item.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
