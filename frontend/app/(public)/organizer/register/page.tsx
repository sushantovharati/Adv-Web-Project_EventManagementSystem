"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { organizerRegisterSchema } from "@/lib/validators/organizerRegister";
import Navbar from "@/components/layout/Navbar";

export default function OrganizerRegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        organizerName: "",
        organizerEmail: "",
        organizerPhone: "",
        organizerGender: "male",
        organizerDob: "",
        organizerJoiningDate: new Date().toISOString().slice(0, 10),
        organizerPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleRegister = async () => {
        setError("");

        const parsed = organizerRegisterSchema.safeParse(form);
        if (!parsed.success) {
            setError(parsed.error.issues[0]?.message || "Invalid input");
            return;
        }

        try {
            setLoading(true);
            await api.post("/organizer/register", parsed.data);
            router.push("/organizer/login");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-md mx-auto p-8 bg-white shadow-xl rounded mt-1">
                <h1 className="text-2xl font-bold mb-6 text-center">Organizer Register</h1>

                {error && <p className="text-red-600 mb-4">{error}</p>}

                <label className="block mb-2 text-sm font-medium">Name</label>
                <input
                    className="w-full border p-2 rounded mb-4"
                    value={form.organizerName}
                    onChange={(e) => onChange("organizerName", e.target.value)}
                />

                <label className="block mb-2 text-sm font-medium">Email</label>
                <input
                    className="w-full border p-2 rounded mb-4"
                    value={form.organizerEmail}
                    onChange={(e) => onChange("organizerEmail", e.target.value)}
                />

                <label className="block mb-2 text-sm font-medium">Phone</label>
                <input
                    className="w-full border p-2 rounded mb-4"
                    value={form.organizerPhone}
                    onChange={(e) => onChange("organizerPhone", e.target.value)}
                    placeholder="01XXXXXXXXX"
                />

                <label className="block mb-2 text-sm font-medium">Gender</label>
                <select
                    className="w-full border p-2 rounded mb-4"
                    value={form.organizerGender}
                    onChange={(e) => onChange("organizerGender", e.target.value)}
                >
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
                </select>

                <label className="block mb-2 text-sm font-medium">Date of Birth</label>
                <input
                    type="date"
                    className="w-full border p-2 rounded mb-4"
                    value={form.organizerDob}
                    onChange={(e) => onChange("organizerDob", e.target.value)}
                />

                <label className="block mb-2 text-sm font-medium">Joining Date</label>
                <input
                    type="date"
                    className="w-full border p-2 rounded mb-4"
                    value={form.organizerJoiningDate}
                    onChange={(e) => onChange("organizerJoiningDate", e.target.value)}
                />

                <label className="block mb-2 text-sm font-medium">Password</label>
                <input
                    type="password"
                    className="w-full border p-2 rounded mb-6"
                    value={form.organizerPassword}
                    onChange={(e) => onChange("organizerPassword", e.target.value)}
                />

                <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full bg-green-600 hover:cursor-pointer text-white p-2 rounded disabled:opacity-60"
                >
                    {loading ? "Creating..." : "Create Account"}
                </button>
            </div>
        </>
    );
}
