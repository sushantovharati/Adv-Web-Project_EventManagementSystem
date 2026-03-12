"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { X } from "lucide-react";

type Gender = "MALE" | "FEMALE" | "OTHER";

export default function OrganizerEditModal({
  initial,
  onClose,
  onDone,
}: {
  initial: {
    organizerName: string;
    organizerEmail: string; // readonly
    organizerPhone: string;
    organizerGender: Gender | string;
    organizerDob: string;
    organizerJoiningDate: string; // readonly
    organizerAddress?: string;
    organizerBio?: string;
  };
  onClose: () => void;
  onDone: () => Promise<void> | void;
}) {
  const [form, setForm] = useState({
    organizerName: initial.organizerName ?? "",
    organizerPhone: initial.organizerPhone ?? "",
    organizerGender: (initial.organizerGender as Gender) ?? "MALE",
    organizerDob: initial.organizerDob ?? "",
    organizerAddress: initial.organizerAddress ?? "",
    organizerBio: initial.organizerBio ?? "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const update = (k: keyof typeof form, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setApiError("");

    if (!form.organizerName.trim()) return setApiError("Name is required");
    if (!form.organizerPhone.trim()) return setApiError("Phone is required");
    if (!form.organizerDob.trim()) return setApiError("DOB is required");

    try {
      setSubmitting(true);

      // ✅ email + joining date send korbo na
      await api.patch("/organizer/update", {
        organizerName: form.organizerName.trim(),
        organizerPhone: form.organizerPhone.trim(),
        organizerGender: form.organizerGender,
        organizerDob: form.organizerDob,
        organizerAddress: form.organizerAddress?.trim() || undefined,
        organizerBio: form.organizerBio?.trim() || undefined,
      });

      await onDone();
    } catch (e: any) {
      setApiError(e?.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative mx-auto mt-10 w-[760px] max-w-[92vw] bg-white rounded-2xl shadow-2xl border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-lg hover:bg-gray-100 inline-flex items-center justify-center"
            aria-label="Close"
            type="button"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[72vh] overflow-auto">
          {apiError && (
            <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">
              {apiError}
            </div>
          )}

          <Field label="Full Name *">
            <input
              value={form.organizerName}
              onChange={(e) => update("organizerName", e.target.value)}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Email (read-only)">
              <input
                value={initial.organizerEmail}
                readOnly
                className="w-full border rounded-xl px-4 py-3 bg-gray-50 text-gray-600"
              />
            </Field>

            <Field label="Joining Date (read-only)">
              <input
                value={initial.organizerJoiningDate}
                readOnly
                className="w-full border rounded-xl px-4 py-3 bg-gray-50 text-gray-600"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone *">
              <input
                value={form.organizerPhone}
                onChange={(e) => update("organizerPhone", e.target.value)}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
              />
            </Field>

            <Field label="Gender *">
              <select
                value={form.organizerGender}
                onChange={(e) => update("organizerGender", e.target.value)}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              >
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </Field>
          </div>

          <Field label="Date of Birth *">
            <input
              type="date"
              value={form.organizerDob}
              onChange={(e) => update("organizerDob", e.target.value)}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </Field>

          <Field label="Address">
            <input
              value={form.organizerAddress}
              onChange={(e) => update("organizerAddress", e.target.value)}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </Field>

          <Field label="Bio">
            <textarea
              value={form.organizerBio}
              onChange={(e) => update("organizerBio", e.target.value)}
              className="w-full min-h-[110px] border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border font-semibold text-gray-700 hover:bg-gray-50 transition"
            type="button"
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            type="button"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>
      {children}
    </div>
  );
}
