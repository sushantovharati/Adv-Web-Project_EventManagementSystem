"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Users, Mail, User } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const linkBase =
    "group flex items-center gap-1 font-medium transition hover:text-blue-600";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const iconClass = (href: string) =>
    isActive(href)
      ? "text-blue-600"
      : "text-gray-500 group-hover:text-blue-600";

  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Calendar size={20} />
          </div>
          <span className="text-xl font-semibold text-gray-800">
            CampusEvents
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="flex gap-8">
          <Link
            href="/"
            className={`${linkBase} ${
              isActive("/") ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <Home size={18} className={iconClass("/")} />
            Home
          </Link>

          <Link
            href="/about"
            className={`${linkBase} ${
              isActive("/about") ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <Users size={18} className={iconClass("/about")} />
            About Us
          </Link>

          <Link
            href="/contact"
            className={`${linkBase} ${
              isActive("/contact") ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <Mail size={18} className={iconClass("/contact")} />
            Contact Us
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/organizer/login"
            className={`group flex items-center gap-1 font-medium transition ${
              isActive("/organizer/login")
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            <User
              size={18}
              className={
                isActive("/organizer/login")
                  ? "text-blue-600"
                  : "text-gray-500 group-hover:text-blue-600"
              }
            />
            Login
          </Link>

          <Link
            href="/organizer/register"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <Users size={18} className="text-white" />
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
