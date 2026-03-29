import { useState } from "react";
import { Search } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { EventCard } from "@/components/EventCard";
import { useStore } from "@/lib/store";

const tabs = ["Event types", "Single-use links", "Meeting polls"];

export default function Index() {
  const { eventTypes, deleteEventType } = useStore();

  const [activeTab, setActiveTab] = useState("Event types");
  const [search, setSearch] = useState("");

  // ✅ FIXED FILTER (no crash)
  const filteredEvents = eventTypes.filter((event) => {
    const name = event.name ?? "";
    const type = event.type ?? "";
    const platform = event.platform ?? "";

    const query = search.toLowerCase();

    return (
      name.toLowerCase().includes(query) ||
      type.toLowerCase().includes(query) ||
      platform.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Event Types" />

      <div className="px-8 py-6 flex-1">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-border mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-6 max-w-sm border border-border rounded-lg px-3 py-2 bg-background">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search event types"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-sm"
          />
        </div>

        {/* Event List */}
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={deleteEventType}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No events found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}