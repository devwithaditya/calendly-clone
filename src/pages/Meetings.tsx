import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { useStore } from "@/lib/store";
import { Video, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";

const tabs = ["Upcoming", "Past", "Cancelled"];

export default function Meetings() {
  const { bookings, cancelBooking } = useStore();
  const [activeTab, setActiveTab] = useState("Upcoming");

  const filtered = bookings.filter((b) => {
    if (activeTab === "Upcoming") return b.status === "upcoming";
    if (activeTab === "Past") return b.status === "past";
    return b.status === "cancelled";
  });

  const handleCancel = (id: string) => {
    cancelBooking(id);
    toast.success("Meeting cancelled.");
  };

  return (
    <>
      <TopNav title="Meetings" />
      <div className="flex-1 px-8 py-6 max-w-5xl">
        <div className="flex gap-6 border-b border-border mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No {activeTab.toLowerCase()} meetings.
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 border border-border rounded-xl bg-card animate-fade-in"
              >
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">{booking.eventName}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {booking.date} at {booking.time} • {booking.duration} min
                  </p>
                  <p className="text-sm text-muted-foreground">
                    with {booking.guestName} ({booking.guestEmail})
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Video className="h-3.5 w-3.5" />
                    {booking.platform}
                  </p>
                </div>
                {booking.status === "upcoming" && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors text-muted-foreground"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Cancel
                  </button>
                )}
                {booking.status === "cancelled" && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-destructive/10 text-destructive font-medium">
                    Cancelled
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}