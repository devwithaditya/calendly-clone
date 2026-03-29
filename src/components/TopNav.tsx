import { Plus, ChevronDown, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function TopNav({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between px-8 h-16 border-b border-border bg-card">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <UserPlus className="h-5 w-5" />
        </Button>
        <Link to="/create-event">
          <Button className="rounded-full gap-2 bg-blue-600 text-white">
            <Plus className="h-4 w-4" />
            Create
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </Button>
        </Link>
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold ml-1 bg-blue-600 text-white">
          A
        </div>
      </div>
    </header>
  );
}