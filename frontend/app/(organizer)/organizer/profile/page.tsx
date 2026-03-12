"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  User,
  Calendar,
  CalendarPlus,
  CheckCircle,
  Users,
  KeyRound,
  Trash2,
} from "lucide-react";

import OrganizerEditModal from "@/components/ui/OrganizerEditModal";
import ChangePasswordModal from "@/components/ui/ChangePasswordModal";

type OrganizerProfile = {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  joinedAt: string;
  address?: string;
  bio?: string;
};

type AccountStats = {
  eventsCreated: number;
  totalAttendees: number;
  eventsCompleted: number;
};
// state, useEffict
export default function OrganizerProfilePage() {
  const [profile, setProfile] = useState<OrganizerProfile | null>(null);
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // modals
  const [openEdit, setOpenEdit] = useState(false);
  const [openPass, setOpenPass] = useState(false);

  const loadAll = async () => {
    try {
      setLoading(true);
      setError("");

      const profileRes = await api.get("/organizer/profile");
      let statsRes: any = null;

      try {
        statsRes = await api.get("/organizer/profile/stats");
      } catch {
        statsRes = null;
      }

      const p = profileRes.data;

      setProfile({
        name: p.organizerName ?? "Unknown",
        email: p.organizerEmail ?? "Not Provided",
        phone: p.organizerPhone ?? "Not Provided",
        gender: p.organizerGender ?? "Not Provided",
        dob: p.organizerDob ?? "Not Provided",
        joinedAt: p.organizerJoiningDate ?? "Not Provided",
        address: p.organizerAddress ?? "",
        bio: p.organizerBio ?? "",
      });

      if (statsRes?.data) {
        const s = statsRes.data;

        // ✅ supports both naming styles
        const eventsCreated = s.eventsCreated ?? s.totalEvents ?? 0;
        const eventsCompleted = s.eventsCompleted ?? s.completedEvents ?? 0;
        const totalAttendees = s.totalAttendees ?? 0;

        setStats({ eventsCreated, eventsCompleted, totalAttendees });
      } else {
        setStats({ eventsCreated: 0, eventsCompleted: 0, totalAttendees: 0 });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  if (loading) return <p className="mt-10">Loading profile...</p>;
  if (error) return <p className="mt-10 text-red-600">{error}</p>;
  if (!profile) return null;

  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const deleteAccount = async () => {
    const ok = confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (!ok) return;

    try {
      await api.delete("/organizer/account");
      // optional: redirect to login page
      window.location.href = "/organizer/login";
    } catch (e: any) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="h-36 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">CampusEvents</h1>
        </div>

        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white">
                {initials}
              </div>
              <button
                className="absolute bottom-1 right-1 bg-blue-600 cursor-not-allowed text-white p-2 rounded-full opacity-70"
                title="Profile photo upload (disabled)"
                type="button"
              >
                <Camera size={16} />
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-gray-600">Organizer</p>
            </div>
          </div>

          <button
            onClick={() => setOpenEdit(true)}
            className="bg-blue-600 text-white px-6 py-3 cursor-pointer rounded-xl font-semibold hover:bg-blue-700"
            type="button"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 space-y-6">
          <h3 className="text-xl font-semibold">Personal Information</h3>

          <InfoField label="Full Name" value={profile.name} icon={<User size={16} className="text-indigo-500" />} />
          <InfoField label="Email Address" value={profile.email} icon={<Mail size={16} className="text-blue-500" />} />
          <InfoField label="Phone Number" value={profile.phone} icon={<Phone size={16} className="text-green-500" />} />
          <InfoField label="Gender" value={profile.gender} icon={<User size={16} className="text-purple-500" />} />
          <InfoField label="Date of Birth" value={profile.dob} icon={<Calendar size={16} className="text-orange-500" />} />
          <InfoField
            label="Joining Date"
            value={profile.joinedAt}
            icon={<CalendarDays size={16} className="text-teal-500" />}
          />
          <InfoField
            label="Address"
            value={profile.address?.trim() ? profile.address : "Address is not provided"}
            icon={<MapPin size={16} className="text-red-500" />}
          />

          <div>
            <label className="text-sm text-gray-500">Bio</label>
            <div className="mt-2 p-4 border rounded-xl text-gray-700 flex gap-2">
              <User size={16} className="mt-1 text-indigo-500" />
              <span>{profile.bio?.trim() ? profile.bio : "Bio is not provided"}</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Account Stats */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Account Stats</h3>

            <StatRow
              label="Events Created"
              value={stats?.eventsCreated ?? 0}
              icon={<CalendarPlus size={16} className="text-blue-500" />}
            />
            <StatRow
              label="Events Completed"
              value={stats?.eventsCompleted ?? 0}
              icon={<CheckCircle size={16} className="text-green-500" />}
            />
            <StatRow
              label="Attendees Added"
              value={stats?.totalAttendees ?? 0}
              icon={<Users size={16} className="text-purple-500" />}
            />
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="text-xl font-semibold">Account Details</h3>

            <div className="flex items-center gap-2 text-gray-700">
              <CalendarDays size={16} className="text-teal-500" />
              <span>Joined: {profile.joinedAt || "N/A"}</span>
            </div>

            <button
              onClick={() => setOpenPass(true)}
              className="flex items-center gap-2 text-blue-600 font-medium cursor-pointer hover:underline transition"
              type="button"
            >
              <KeyRound size={16} className="text-blue-500" />
              Change Password
            </button>

            <button
              onClick={deleteAccount}
              className="flex items-center gap-2 text-red-600 font-medium cursor-pointer hover:underline transition"
              type="button"
            >
              <Trash2 size={16} className="text-red-500" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {openEdit && (
        <OrganizerEditModal
          initial={{
            organizerName: profile.name,
            organizerEmail: profile.email, // read-only
            organizerPhone: profile.phone,
            organizerGender: profile.gender as any,
            organizerDob: profile.dob,
            organizerJoiningDate: profile.joinedAt, // read-only
            organizerAddress: profile.address ?? "",
            organizerBio: profile.bio ?? "",
          }}
          onClose={() => setOpenEdit(false)}
          onDone={async () => {
            setOpenEdit(false);
            await loadAll();
          }}
        />
      )}

      {/* Change Password Modal */}
      {openPass && (
        <ChangePasswordModal
          onClose={() => setOpenPass(false)}
          onDone={async () => {
            setOpenPass(false);
          }}
        />
      )}
    </div>
  );
}

function InfoField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <div className="mt-2 flex items-center gap-2 border rounded-xl px-4 py-3">
        {icon}
        <span>{value}</span>
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2 text-gray-700">
      <div className="flex items-center gap-2">
        {icon && <span className="text-gray-500">{icon}</span>}
        <span>{label}</span>
      </div>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
