"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  CalendarDays,
  Clock,
  MapPin,
  Users,
} from "lucide-react";

import EventFormModal, {
  EVENT_CATEGORIES,
  EVENT_STATUSES,
} from "@/components/ui/EventFormModal";

type EventCategory = (typeof EVENT_CATEGORIES)[number];
type EventStatus = (typeof EVENT_STATUSES)[number];

type EventItem = {
  id: number | string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // "HH:MM AM/PM"
  location: string;
  attendeesCount: number;
  status: EventStatus;
  category: EventCategory;
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);


  const [q, setQ] = useState("");
  const [category, setCategory] = useState<"All" | EventCategory>("All");
  const [status, setStatus] = useState<"All" | EventStatus>("All");


  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<EventItem | null>(null);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/organizer/events");

      const mapped: EventItem[] = (res.data || []).map((e: any) => ({
        id: e.eventId,
        title: e.eventTitle,
        description: e.eventDescription,
        date:
          typeof e.eventDate === "string"
            ? e.eventDate
            : new Date(e.eventDate).toISOString().slice(0, 10),
        time: e.eventTime,
        location: e.eventLocation,
        attendeesCount: Array.isArray(e.attendees) ? e.attendees.length : 0,
        status: e.eventStatus,
        category: e.eventCategory,
      }));

      setEvents(mapped);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return events.filter((ev) => {
      const matchQ =
        !query ||
        (ev.title ?? "").toLowerCase().includes(query) ||
        (ev.description ?? "").toLowerCase().includes(query) ||
        (ev.location ?? "").toLowerCase().includes(query);

      const matchCategory = category === "All" || ev.category === category;
      const matchStatus = status === "All" || ev.status === status;

      return matchQ && matchCategory && matchStatus;
    });
  }, [events, q, category, status]);

  // Stats
  const totalEvents = events.length;
  const upcomingCount = events.filter((e) => e.status === "UPCOMING").length;
  const totalAttendees = events.reduce(
    (sum, e) => sum + (e.attendeesCount || 0),
    0
  );

  const handleDelete = async (id: EventItem["id"]) => {
    const ok = confirm("Delete this event?");
    if (!ok) return;

    try {
      await api.delete(`/organizer/events/${id}`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const openCreate = () => {
    setMode("create");
    setSelected(null);
    setOpenForm(true);
  };

  const openEdit = (ev: EventItem) => {
    setMode("edit");
    setSelected(ev);
    setOpenForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 mt-1">
            Organize and manage your events efficiently
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold shadow hover:bg-blue-700 transition"
          type="button"
        >
          <Plus size={18} />
          Create Event
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Events"
          value={totalEvents}
          accent="text-gray-900"
        />
        <StatCard title="Upcoming" value={upcomingCount} accent="text-blue-600" />
        <StatCard
          title="Total Attendees"
          value={totalAttendees}
          accent="text-green-600"
        />
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-white/50 p-4 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        {/* Search */}
        <div className="flex items-center gap-2 border rounded-xl px-3 py-2 flex-1">
          <Search size={18} className="text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events..."
            className="outline-none w-full text-gray-700"
          />
        </div>

        {/* Category */}
        <div className="flex items-center gap-2 border rounded-xl px-4 py-2 min-w-[220px]">
          <Filter size={18} className="text-gray-500" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="outline-none w-full bg-transparent text-gray-700"
          >
            <option value="All">All Categories</option>
            {EVENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 border rounded-xl px-4 py-2 min-w-[200px]">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="outline-none w-full bg-transparent text-gray-700"
          >
            <option value="All">All Status</option>
            {EVENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-600">Loading events...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center text-gray-600">
          No events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((ev, idx) => (
            <EventCard
              key={`${ev.id ?? "noid"}-${idx}`}
              ev={ev}
              colorIndex={idx}
              onDelete={() => handleDelete(ev.id)}
              onEdit={() => openEdit(ev)}
            />
          ))}
        </div>
      )}

      {/* Single Modal for Create + Edit */}
      {openForm && (
        <EventFormModal
          mode={mode}
          initial={
            mode === "edit" && selected
              ? {
                  id: selected.id,
                  title: selected.title,
                  description: selected.description,
                  date: selected.date,
                  time: selected.time,
                  location: selected.location,
                  category: selected.category,
                  status: selected.status,
                }
              : undefined
          }
          onClose={() => setOpenForm(false)}
          onDone={async () => {
            setOpenForm(false);
            await loadEvents();
          }}
        />
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  accent,
}: {
  title: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className={`mt-2 text-4xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function EventCard({
  ev,
  colorIndex,
  onDelete,
  onEdit,
}: {
  ev: EventItem;
  colorIndex: number;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const topColors = [
    "bg-purple-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-blue-500",
    "bg-pink-500",
  ];
  const top = topColors[colorIndex % topColors.length];

  const chip =
    ev.status === "UPCOMING"
      ? "bg-blue-100 text-blue-700"
      : ev.status === "ONGOING"
      ? "bg-green-100 text-green-700"
      : ev.status === "COMPLETED"
      ? "bg-gray-100 text-gray-700"
      : "bg-red-100 text-red-700"; // CANCEL

  return (
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
      <div className={`h-2 ${top}`} />

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {ev.title}
          </h3>

          <div className="flex items-center gap-3 text-gray-500">
            <button
              type="button"
              onClick={onEdit}
              className="hover:text-gray-800"
              title="Edit"
            >
              <Pencil size={18} />
            </button>

            <button
              onClick={onDelete}
              className="hover:text-red-600"
              title="Delete"
              type="button"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${chip}`}
          >
            {ev.status}
          </span>
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border">
            {ev.category}
          </span>
        </div>

        <p className="mt-4 text-gray-600 leading-relaxed line-clamp-3">
          {ev.description}
        </p>

        <div className="mt-6 space-y-3 text-gray-700">
          <div className="flex items-center gap-3">
            <CalendarDays size={18} className="text-gray-400" />
            <span>{ev.date}</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock size={18} className="text-gray-400" />
            <span>{ev.time}</span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-gray-400" />
            <span className="truncate">{ev.location}</span>
          </div>

          <div className="flex items-center gap-3">
            <Users size={18} className="text-gray-400" />
            <span>{ev.attendeesCount} attendees</span>
          </div>
        </div>
      </div>
    </div>
  );
}
