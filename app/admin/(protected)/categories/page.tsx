"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import type { Category } from "@/lib/types";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, "categories"));
        const fetched = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        })) as Category[];
        
        // Sort by order to avoid composite index requirements
        fetched.sort((a, b) => (a.order || 0) - (b.order || 0));
        
        setCategories(fetched);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      await deleteDoc(doc(db, "categories", id));
      setCategories(categories.filter((cat) => cat.id !== id));
      toast.success("Category deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error(error.message || "Failed to delete category.");
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{categories.length} categories</p>
        <Link href="/admin/categories/new" className="gradient-bg text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 shadow-sm">
          <Plus className="w-4 h-4" /> New Category
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/30 rounded-2xl border border-border">
            No categories found. Create one!
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cat.icon}</span>
                  <div>
                    <div className="font-semibold">{cat.name}</div>
                    <div className="text-xs text-muted-foreground">/{cat.slug}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cat.published ? "badge-working" : "badge-expired"}`}>
                  {cat.published ? "Published" : "Hidden"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground border-t border-border pt-3 flex items-center justify-between">
                <span>Order: {cat.order}</span>
                <div className="flex items-center gap-1">
                  <Link href={`/admin/categories/${cat.id}/edit`} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Edit">
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
