"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { organizerLoginSchema } from "@/lib/validators/organizerLogin";
import { CalendarDays, Mail, Lock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function OrganizerLoginPage() {
    const router = useRouter();
    const [organizerEmail, setOrganizerEmail] = useState("");
    const [organizerPassword, setOrganizerPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError("");

        const parsed = organizerLoginSchema.safeParse({
            organizerEmail,
            organizerPassword,
        });

        if (!parsed.success) {
            setError(parsed.error.issues[0]?.message || "Invalid input");
            return;
        }

        try {
            setLoading(true);
            await api.post("/organizer/login", parsed.data);
            router.push("/organizer/home");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#EDF4FE] flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center">
                            <CalendarDays size={28} className="text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="mt-6 text-center text-4xl font-bold text-gray-900">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-center text-gray-500">
                        Login to your EventHub account
                    </p>

                    {/* Error */}
                    {error && (
                        <p className="mt-4 text-center text-sm text-red-600">{error}</p>
                    )}

                    {/* Email */}
                    <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="email"
                                value={organizerEmail}
                                onChange={(e) => setOrganizerEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full rounded-xl border-2 border-blue-500 focus:border-blue-600 focus:ring-0 outline-none py-3 pl-11 pr-4 text-gray-800 placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Password
                        </label>

                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="password"
                                value={organizerPassword}
                                onChange={(e) => setOrganizerPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-0 outline-none py-3 pl-11 pr-4 text-gray-800 placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-sm text-gray-500">
                            Don&apos;t have an account?
                        </span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    {/* Create Account */}
                    <Link
                        href="/organizer/register"
                        className="block w-full text-center rounded-xl border-2 border-gray-200 py-3 font-semibold text-gray-800 hover:bg-gray-50 transition"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </>
    );
}
