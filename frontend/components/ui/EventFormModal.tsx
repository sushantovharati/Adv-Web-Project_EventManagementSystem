"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { X } from "lucide-react";
import { z } from "zod";

export const EVENT_CATEGORIES = [
  "CONFERENCE",
  "WORKSHOP",
  "MEETUP",
  "WEBINAR",
  "SOCIAL",
  "OTHER",
] as const;

export const EVENT_STATUSES = ["UPCOMING", "ONGOING", "COMPLETED", "CANCEL"] as const;

type EventCategory = (typeof EVENT_CATEGORIES)[number];
type EventStatus = (typeof EVENT_STATUSES)[number];

export type EventFormMode = "create" | "edit";

export type EventFormInitial = {
  id?: number | string;
  title?: string;
  description?: string;
  date?: string; // YYYY-MM-DD
  time?: string; // "HH:MM AM/PM"
  location?: string;
  category?: EventCategory;
  status?: EventStatus;
};

const schema = z.object({
  eventTitle: z.string().min(3, "Event title is required"),
  eventDescription: z.string().min(1, "Description is required"),
  eventDate: z
    .string()
    .min(1, "Date is required")
    .refine((v) => !Number.isNaN(new Date(v).getTime()), "Invalid date"),
  eventTime: z.string().regex(/^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i, "Invalid time"),
  eventLocation: z.string().min(1, "Location is required"),
  eventCategory: z.enum(EVENT_CATEGORIES, { message: "Category is required" }),
  eventStatus: z.enum(EVENT_STATUSES, { message: "Status is required" }),
});

type Form = z.infer<typeof schema>;

function parseTime12(time?: string): { hh: string; mm: string; ap: "AM" | "PM" } {
  const safe = (time || "").trim();
  const m = safe.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return { hh: "12", mm: "00", ap: "PM" };
  return {
    hh: String(m[1]).padStart(2, "0"),
    mm: String(m[2]).padStart(2, "0"),
    ap: (m[3].toUpperCase() as "AM" | "PM") || "PM",
  };
}

export default function EventFormModal({
  mode,
  initial,
  onClose,
  onDone,
}: {
  mode: EventFormMode;
  initial?: EventFormInitial;
  onClose: () => void;
  onDone: () => Promise<void> | void; 
}) {
  const HOURS = useMemo(
    () => Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")),
    []
  );
  const MINUTES = useMemo(
    () => Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0")),
    []
  );

  const t = useMemo(() => parseTime12(initial?.time), [initial?.time]);

  const [hour, setHour] = useState(t.hh);
  const [minute, setMinute] = useState(t.mm);
  const [meridiem, setMeridiem] = useState<"AM" | "PM">(t.ap);

  const [form, setForm] = useState<Form>({
    eventTitle: initial?.title ?? "",
    eventDescription: initial?.description ?? "",
    eventDate: initial?.date ?? "",
    eventTime: initial?.time ?? "12:00 PM",
    eventLocation: initial?.location ?? "",
    eventCategory: initial?.category ?? "OTHER",
    eventStatus: initial?.status ?? "UPCOMING",
  });

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  const update = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  // keep time synced (no typing)
  useEffect(() => {
    update("eventTime", `${hour}:${minute} ${meridiem}` as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, minute, meridiem]);

  // close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = async () => {
    setApiError("");
    setFieldErrors({});

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !fe[key]) fe[key] = issue.message;
      }
      setFieldErrors(fe);
      return;
    }

    try {
      setSubmitting(true);

      if (mode === "create") {
        await api.post("/organizer/events", parsed.data);
      } else {
        const id = initial?.id;
        if (id === undefined || id === null || id === "") {
          setApiError("Missing event id for update.");
          return;
        }
        await api.patch(`/organizer/events/${id}`, parsed.data);
      }

      await onDone();
    } catch (e: any) {
      setApiError(e?.response?.data?.message || "Request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const title = mode === "create" ? "Create New Event" : "Update Event";
  const submitText = mode === "create" ? "Create Event" : "Update Event";

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative mx-auto mt-10 w-[760px] max-w-[92vw] bg-white rounded-2xl shadow-2xl border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-lg hover:bg-gray-100 inline-flex items-center justify-center"
            aria-label="Close"
            type="button"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[72vh] overflow-auto">
          {apiError && (
            <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">
              {apiError}
            </div>
          )}

          <Field label="Event Title *" error={fieldErrors.eventTitle}>
            <input
              value={form.eventTitle}
              onChange={(e) => update("eventTitle", e.target.value)}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </Field>

          <Field label="Description *" error={fieldErrors.eventDescription}>
            <textarea
              value={form.eventDescription}
              onChange={(e) => update("eventDescription", e.target.value)}
              className="w-full min-h-[120px] border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Date *" error={fieldErrors.eventDate}>
              <input
                type="date"
                value={form.eventDate}
                onChange={(e) => update("eventDate", e.target.value)}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
              />
            </Field>

            <Field label="Time *" error={fieldErrors.eventTime}>
              <div className="flex gap-3">
                <select
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                >
                  {HOURS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>

                <select
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                >
                  {MINUTES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  value={meridiem}
                  onChange={(e) => setMeridiem(e.target.value as "AM" | "PM")}
                  className="w-[120px] border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Selected: <span className="font-semibold">{form.eventTime}</span>
              </p>
            </Field>
          </div>

          <Field label="Location *" error={fieldErrors.eventLocation}>
            <input
              value={form.eventLocation}
              onChange={(e) => update("eventLocation", e.target.value)}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category *" error={fieldErrors.eventCategory}>
              <select
                value={form.eventCategory}
                onChange={(e) => update("eventCategory", e.target.value as any)}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              >
                {EVENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status *" error={fieldErrors.eventStatus}>
              <select
                value={form.eventStatus}
                onChange={(e) => update("eventStatus", e.target.value as any)}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              >
                {EVENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border font-semibold text-gray-700 hover:bg-gray-50 transition"
            type="button"
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            type="button"
            disabled={submitting}
          >
            {submitting ? (mode === "create" ? "Creating..." : "Updating...") : submitText}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>
      {children}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
