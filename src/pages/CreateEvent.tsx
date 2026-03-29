import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopNav } from "@/components/TopNav";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const COLORS = [
  "hsl(220, 90%, 56%)",
  "hsl(142, 71%, 45%)",
  "hsl(280, 70%, 55%)",
  "hsl(25, 95%, 53%)",
  "hsl(340, 82%, 52%)",
  "hsl(190, 90%, 50%)",
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { addEventType } = useStore();
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(30);
  const [platform, setPlatform] = useState("Google Meet");
  const [color, setColor] = useState(COLORS[0]);

const handleCreate = () => {
  if (!name.trim()) {
    toast.error("Please enter an event name.");
    return;
  }



  addEventType({
    name,
    duration,
    platform,
    type: "One-on-One",
    availability: "Weekdays, 9 am - 5 pm",
    color,
     // ✅ ADD THIS
  });

  toast.success("Event type created!");
  navigate("/");
};

  return (
    <>
      <TopNav title="Create Event Type" />
      <div className="flex-1 px-8 py-6 max-w-xl">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Event name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 30 Minute Meeting"
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Duration (minutes)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>60 min</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Google Meet</option>
              <option>Zoom</option>
              <option>Microsoft Teams</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full border-2 transition-transform ${
                    color === c ? "border-foreground scale-110" : "border-transparent"
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleCreate} className="rounded-full">
              Create event
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => navigate("/")}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
      
    </>
  );
}