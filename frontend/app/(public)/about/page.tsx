import Navbar from "@/components/layout/Navbar";
import { CalendarDays, Users, ShieldCheck, Rocket } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#EDF4FE]">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center">
              <CalendarDays size={22} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              About CampusEvents
            </h1>
          </div>

          <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl">
            CampusEvents is a simple and reliable platform built to help people
            discover, create, and manage events smoothly. Whether it&apos;s a
            campus program, seminar, workshop, or any community event—our goal
            is to make the whole experience faster, clearer, and more organized.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
              Event Management
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
              Organized Schedules
            </span>
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
              Better Coordination
            </span>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            icon={<Rocket size={18} className="text-blue-600" />}
            title="Our Mission"
            text="Make event planning and participation effortless for everyone."
          />
          <Card
            icon={<Users size={18} className="text-purple-600" />}
            title="For Everyone"
            text="A landing experience designed for all visitors and users."
          />
          <Card
            icon={<ShieldCheck size={18} className="text-green-600" />}
            title="Trust & Safety"
            text="Secure authentication and clean user experience across the platform."
          />
          <Card
            icon={<CalendarDays size={18} className="text-teal-600" />}
            title="Smart Management"
            text="Create events, manage attendees, and track progress with clarity."
          />
        </div>

        {/* CTA */}
        <div className="mt-10 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Ready to explore events?
            </h2>
            <p className="mt-1 text-gray-600">
              Browse events or create your own in just a few steps.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Go to Home
            </Link>
            <Link
              href="/organizer/login"
              className="px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-semibold hover:bg-gray-50 transition"
            >
              Organizer Login
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}

function Card({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{text}</p>
    </div>
  );
}
