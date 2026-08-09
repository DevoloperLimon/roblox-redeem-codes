"use client";
import { Lock } from "lucide-react";

interface CodeDisplayProps {
  code: string;
  isRevealed: boolean;
}

export default function CodeDisplay({ code, isRevealed }: CodeDisplayProps) {
  const obscuredCode = "••••••••";

  return (
    <div className="relative flex-1 min-w-0">
      {isRevealed ? (
        <code className="font-mono font-bold text-base text-foreground truncate block">
          {code}
        </code>
      ) : (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border-2 border-dashed border-border rounded-lg">
          <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <code className="font-mono text-sm text-muted-foreground truncate">
            {obscuredCode}
          </code>
        </div>
      )}
    </div>
  );
}
