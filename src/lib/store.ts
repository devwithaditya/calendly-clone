// Simple in-memory store for the scheduling app (will be replaced by Lovable Cloud later)
import { useState, useCallback } from "react";

export interface EventType {
  id: string;
  name: string;
  duration: number;
  platform: string;
  type: string;
  availability: string;
  color: string;
  slug: string;
}

export interface Booking {
  id: string;
  eventTypeId: string;
  eventName: string;
  date: string;
  time: string;
  guestName: string;
  guestEmail: string;
  status: "upcoming" | "past" | "cancelled";
  platform: string;
  duration: number;
}

export interface AvailabilitySlot {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
}

const DEFAULT_EVENT_TYPES: EventType[] = [
  {
    id: "1",
    name: "30 Minute Meeting",
    duration: 30,
    platform: "Google Meet",
    type: "One-on-One",
    availability: "Weekdays, 9 am - 5 pm",
    color: "hsl(220, 90%, 56%)",
    slug: "30-minute-meeting",
  },
  {
    id: "2",
    name: "15 Minute Chat",
    duration: 15,
    platform: "Google Meet",
    type: "One-on-One",
    availability: "Weekdays, 9 am - 5 pm",
    color: "hsl(142, 71%, 45%)",
    slug: "15-minute-chat",
  },
  {
    id: "3",
    name: "60 Minute Consultation",
    duration: 60,
    platform: "Zoom",
    type: "One-on-One",
    availability: "Mon-Thu, 10 am - 4 pm",
    color: "hsl(280, 70%, 55%)",
    slug: "60-minute-consultation",
  },
];

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: "b1",
    eventTypeId: "1",
    eventName: "30 Minute Meeting",
    date: "2026-03-30",
    time: "10:00 AM",
    guestName: "Jane Smith",
    guestEmail: "jane@example.com",
    status: "upcoming",
    platform: "Google Meet",
    duration: 30,
  },
  {
    id: "b2",
    eventTypeId: "2",
    eventName: "15 Minute Chat",
    date: "2026-03-25",
    time: "2:00 PM",
    guestName: "Bob Wilson",
    guestEmail: "bob@example.com",
    status: "past",
    platform: "Google Meet",
    duration: 15,
  },
];

const DEFAULT_AVAILABILITY: AvailabilitySlot[] = [
  { day: "Monday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Tuesday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Wednesday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Thursday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Friday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Saturday", enabled: false, start: "09:00", end: "17:00" },
  { day: "Sunday", enabled: false, start: "09:00", end: "17:00" },
];

// Singleton store
let eventTypes: EventType[] = (() => {
  try {
    const data = localStorage.getItem("events");
    return data ? JSON.parse(data) : DEFAULT_EVENT_TYPES;
  } catch {
    return DEFAULT_EVENT_TYPES;
  }
})();
let bookings = [...DEFAULT_BOOKINGS];
let availability = [...DEFAULT_AVAILABILITY];
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export const store = {
  subscribe(listener: () => void) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  getEventTypes: () => eventTypes,
  getBookings: () => bookings,
  getAvailability: () => availability,
  addEventType(et: Omit<EventType, "id" | "slug">) {
    const id = Date.now().toString();
    const slug = et.name.toLowerCase().replace(/\s+/g, "-");
    eventTypes = [...eventTypes, { ...et, id, slug }];
    localStorage.setItem("events", JSON.stringify(eventTypes));
    notify();
    return { id, slug };
  },
  deleteEventType(id: string) {
    eventTypes = eventTypes.filter((e) => e.id !== id);
    localStorage.setItem("events", JSON.stringify(eventTypes));

    notify();
  },
  addBooking(b: Omit<Booking, "id">) {
    const id = "b" + Date.now().toString();
    bookings = [...bookings, { ...b, id }];
    notify();
    return id;
  },
  cancelBooking(id: string) {
    bookings = bookings.map((b) =>
      b.id === id ? { ...b, status: "cancelled" as const } : b
    );
    notify();
  },
  updateAvailability(slots: AvailabilitySlot[]) {
    availability = slots;
    notify();
  },
};

export function useStore() {
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  // Subscribe on mount
  useState(() => {
    const unsub = store.subscribe(forceUpdate);
    return unsub;
  });
  return {
    eventTypes: store.getEventTypes(),
    bookings: store.getBookings(),
    availability: store.getAvailability(),
    addEventType: store.addEventType,
    deleteEventType: store.deleteEventType,
    addBooking: store.addBooking,
    cancelBooking: store.cancelBooking,
    updateAvailability: store.updateAvailability,
  };
}