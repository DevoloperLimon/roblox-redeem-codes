"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditCodePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [games, setGames] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    gameId: "", code: "", reward: "", status: "Working" as "Working" | "Expired" | "Upcoming", expiryDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Games for Dropdown
        const gamesSnapshot = await getDocs(collection(db, "games"));
        if (!gamesSnapshot.empty) {
          const fetchedGames = gamesSnapshot.docs.map((d) => ({
            id: d.id,
            title: d.data().title || "Untitled Game",
          }));
          setGames(fetchedGames);
        }
        
        // Fetch specific Code details
        const codeSnapshot = await getDoc(doc(db, "codes", id));
        if (codeSnapshot.exists()) {
          const data = codeSnapshot.data();
          setForm({
            gameId: data.gameId || "",
            code: data.code || "",
            reward: data.reward || "",
            status: data.status || "Working",
            expiryDate: data.expiryDate || "",
          });
        } else {
          toast.error("Code not found");
          router.push("/admin/codes");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.gameId) {
      toast.error("Please select a game first.");
      return;
    }

    setSaving(true);
    try {
      const codeData = {
        ...form,
        updatedAt: new Date().toISOString(),
      };
      
      await updateDoc(doc(db, "codes", id), codeData);
      toast.success("Code updated successfully!");
      router.push("/admin/codes");
    } catch (error: any) {
      console.error("Error updating code:", error);
      toast.error(error.message || "Failed to update code");
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
      <Link href="/admin/codes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Codes
      </Link>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <h2 className="font-display font-semibold text-base border-b border-border pb-3">Edit Code</h2>

          <div>
            <label htmlFor="gameId" className="block text-sm font-medium mb-1.5">Game *</label>
            <select id="gameId" name="gameId" value={form.gameId} onChange={handleChange} required className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
              <option value="">Select a game...</option>
              {games.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium mb-1.5">Redeem Code *</label>
            <input id="code" name="code" value={form.code} onChange={handleChange} required placeholder="e.g. KITT_RESET" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono uppercase" />
          </div>

          <div>
            <label htmlFor="reward" className="block text-sm font-medium mb-1.5">Reward *</label>
            <input id="reward" name="reward" value={form.reward} onChange={handleChange} required placeholder="e.g. Stat Reset, 20min 2x XP Boost" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1.5">Status *</label>
              <select id="status" name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
                <option value="Working">Working</option>
                <option value="Expired">Expired</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium mb-1.5">Expiry Date</label>
              <input id="expiryDate" name="expiryDate" value={form.expiryDate} onChange={handleChange} type="date" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="gradient-bg text-white px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-60 transition-all shadow-sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Update Code"}
          </button>
          <Link href="/admin/codes" className="px-6 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-muted transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
