"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { X } from "lucide-react";
import { z } from "zod";

export const ATTENDEE_ROLES = ["STUDENT", "FACULTY", "OTHER"] as const;
export const ATTENDEE_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export const GENDERS = ["MALE", "FEMALE", "OTHER"] as const;

type AttendeeRole = (typeof ATTENDEE_ROLES)[number];
type AttendeeStatus = (typeof ATTENDEE_STATUSES)[number];
type Gender = (typeof GENDERS)[number];

type EventOption = { id: number; title: string };

const createSchema = z.object({
  attendeeName: z.string().min(3, "Name must be at least 3 characters"),
  attendeeEmail: z.string().email("Invalid email"),
  attendeePhone: z
    .string()
    .min(10, "Phone is required")
    .transform((v) => v.replace(/\s+/g, ""))
    .refine((v) => /^\+?\d{10,15}$/.test(v), "Invalid phone number"),
  attendeeGender: z.enum(GENDERS, { message: "Gender is required" }),
  attendeeRole: z.enum(ATTENDEE_ROLES).optional(),
  attendeeStatus: z.enum(ATTENDEE_STATUSES, { message: "Status is required" }),
  // create time only (mandatory)
  eventId: z.number().int().positive("Event is required"),
});

const updateSchema = z.object({
  attendeeName: z.string().min(3, "Name must be at least 3 characters"),
  attendeeEmail: z.string().email("Invalid email"),
  attendeePhone: z
    .string()
    .min(10, "Phone is required")
    .transform((v) => v.replace(/\s+/g, ""))
    .refine((v) => /^\+?\d{10,15}$/.test(v), "Invalid phone number"),
  attendeeGender: z.enum(GENDERS, { message: "Gender is required" }),
  attendeeRole: z.enum(ATTENDEE_ROLES).optional(),
  attendeeStatus: z.enum(ATTENDEE_STATUSES, { message: "Status is required" }),
});

export type AttendeeModalMode = "create" | "edit";

export type AttendeeInitial = {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  role?: AttendeeRole;
  status: AttendeeStatus;
};

export default function AttendeeFormModal({
  mode,
  initial,
  onClose,
  onDone,
}: {
  mode: AttendeeModalMode;
  initial?: AttendeeInitial | null;
  onClose: () => void;
  onDone: () => Promise<void> | void;
}) {
  const [events, setEvents] = useState<EventOption[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // form state
  const [attendeeName, setAttendeeName] = useState(initial?.name ?? "");
  const [attendeeEmail, setAttendeeEmail] = useState(initial?.email ?? "");
  const [attendeePhone, setAttendeePhone] = useState(initial?.phone ?? "");
  const [attendeeGender, setAttendeeGender] = useState<Gender>(
    initial?.gender ?? "MALE"
  );
  const [attendeeRole, setAttendeeRole] = useState<AttendeeRole>(
    (initial?.role as AttendeeRole) ?? "STUDENT"
  );
  const [attendeeStatus, setAttendeeStatus] = useState<AttendeeStatus>(
    initial?.status ?? "ACTIVE"
  );

  // create time: must select 1 event
  const [eventId, setEventId] = useState<number>(0);

  // ESC close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // load events only for create modal (dropdown)
  useEffect(() => {
    if (mode !== "create") return;

    const loadEvents = async () => {
      try {
        setEventsLoading(true);
        setEventsError("");

        const res = await api.get("/organizer/events");
        const opts: EventOption[] = (res.data || []).map((e: any) => ({
          id: Number(e.eventId),
          title: String(e.eventTitle ?? "Untitled"),
        }));

        setEvents(opts);

        // default select first event (if exists)
        if (opts.length > 0 && eventId === 0) setEventId(opts[0].id);
      } catch (e: any) {
        setEvents([]);
        setEventsError(
          e?.response?.data?.message || "Failed to load events for dropdown"
        );
      } finally {
        setEventsLoading(false);
      }
    };

    loadEvents();
  }, [mode]);

  const title = mode === "create" ? "Create Attendee" : "Update Attendee";
  const primaryText = mode === "create" ? "Create" : "Update";

  const submit = async () => {
    setApiError("");
    setFieldErrors({});

    try {
      setSubmitting(true);

      if (mode === "create") {
        const parsed = createSchema.safeParse({
          attendeeName,
          attendeeEmail,
          attendeePhone,
          attendeeGender,
          attendeeRole,
          attendeeStatus,
          eventId,
        });

        if (!parsed.success) {
          const fe: Record<string, string> = {};
          for (const issue of parsed.error.issues) {
            const key = String(issue.path[0] ?? "");
            if (key && !fe[key]) fe[key] = issue.message;
          }
          setFieldErrors(fe);
          return;
        }

        // 1) create attendee
        const createPayload = {
          attendeeName: parsed.data.attendeeName,
          attendeeEmail: parsed.data.attendeeEmail,
          attendeePhone: parsed.data.attendeePhone,
          attendeeGender: parsed.data.attendeeGender,
          attendeeRole: parsed.data.attendeeRole,
          attendeeStatus: parsed.data.attendeeStatus,
        };

        const created = await api.post("/organizer/attendees", createPayload);
        const newId = created?.data?.attendeeId;

        if (!newId) {
          setApiError("Attendee created but attendeeId not returned from API.");
          return;
        }

        // 2) add attendee to selected event
        await api.post(`/organizer/events/${parsed.data.eventId}/attendees/${newId}`);

        await onDone();
        return;
      }

      // edit mode
      if (!initial?.id) {
        setApiError("Missing attendee id for update.");
        return;
      }

      const parsed2 = updateSchema.safeParse({
        attendeeName,
        attendeeEmail,
        attendeePhone,
        attendeeGender,
        attendeeRole,
        attendeeStatus,
      });

      if (!parsed2.success) {
        const fe: Record<string, string> = {};
        for (const issue of parsed2.error.issues) {
          const key = String(issue.path[0] ?? "");
          if (key && !fe[key]) fe[key] = issue.message;
        }
        setFieldErrors(fe);
        return;
      }

      await api.patch(`/organizer/attendees/${initial.id}`, parsed2.data);
      await onDone();
    } catch (e: any) {
      setApiError(e?.response?.data?.message || "Request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const eventOptions = useMemo(() => events, [events]);

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

          <Field label="Name *" error={fieldErrors.attendeeName}>
            <input
              value={attendeeName}
              onChange={(e) => setAttendeeName(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Email *" error={fieldErrors.attendeeEmail}>
              <input
                value={attendeeEmail}
                onChange={(e) => setAttendeeEmail(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
              />
            </Field>

            <Field label="Phone *" error={fieldErrors.attendeePhone}>
              <input
                value={attendeePhone}
                onChange={(e) => setAttendeePhone(e.target.value)}
                placeholder="+8801XXXXXXXXX"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Gender *" error={fieldErrors.attendeeGender}>
              <select
                value={attendeeGender}
                onChange={(e) => setAttendeeGender(e.target.value as any)}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Role" error={fieldErrors.attendeeRole}>
              <select
                value={attendeeRole}
                onChange={(e) => setAttendeeRole(e.target.value as any)}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              >
                {ATTENDEE_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status *" error={fieldErrors.attendeeStatus}>
              <select
                value={attendeeStatus}
                onChange={(e) => setAttendeeStatus(e.target.value as any)}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              >
                {ATTENDEE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {mode === "create" && (
            <Field label="Select Event *" error={fieldErrors.eventId}>
              {eventsLoading ? (
                <div className="text-sm text-gray-600">Loading events...</div>
              ) : eventsError ? (
                <div className="text-sm text-red-600">{eventsError}</div>
              ) : eventOptions.length === 0 ? (
                <div className="text-sm text-gray-600">
                  No events found. Please create an event first.
                </div>
              ) : (
                <select
                  value={eventId}
                  onChange={(e) => setEventId(Number(e.target.value))}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                >
                  {eventOptions.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          )}
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
            {submitting ? (mode === "create" ? "Creating..." : "Updating...") : primaryText}
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
