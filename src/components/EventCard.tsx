import React, { useState } from "react";
import { Copy, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { EventType } from "@/lib/store";

interface EventCardProps {
  event: EventType;
  onDelete?: (id: string) => void;
}

export function EventCard({ event, onDelete }: EventCardProps) {
  const [showMenu, setShowMenu] = useState(false);


  const bookingUrl = `${window.location.origin}/book/${event.slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div
      className="event-card group animate-fade-in relative"
      style={{ "--event-color": event.color } as React.CSSProperties}
    >
      {/* Left color bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
        style={{ background: event.color }}
      />

      <div className="flex items-start justify-between ml-3">
        {/* Event Info */}
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground">{event.name}</h3>

          <p className="text-sm text-muted-foreground">
            {event.duration} min • {event.platform} • {event.type}
          </p>

          <p className="text-sm text-muted-foreground">
            {event.availability}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-full hover:bg-muted transition-colors text-foreground"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy link
          </button>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                {/* View Page */}
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-foreground"
                  onClick={() => setShowMenu(false)}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View page
                </a>

                {/* Delete */}
                {onDelete && (
                  <button
                    onClick={() => {
                      onDelete(event.id);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-destructive w-full text-left"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}