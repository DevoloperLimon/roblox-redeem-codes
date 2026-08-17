"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import type { Code } from "@/lib/types";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";

const StatusIcon = ({ status }: { status: Code["status"] }) => {
  if (status === "Working") return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (status === "Expired") return <XCircle className="w-4 h-4 text-red-500" />;
  return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
};

export default function AdminCodesPage() {
  const [codes, setCodes] = useState<(Code & { gameTitle?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "codes"));
        
        if (snapshot.empty) {
          setCodes([]);
          return;
        }

        const fetchedCodes = await Promise.all(snapshot.docs.map(async (docSnap) => {
          const codeData = docSnap.data() as Code;
          let gameTitle = "Unknown Game";
          
          if (codeData.gameId) {
            try {
              const gameDoc = await getDoc(doc(db, "games", codeData.gameId));
              if (gameDoc.exists()) {
                gameTitle = gameDoc.data().title;
              }
            } catch (e) {
              console.error("Error fetching game title:", e);
            }
          }
          
          return {
            ...codeData,
            id: docSnap.id,
            gameTitle,
          };
        }));
        
        // Sort in memory (newest first) to avoid requiring composite indexes
        fetchedCodes.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        
        setCodes(fetchedCodes);
      } catch (error) {
        console.error("Error fetching codes:", error);
        setCodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this code? This action cannot be undone.")) return;
    
    try {
      await deleteDoc(doc(db, "codes", id));
      setCodes(codes.filter((code) => code.id !== id));
      toast.success("Code deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting code:", error);
      toast.error(error.message || "Failed to delete code.");
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
        <p className="text-sm text-muted-foreground">{codes.length} codes total</p>
        <Link
          href="/admin/codes/new"
          className="gradient-bg text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Code
        </Link>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Code</th>
                <th className="text-left px-4 py-3.5 font-semibold text-muted-foreground hidden sm:table-cell">Game</th>
                <th className="text-left px-4 py-3.5 font-semibold text-muted-foreground hidden md:table-cell">Reward</th>
                <th className="text-left px-4 py-3.5 font-semibold text-muted-foreground">Status</th>
                <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {codes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    No codes found. Add a new code to get started.
                  </td>
                </tr>
              ) : (
                codes.map((code) => (
                  <tr key={code.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <code className="font-mono font-bold text-sm bg-muted px-2 py-0.5 rounded-md">{code.code}</code>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell text-muted-foreground">{code.gameTitle}</td>
                    <td className="px-4 py-4 hidden md:table-cell text-muted-foreground truncate max-w-[200px]">{code.reward}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon status={code.status} />
                        <span className={`text-xs font-semibold ${code.status === "Working" ? "text-green-600 dark:text-green-400" : code.status === "Expired" ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"}`}>
                          {code.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/codes/${code.id}/edit`} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(code.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
