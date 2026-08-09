"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CopyButtonProps {
  code: string;
  gameId?: string;
  isRevealed?: boolean;
  onCopyClick: () => void;
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

export default function CopyButton({ code, gameId, isRevealed = false, onCopyClick }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    if (isRevealed) {
      // Direct copy for revealed codes
      copyToClipboard(code).then((success) => {
        if (success) {
          setCopied(true);
          toast.success("Code Copied!");
          setTimeout(() => setCopied(false), 2000);
          
          // Increment copy count (fire and forget)
          if (gameId) {
            fetch(`/api/games/${gameId}/copy`, { method: "POST" }).catch(() => {});
          }
        } else {
          toast.error("Failed to copy code");
        }
      });
    } else {
      // Trigger parent handler for unrevealed codes
      onCopyClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Copy code ${code}`}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        copied
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-primary/10 text-primary hover:bg-primary/20"
      }`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
