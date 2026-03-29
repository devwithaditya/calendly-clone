import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "@/lib/store";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Monitor,
  Check,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isBefore,
  startOfToday,
} from "date-fns";

const TIME_SLOTS = [
  "9:00 AM","9:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","12:00 PM","12:30 PM",
  "1:00 PM","1:30 PM","2:00 PM","2:30 PM",
  "3:00 PM","3:30 PM","4:00 PM","4:30 PM",
];

const WEEKDAYS = ["MON","TUE","WED","THU","FRI","SAT","SUN"];

function getMondayStartDay(date: Date) {
  const d = getDay(startOfMonth(date));
  return d === 0 ? 6 : d - 1;
}

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const { eventTypes, addBooking, availability } = useStore();

  const event = eventTypes.find((e) => e.slug === slug);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<"calendar" | "form" | "confirmed">("calendar");

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const today = startOfToday();

  const days = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    });
  }, [currentMonth]);

  const emptySlots = getMondayStartDay(currentMonth);

  const enabledDays = availability
    .filter((a) => a.enabled)
    .map((a) => a.day);

  const isDayAvailable = (date: Date) => {
    if (isBefore(date, today)) return false;
    return enabledDays.includes(format(date, "EEEE"));
  };

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (!event) return <div className="p-10">Event not found</div>;

  const handleConfirm = () => {
    if (!guestName.trim() || !guestEmail.trim()) {
      toast.error("Fill all fields");
      return;
    }

    if (!selectedDate || !selectedTime) return;

    addBooking({
      eventTypeId: event.id,
      eventName: event.name,
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      guestName,
      guestEmail,
      status: "upcoming",
      platform: event.platform,
      duration: event.duration,
    });

    setStep("confirmed");
  };

  // ✅ CONFIRM SCREEN
  if (step === "confirmed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-lg text-center shadow">
          <Check className="mx-auto mb-3 text-green-500" />
          <h1 className="text-xl font-bold">Confirmed!</h1>
          <p>{event.name} booked successfully</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow flex overflow-hidden">

        {/* LEFT */}
        <div className="w-[300px] p-6 border-r space-y-4">
          <h2 className="text-xl font-bold">{event.name}</h2>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            {event.duration} min
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Monitor className="h-4 w-4" />
            Online meeting
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 p-6">
          {step === "calendar" && (
            <>
              <h3 className="font-bold mb-4">Select a Date & Time</h3>

              <div className="flex gap-6">

                {/* CALENDAR */}
                <div>
                  <div className="flex justify-between mb-3">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                      <ChevronLeft />
                    </button>

                    <span>{format(currentMonth, "MMMM yyyy")}</span>

                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                      <ChevronRight />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 text-xs text-center mb-2">
                    {WEEKDAYS.map((d) => <div key={d}>{d}</div>)}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: emptySlots }).map((_, i) => (
                      <div key={i} />
                    ))}

                    {days.map((day) => {
                      const available = isDayAvailable(day);
                      const selected = selectedDate && isSameDay(day, selectedDate);

                      return (
                        <button
                          key={day.toISOString()}
                          disabled={!available}
                          onClick={() => {
                            setSelectedDate(day);
                            setSelectedTime(null);
                          }}
                          className={`h-10 w-10 rounded-full ${
                            selected
                              ? "bg-blue-600 text-white"
                              : available
                              ? "hover:bg-blue-100"
                              : "text-gray-300"
                          }`}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-4 text-xs text-gray-500 flex items-center gap-1">
                    <Globe className="h-3 w-3" /> {timezone}
                  </p>
                </div>

                {/* TIME */}
                {selectedDate && (
                  <div className="flex-1">
                    <p className="mb-2 font-semibold">
                      {format(selectedDate, "EEEE, MMM d")}
                    </p>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {TIME_SLOTS.map((time) => {
                        const selected = selectedTime === time;

                        return (
                          <div key={time} className="flex gap-2">
                            <button
                              onClick={() => setSelectedTime(time)}
                              className={`flex-1 py-2 border rounded ${
                                selected
                                  ? "bg-black text-white"
                                  : "border-blue-500 text-blue-500"
                              }`}
                            >
                              {time}
                            </button>

                            {selected && (
                              <button
                                onClick={() => setStep("form")}
                                className="px-4 bg-blue-600 text-white rounded"
                              >
                                Next
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* FORM */}
          {step === "form" && (
            <div className="space-y-4 max-w-sm">
              <h3 className="font-bold">Enter Details</h3>

              <input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Name"
                className="w-full border p-2 rounded"
              />

              <input
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Email"
                className="w-full border p-2 rounded"
              />

              <Button onClick={handleConfirm}>
                Confirm
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}