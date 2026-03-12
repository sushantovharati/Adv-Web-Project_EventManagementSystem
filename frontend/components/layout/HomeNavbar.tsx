"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Calendar, Home, CalendarDays, Users, User, LogOut, } from "lucide-react";

import { useEffect, useState } from "react";
import OrganizerNotifications from "@/components/OrganizerNotifications";


const navItems = [
  { label: "Home", href: "/organizer/home", icon: Home },
  { label: "Events", href: "/organizer/events", icon: CalendarDays },
  { label: "Attendees", href: "/organizer/attendee", icon: Users },
  { label: "Profile", href: "/organizer/profile", icon: User },
];

export default function HomeNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [organizerId, setOrganizerId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/organizer/profile");
        setOrganizerId(Number(res.data.organizerId));
      } catch {
        setOrganizerId(null);
      }
    })();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/organizer/logout");
    } catch {

    } finally {
      router.push("/organizer/login");
      router.refresh();
    }
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Calendar size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900">CampusEvents</span>
        </div>

        {/* Right: Nav */}
        <nav className="flex items-center gap-3 sm:gap-4">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active =
              pathname === href || (href !== "/organizer/home" && pathname.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                className={[
                  "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition",
                  active
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100",
                ].join(" ")}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}

          {organizerId && <OrganizerNotifications organizerId={organizerId} />}


          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-red-600 hover:bg-red-50 transition"
            type="button"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
