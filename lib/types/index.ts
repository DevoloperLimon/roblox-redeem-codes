// Collection: admins
export interface AdminUser {
  id: string;                      // Firebase Auth UID
  name: string;
  email: string;
  photoURL?: string;
  role: 'SuperAdmin' | 'Admin' | 'Editor';
  status: 'Active' | 'Inactive';
  lastLogin: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Collection: categories
export interface Category {
  id: string;
  name: string;                    // e.g. "Anime"
  slug: string;                    // Unique, Indexed (e.g. "anime")
  description?: string;
  icon?: string;                   // Lucide Icon identifier
  image?: string;                  // WebP URL
  order: number;                   // Display priority
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Collection: games
export interface Game {
  id: string;
  title: string;                   // e.g. "Blox Fruits"
  slug: string;                    // Unique, Indexed (e.g. "blox-fruits")
  description: string;             // 300-500 words markdown/HTML content
  shortDescription: string;
  gameImage: string;               // 1:1 Aspect ratio (Thumbnail)
  bannerImage: string;             // 16:9 Aspect ratio (Header Banner)
  officialGameUrl?: string;        // Roblox link
  categoryId: string;              // Foreign Key -> categories.id
  published: boolean;
  featured: boolean;               // Featured status on homepage
  trending: boolean;               // Top Trending sorting
  viewCount: number;
  copyCount: number;
  lastUpdated: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

// Collection: codes
export interface Code {
  id: string;
  gameId: string;                  // Foreign Key -> games.id
  code: string;                    // e.g. "KITT_RESET"
  reward: string;                  // e.g. "Stat Reset"
  status: 'Working' | 'Expired' | 'Upcoming';
  expiryDate?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Collection: settings (Doc ID: "global")
export interface GlobalSettings {
  websiteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  contactEmail: string;
  footerText: string;
  socialLinks: {
    twitter?: string;
    discord?: string;
    youtube?: string;
  };
  maintenanceMode: boolean;
  googleAnalyticsId: string;
  adsenseId: string;
}

// Collection: ads
export interface AdPlacement {
  id: string;
  position: 'Header' | 'Sidebar' | 'Footer' | 'ArticleTop' | 'ArticleBottom' | 'MobileSticky';
  provider: 'AdSense' | 'Custom';
  enabled: boolean;
  script: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Collection: pages
export interface StaticPage {
  id: string;
  title: string;                   // e.g. "Privacy Policy"
  slug: string;                    // "privacy-policy", "about", "terms", "disclaimer"
  content: string;                 // Rich HTML Content
  updatedAt: Date | string;
}

// Collection: logs
export interface AuditLog {
  id: string;
  adminId: string;
  action: string;                  // e.g. "CODE_ADDED", "GAME_UPDATED"
  target: string;
  timestamp: Date | string;
  ipAddress?: string;
}
