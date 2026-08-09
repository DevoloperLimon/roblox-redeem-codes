"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    icon: "🎮",
    description: "",
    order: 0,
    published: true,
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const docRef = doc(db, "categories", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setForm({
            name: data.name || "",
            slug: data.slug || "",
            icon: data.icon || "🎮",
            description: data.description || "",
            order: data.order || 0,
            published: data.published ?? true,
          });
        } else {
          toast.error("Category not found");
          router.push("/admin/categories");
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("Failed to fetch category");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchCategory();
    }
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const checked = (e.target as any).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const categoryData = {
        ...form,
        updatedAt: new Date().toISOString(),
      };
      
      await updateDoc(doc(db, "categories", id), categoryData);
      toast.success("Category updated successfully!");
      router.push("/admin/categories");
    } catch (error: any) {
      console.error("Error updating category:", error);
      toast.error(error.message || "Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Link href="/admin/categories" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Categories
      </Link>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <h2 className="font-display font-semibold text-base border-b border-border pb-3">Edit Category</h2>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">Name *</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Anime" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1.5">Slug *</label>
            <input id="slug" name="slug" value={form.slug} onChange={handleChange} required placeholder="e.g. anime" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
          </div>

          <div>
            <label htmlFor="icon" className="block text-sm font-medium mb-1.5">Icon (Emoji) *</label>
            <input id="icon" name="icon" value={form.icon} onChange={handleChange} required placeholder="e.g. ⚔️" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1.5">Description</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Brief description of this category..." className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="order" className="block text-sm font-medium mb-1.5">Order Priority</label>
              <input id="order" name="order" type="number" value={form.order} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
            </div>
            <div className="flex items-center pt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm font-medium">Published</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="gradient-bg text-white px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-60 transition-all shadow-sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Update Category"}
          </button>
          <Link href="/admin/categories" className="px-6 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-muted transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
