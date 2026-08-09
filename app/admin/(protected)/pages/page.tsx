import { Construction } from "lucide-react";

export default function AdminPagesPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Construction className="w-12 h-12 text-muted-foreground mb-4" />
      <h2 className="font-display font-bold text-xl mb-2">Static Pages</h2>
      <p className="text-muted-foreground text-sm max-w-xs">
        Manage Privacy Policy, Terms, About, and Disclaimer pages once Firebase is connected.
      </p>
    </div>
  );
}
