"use client";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdBanner from "./AdBanner";

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  gameId?: string;
  onCopyComplete: () => void;
  countdownSeconds?: number;
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

export default function AdModal({
  isOpen,
  onClose,
  code,
  gameId,
  onCopyComplete,
}: AdModalProps) {
  // সময় এখানে ১৫ সেকেন্ড হার্ডকোড করে দেওয়া হয়েছে
  const totalSeconds = 5;
  const [countdown, setCountdown] = useState(totalSeconds);
  const [canCopy, setCanCopy] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (isOpen) {
      setCountdown(totalSeconds);
      setCanCopy(false);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanCopy(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  // Auto-copy when countdown finishes
  useEffect(() => {
    if (canCopy && isOpen) {
      copyToClipboard(code).then((success) => {
        if (success) {
          onCopyComplete();

          // Increment copy count (fire and forget)
          if (gameId) {
            fetch(`/api/games/${gameId}/copy`, { method: "POST" }).catch(() => { });
          }

          // Close modal after a short delay to show success
          setTimeout(() => {
            onClose();
          }, 500);
        }
      });
    }
  }, [canCopy, isOpen, code, gameId, onCopyComplete, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Copy Code</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {/* Countdown Timer */}
          {!canCopy ? (
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div
                  className="absolute inset-0 rounded-full border-4 border-primary transition-all duration-1000"
                  style={{
                    transform: `rotate(${(countdown / totalSeconds) * 360}deg)`,
                    borderTopColor: "transparent",
                    borderRightColor: "transparent",
                  }}
                />
                <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                  <Clock className="w-6 h-6" />
                  {countdown}
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Please wait while we prepare your code...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Code copied to clipboard!
              </p>
            </div>
          )}

          {/* Dynamic Ad Container */}
          <div className="w-full mt-4">
            <AdBanner />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}