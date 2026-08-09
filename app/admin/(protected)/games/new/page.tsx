"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import { collection, addDoc, getDocs } from "firebase/firestore";
import type { Category } from "@/lib/types";

export default function NewGamePage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, "categories"));
        const cats = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
        cats.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", shortDescription: "", description: "",
    gameImage: "", bannerImage: "", officialGameUrl: "",
    categoryId: "", published: false, featured: false, trending: false,
    seoTitle: "", seoDescription: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setForm((prev) => ({ ...prev, title, slug }));
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const gameData = {
        ...form,
        viewCount: 0,
        copyCount: 0,
        createdAt: now,
        updatedAt: now,
        lastUpdated: now,
        seoKeywords: [],
      };
      
      await addDoc(collection(db, "games"), gameData);
      toast.success("Game saved successfully!");
      router.push("/admin/games");
    } catch (error: any) {
      console.error("Error saving game:", error);
      toast.error(error.message || "Failed to save game");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/admin/games" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Games
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <h2 className="font-display font-semibold text-base border-b border-border pb-3">Basic Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1.5">Game Title *</label>
              <input id="title" name="title" value={form.title} onChange={handleTitleChange} required placeholder="e.g. Blox Fruits" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-1.5">Slug *</label>
              <input id="slug" name="slug" value={form.slug} onChange={handleChange} required placeholder="blox-fruits" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono" />
            </div>
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium mb-1.5">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            >
              <option value="">— Select a category —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon ? `${cat.icon} ` : ""}{cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="shortDescription" className="block text-sm font-medium mb-1.5">Short Description * (max 160 chars)</label>
            <input id="shortDescription" name="shortDescription" value={form.shortDescription} onChange={handleChange} required maxLength={160} placeholder="Brief description for search results and cards" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
            <p className="text-xs text-muted-foreground mt-1">{form.shortDescription.length}/160</p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1.5">Full Description</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={6} placeholder="HTML content for the game detail page..." className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none font-mono text-xs" />
          </div>
        </div>

        {/* Media */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-base border-b border-border pb-3">Media</h2>
          <div>
            <label htmlFor="gameImage" className="block text-sm font-medium mb-1.5">Game Thumbnail URL</label>
            <input id="gameImage" name="gameImage" value={form.gameImage} onChange={handleChange} type="url" placeholder="https://..." className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
          </div>
          <div>
            <label htmlFor="bannerImage" className="block text-sm font-medium mb-1.5">Banner Image URL</label>
            <input id="bannerImage" name="bannerImage" value={form.bannerImage} onChange={handleChange} type="url" placeholder="https://..." className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
          </div>
          <div>
            <label htmlFor="officialGameUrl" className="block text-sm font-medium mb-1.5">Official Roblox Game URL</label>
            <input id="officialGameUrl" name="officialGameUrl" value={form.officialGameUrl} onChange={handleChange} type="url" placeholder="https://www.roblox.com/games/..." className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-base border-b border-border pb-3">Visibility & Flags</h2>
          <div className="flex flex-col gap-3">
            {[
              { name: "published", label: "Published", description: "Visible on the public site" },
              { name: "featured", label: "Featured", description: "Show in Featured section on homepage" },
              { name: "trending", label: "Trending", description: "Show in Trending section" },
            ].map((opt) => (
              <label key={opt.name} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name={opt.name}
                  checked={form[opt.name as keyof typeof form] as boolean}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-primary"
                />
                <div>
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div className="text-xs text-muted-foreground">{opt.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* SEO */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-base border-b border-border pb-3">SEO</h2>
          <div>
            <label htmlFor="seoTitle" className="block text-sm font-medium mb-1.5">SEO Title</label>
            <input id="seoTitle" name="seoTitle" value={form.seoTitle} onChange={handleChange} placeholder="Blox Fruits Codes 2025 – Working & Free" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
          </div>
          <div>
            <label htmlFor="seoDescription" className="block text-sm font-medium mb-1.5">Meta Description</label>
            <textarea id="seoDescription" name="seoDescription" value={form.seoDescription} onChange={handleChange} rows={3} placeholder="All working Blox Fruits codes for July 2025..." className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none" />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="gradient-bg text-white px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-60 transition-all shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Game"}
          </button>
          <Link href="/admin/games" className="px-6 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-muted transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
