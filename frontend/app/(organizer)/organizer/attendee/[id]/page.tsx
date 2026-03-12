"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";

type AttendeeDetail = {
  attendeeId: number;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  attendeeGender: string;
  attendeeRole: string;
  attendeeStatus: string;
  events?: { eventId: number; eventTitle: string }[];
};

export default function AttendeeDetailsPage() {

  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [data, setData] = useState<AttendeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/organizer/attendees/${id}`);
        setData(res.data);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load attendee details");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <div className="text-gray-600">Loading...</div>;

  if (error) {
      notFound();
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/attendees" className="text-blue-600 underline">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">Attendee Details</h1>
        <p className="text-gray-500 mt-1">Information and registered events</p>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-3">
        <Row label="Name" value={data.attendeeName} />
        <Row label="Email" value={data.attendeeEmail} />
        <Row label="Phone" value={data.attendeePhone} />
        <Row label="Gender" value={data.attendeeGender} />
        <Row label="Role" value={data.attendeeRole} />
        <Row label="Status" value={data.attendeeStatus} />
      </div>

      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900">Registered Events</h2>

        {!data.events || data.events.length === 0 ? (
          <p className="text-gray-600 mt-2">No events registered.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {data.events.map((e) => (
              <li key={e.eventId} className="border rounded-xl px-4 py-3">
                {e.eventTitle}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}
