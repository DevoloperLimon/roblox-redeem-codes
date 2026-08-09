import { Construction } from "lucide-react";

export default function AdminAdsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Construction className="w-12 h-12 text-muted-foreground mb-4" />
      <h2 className="font-display font-bold text-xl mb-2">Ad Management</h2>
      <p className="text-muted-foreground text-sm max-w-xs">
        Manage your AdSense and custom ad placements once Firebase is connected.
      </p>
    </div>
  );
}
