import Link from "next/link";
import {
  CalendarDays,
  Users,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import api from "@/lib/axios";

type PublicEvent = {
  eventId?: number | string;
  id?: number | string;
  eventTitle?: string;
  title?: string;
  eventDescription?: string;
  description?: string;
  eventDate?: string;
  date?: string;
  eventTime?: string;
  time?: string;
  eventLocation?: string;
  location?: string;
  attendeesCount?: number;
  totalAttendees?: number;
};

async function getUpcomingEvents(): Promise<PublicEvent[]> {
  try {
    const res = await api.get<PublicEvent[]>(
      "/events/public",
      {
        params: {
          status: "UPCOMING",
          limit: 6,
        },
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Failed to fetch upcoming events", error);
    return [];
  }
}


export default async function LandingPage() {
  const events = await getUpcomingEvents();

  return (
    <>
      <Navbar />
      <main className="w-full">

        {/* ================= HERO SECTION ================= */}
        <section className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-6 py-32 text-center">
            <h1 className="text-4xl md:text-5xl font-bold">
              Welcome to CampusEvents
            </h1>

            <p className="mt-6 text-lg max-w-3xl mx-auto opacity-90">
              Your all-in-one platform for discovering campus events, viewing schedules, and
              joining experiences that bring your community together.
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/organizer/register"
                className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition"
              >
                Get Started
              </Link>

              <Link
                href="/organizer/login"
                className="border border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* ================= WHY CHOOSE ================= */}
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose CampusEvents?
            </h2>

            <p className="mt-4 text-gray-600">
              Everything you need to discover upcoming events and stay connected
            </p>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<CalendarDays size={22} />}
                title="Easy Event Management"
                text="Create, update, and manage events instantly with live status tracking and real-time changes visible to participants."
              />

              <FeatureCard
                icon={<Users size={22} />}
                title="Real-time Participant Tracking"
                text="Monitor registrations, attendance counts, and participant activity as it happens without manual refresh."
              />

              <FeatureCard
                icon={<CheckCircle size={22} />}
                title="Live Event Updates"
                text="Automatically reflect schedule changes, attendee limits, and event completion status across the platform."
              />
            </div>
          </div>
        </section>

        {/* ================= UPCOMING EVENTS ================= */}
        <section className="bg-[#EEF4FF] py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Upcoming Events
              </h2>
              <p className="mt-4 text-gray-600">
                Join the latest upcoming events
              </p>
            </div>

            {events.length === 0 ? (
              <div className="mt-10 text-center text-gray-600">
                No upcoming events found.
              </div>
            ) : (
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                {events.slice(0, 6).map((e, idx) => (
                  <EventCard
                    key={String(e.eventId ?? e.id ?? idx)}
                    title={(e.eventTitle ?? e.title ?? "Untitled") as string}
                    desc={(e.eventDescription ?? e.description ?? "") as string}
                    date={(e.eventDate ?? e.date ?? "") as string}
                    time={(e.eventTime ?? e.time ?? "") as string}
                    location={(e.eventLocation ?? e.location ?? "") as string}
                    attendees={String(e.attendeesCount ?? e.totalAttendees ?? 0)}
                  />
                ))}
              </div>
            )}

            
          </div>
        </section>

        {/* Get Readey to start section */}
        <section className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white py-28">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Get Started?
            </h2>

            <p className="mt-4 text-lg opacity-90">
              Join thousands of event organizers who trust EventHub to manage
              events in real time.
            </p>

            <Link
              href="/organizer/register"
              className="mt-10 inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Create Your Account
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

/* ================= COMPONENTS ================= */

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-[#F4F7FF] rounded-3xl p-8 text-left">
      <div className="h-12 w-12 bg-blue-600 text-white rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-semibold text-gray-900">
        {title}
      </h3>
      <p className="mt-3 text-gray-600 leading-relaxed">
        {text}
      </p>
    </div>
  );
}

function EventCard({
  title,
  desc,
  date,
  time,
  location,
  attendees,
}: {
  title: string;
  desc: string;
  date: string;
  time: string;
  location: string;
  attendees: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-5" />

      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{desc}</p>

      <div className="mt-4 space-y-2 text-gray-600 text-sm">
        <div className="flex items-center gap-2">
          <Calendar size={16} /> {date}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} /> {time}
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} /> {location}
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} /> {attendees}
        </div>
      </div>
    </div>

  );
}
