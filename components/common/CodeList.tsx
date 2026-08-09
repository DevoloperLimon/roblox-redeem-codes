"use client";
import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import CopyButton from "./CopyButton";
import CodeDisplay from "./CodeDisplay";
import AdModal from "./AdModal";
import type { Code } from "@/lib/types";

interface CodeListProps {
  codes: Code[];
  gameId: string;
  status: "Working" | "Expired";
}

// Robust clipboard copy fallback function
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error("Copy failed:", err);
    return false;
  }
}

const StatusBadge = ({ status }: { status: Code["status"] }) => {
  const map: Record<Code["status"], { cls: string, icon: React.ReactNode, label: string }> = {
    Working: { cls: "badge-working", icon: <CheckCircle className="w-3.5 h-3.5" />, label: "Working" },
    Expired: { cls: "badge-expired", icon: <XCircle className="w-3.5 h-3.5" />, label: "Expired" },
    Upcoming: { cls: "badge-upcoming", icon: <XCircle className="w-3.5 h-3.5" />, label: "Upcoming" },
  };
  const { cls, icon, label } = map[status] || map["Working"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {icon} {label}
    </span>
  );
};

export default function CodeList({ codes, gameId, status }: CodeListProps) {
  const [revealedCodes, setRevealedCodes] = useState<Set<string>>(new Set());
  const [activeCodeToCopy, setActiveCodeToCopy] = useState<{ code: string; codeId: string } | null>(null);

  const handleCopyClick = (code: string, codeId: string) => {
    const isRevealed = revealedCodes.has(codeId);
    if (isRevealed) {
      // Direct copy for already revealed codes
      copyToClipboard(code).then((success) => {
        if (success) {
          // Increment copy count (fire and forget)
          if (gameId) {
            fetch(`/api/games/${gameId}/copy`, { method: "POST" }).catch(() => {});
          }
        }
      });
    } else {
      // Show modal for unrevealed codes
      setActiveCodeToCopy({ code, codeId });
    }
  };

  const handleCopyComplete = () => {
    if (activeCodeToCopy) {
      setRevealedCodes((prev) => new Set(prev).add(activeCodeToCopy.codeId));
      setActiveCodeToCopy(null);
    }
  };

  const handleModalClose = () => {
    setActiveCodeToCopy(null);
  };

  return (
    <>
      <div className="space-y-2">
        {codes.map((code) => {
          const isRevealed = revealedCodes.has(code.id);
          
          return (
            <div
              key={code.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                status === "Working"
                  ? "bg-card border border-border hover:border-primary/30"
                  : "bg-muted border border-border opacity-60"
              }`}
            >
              <CodeDisplay code={code.code} isRevealed={isRevealed} />
              <span className="text-sm text-muted-foreground hidden sm:block flex-shrink-0 max-w-xs truncate">
                {code.reward}
              </span>
              <StatusBadge status={code.status} />
              {status === "Working" && (
                <CopyButton
                  code={code.code}
                  gameId={gameId}
                  isRevealed={isRevealed}
                  onCopyClick={() => handleCopyClick(code.code, code.id)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Single shared modal */}
      {activeCodeToCopy && (
        <AdModal
          isOpen={!!activeCodeToCopy}
          onClose={handleModalClose}
          code={activeCodeToCopy.code}
          gameId={gameId}
          onCopyComplete={handleCopyComplete}
          countdownSeconds={3}
        />
      )}
    </>
  );
}
