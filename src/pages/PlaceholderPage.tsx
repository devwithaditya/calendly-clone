import { TopNav } from "@/components/TopNav";
import { Construction } from "lucide-react";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <>
      <TopNav title={title} />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Construction className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">This section is coming soon.</p>
        </div>
      </div>
    </>
  );
}