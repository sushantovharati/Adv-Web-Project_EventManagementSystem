"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";

interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalAttendees: number;
}

export default function OrganizerHomePage() {
  const [organizerId, setOrganizerId] = useState<number | null>(null);

  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    totalAttendees: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHomeData = useCallback(async () => {
    try {
      setError("");

      const profileRes = await api.get("/organizer/profile");
      const id = profileRes?.data?.organizerId ?? profileRes?.data?.id ?? profileRes?.data?.user?.organizerId;

      const numId = Number(id);
      if (!Number.isNaN(numId) && numId > 0) setOrganizerId(numId);

      const res = await api.get("/organizer/events");
      const events = res.data || [];

      const totalEvents = events.length;

      const upcomingEvents = events.filter(
        (e: any) => (e.eventStatus ?? e.status) === "UPCOMING"
      ).length;

      const totalAttendees = events.reduce(
        (sum: number, e: any) =>
          sum + (e.totalAttendees ?? e.attendeesCount ?? 0),
        0
      );

      setStats({ totalEvents, upcomingEvents, totalAttendees });
    } catch {
      setError("Failed to load organizer home data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  if (loading) return <p className="text-center mt-10">Loading home...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div>
      {/* Header row (title + notifications) */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Organizer Home</h1>

        {/* Notifications UI (only when organizerId is ready) */}
        {/* {organizerId ? (
          <OrganizerNotifications
            organizerId={organizerId}
            onRefetch={fetchHomeData}
          />
        ) : null} */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Events" value={stats.totalEvents} />
        <StatCard title="Upcoming Events" value={stats.upcomingEvents} />
        {/* <StatCard title="Total Attendees" value={stats.totalAttendees} /> */}
      </div>

      {/* Welcome Section */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-2">
          Welcome to Organizer Home
        </h2>
        <p className="text-gray-600">
          From here you can quickly view event statistics, manage events, and
          navigate to other organizer features.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-blue-600 mt-2">{value}</p>
    </div>
  );
}
