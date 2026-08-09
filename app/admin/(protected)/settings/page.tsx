import { Construction } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Construction className="w-12 h-12 text-muted-foreground mb-4" />
      <h2 className="font-display font-bold text-xl mb-2">Settings</h2>
      <p className="text-muted-foreground text-sm max-w-xs">
        Site settings panel coming soon. Connect Firebase to enable global settings management.
      </p>
    </div>
  );
}
