import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Availability() {
  const { availability, updateAvailability } = useStore();
  const [slots, setSlots] = useState(availability);

  const toggle = (idx: number) => {
    const updated = [...slots];
    updated[idx] = {
      ...updated[idx],
      enabled: !updated[idx].enabled,
    };
    setSlots(updated);
  };

  const updateTime = (
    idx: number,
    field: "start" | "end",
    value: string
  ) => {
    const updated = [...slots];
    updated[idx] = {
      ...updated[idx],
      [field]: value,
    };
    setSlots(updated);
  };

  const save = () => {
    updateAvailability(slots);
    toast.success("Availability saved!");
  };

  return (
    <>
      <TopNav title="Availability" />

      <div className="flex-1 px-8 py-6 max-w-3xl">
        <p className="text-muted-foreground text-sm mb-6">
          Set your weekly hours when you're available for meetings.
        </p>

        <div className="space-y-3">
          {slots.map((slot, idx) => (
            <div
              key={slot.day}
              className="flex items-center gap-4 p-4 border border-border rounded-xl bg-card animate-fade-in"
            >
              <label className="flex items-center gap-3 min-w-[140px]">
                <input
                  type="checkbox"
                  checked={slot.enabled}
                  onChange={() => toggle(idx)}
                  className="h-4 w-4 rounded border-border accent-primary"
                />

                
                <span
                  className={`text-sm font-medium ${
                    slot.enabled
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {slot.day}
                </span>
              </label>

              {slot.enabled ? (
                <div className="flex items-center gap-2 text-sm">
                  <input
                    type="time"
                    value={slot.start}
                    onChange={(e) =>
                      updateTime(idx, "start", e.target.value)
                    }
                    className="px-2 py-1.5 border border-border rounded-md bg-background text-foreground"
                  />

                  <span className="text-muted-foreground">to</span>

                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) =>
                      updateTime(idx, "end", e.target.value)
                    }
                    className="px-2 py-1.5 border border-border rounded-md bg-background text-foreground"
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Unavailable
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button onClick={save} className="rounded-full">
            Save changes
          </Button>
        </div>
      </div>
    </>
  );
}