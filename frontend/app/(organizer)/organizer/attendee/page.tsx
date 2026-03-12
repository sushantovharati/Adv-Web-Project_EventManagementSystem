"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { Plus, Search, Mail, Phone, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";

import AttendeeFormModal from "@/components/ui/AttendeeFormModal";

type AttendeeStatus = "ACTIVE" | "INACTIVE";

type AttendeeItem = {
  attendeeId: number | string;
  name: string;
  email: string;
  phone: string;
  registeredEvents: number;
  eventTitles: string[];
  status: AttendeeStatus;
  gender?: "MALE" | "FEMALE" | "OTHER";
  role?: "STUDENT" | "FACULTY" | "OTHER";
};

export default function AttendeesPage() {
  const [attendees, setAttendees] = useState<AttendeeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI state
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"All" | AttendeeStatus>("All");

  // modal state
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<AttendeeItem | null>(null);

  const loadAttendees = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/organizer/attendees");

      const mapped: AttendeeItem[] = (res.data || []).map((a: any) => {
        const titles = Array.isArray(a.events)
          ? a.events.map((e: any) => e.eventTitle ?? e.title).filter(Boolean)
          : [];

        return {
          attendeeId: a.attendeeId,
          name: a.attendeeName,
          email: a.attendeeEmail,
          phone: a.attendeePhone,
          registeredEvents: titles.length,
          eventTitles: titles,
          status: a.attendeeStatus as AttendeeStatus,
          gender: a.attendeeGender,
          role: a.attendeeRole,
        };

      });


      setAttendees(mapped);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load attendees");
      setAttendees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAttendees();
  }, [loadAttendees]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return attendees.filter((a) => {
      const matchQ =
        !query ||
        a.name.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        a.phone.toLowerCase().includes(query);

      const matchStatus = status === "All" || a.status === status;
      return matchQ && matchStatus;
    });
  }, [attendees, q, status]);

  // Stats
  const totalAttendees = attendees.length;
  const activeAttendees = attendees.filter((a) => a.status === "ACTIVE").length;
  const totalRegistrations = attendees.reduce((sum, a) => sum + (a.registeredEvents || 0), 0);

  const openCreate = () => {
    setMode("create");
    setSelected(null);
    setOpenForm(true);
  };

  const openEdit = (a: AttendeeItem) => {
    setMode("edit");
    setSelected(a);
    setOpenForm(true);
  };

  const handleDelete = async (id: AttendeeItem["attendeeId"]) => {
    const ok = confirm("Delete this attendee?");
    if (!ok) return;

    try {
      await api.delete(`/organizer/attendees/${id}`);
      setAttendees((prev) => prev.filter((x) => x.attendeeId !== id));
    } catch (e: any) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + Create btn */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendees</h1>
          <p className="text-gray-500 mt-1">Manage and view all event attendees</p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold shadow hover:bg-blue-700 transition"
          type="button"
        >
          <Plus size={18} />
          Create Attendee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Attendees" value={totalAttendees} accent="text-gray-900" />
        <StatCard title="Active Attendees" value={activeAttendees} accent="text-green-600" />
        <StatCard title="Total Registrations" value={totalRegistrations} accent="text-blue-600" />
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-white/50 p-4 flex flex-col lg:flex-row gap-4">
        <div className="flex items-center gap-2 border rounded-xl px-3 py-2 flex-1">
          <Search size={18} className="text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search attendees..."
            className="outline-none w-full"
          />
        </div>

        <div className="border rounded-xl px-4 py-2 min-w-[180px]">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="outline-none w-full bg-transparent"
          >
            <option value="All">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading attendees...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-4 text-xs font-semibold text-gray-500 bg-gray-50">
            <div className="col-span-4">ATTENDEE</div>
            <div className="col-span-4">CONTACT</div>
            <div className="col-span-2">REGISTERED EVENTS</div>
            <div className="col-span-1">STATUS</div>
            <div className="col-span-1 text-right">ACTIONS</div>
          </div>

          {filtered.map((a) => (
            <div
              key={String(a.attendeeId)}
              className="grid grid-cols-12 px-6 py-5 border-t items-center"
            >
              <div className="col-span-4 font-semibold">{a.name}</div>

              <div className="col-span-4 space-y-1 text-gray-700">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  {a.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  {a.phone}
                </div>
              </div>

              {/* <div className="col-span-2">{a.registeredEvents}</div> */}

              <div className="col-span-2">
                {a.eventTitles.length === 0 ? (
                  <span className="text-gray-400">—</span>
                ) : (
                  <span className="text-gray-800" title={a.eventTitles.join(", ")}>
                    {a.eventTitles.slice(0, 2).join(", ")}
                    {a.eventTitles.length > 2 ? ` +${a.eventTitles.length - 2} more` : ""}
                  </span>
                )}
              </div>


              <div className="col-span-1">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${a.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {a.status}
                </span>
              </div>

              {/* Actions: details + edit + delete */}
              <div className="col-span-1 flex justify-end gap-3 text-gray-600">
                <Link
                  href={`/organizer/attendee/${a.attendeeId}`}
                  className="hover:text-gray-900"
                  title="Details"
                >
                  <Eye size={18} />
                </Link>

                <button
                  onClick={() => openEdit(a)}
                  className="hover:text-gray-900"
                  title="Update"
                  type="button"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => handleDelete(a.attendeeId)}
                  className="hover:text-red-600"
                  title="Delete"
                  type="button"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal (create + edit same) */}
      {openForm && (
        <AttendeeFormModal
          mode={mode}
          initial={
            mode === "edit" && selected
              ? {
                id: selected.attendeeId,
                name: selected.name,
                email: selected.email,
                phone: selected.phone,
                gender: selected.gender ?? "MALE",
                role: selected.role ?? "STUDENT",
                status: selected.status,
              }
              : null
          }
          onClose={() => setOpenForm(false)}
          onDone={async () => {
            setOpenForm(false);
            await loadAttendees();
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
