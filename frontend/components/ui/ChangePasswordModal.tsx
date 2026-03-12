"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { X } from "lucide-react";

export default function ChangePasswordModal({
  onClose,
  onDone,
}: {
  onClose: () => void;
  onDone: () => Promise<void> | void;
}) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const submit = async () => {
    setApiError("");
    setOkMsg("");

    if (!oldPassword.trim()) return setApiError("Old password is required");
    if (!newPassword.trim()) return setApiError("New password is required");
    if (newPassword.length < 6) return setApiError("New password must be at least 6 characters");

    try {
      setSubmitting(true);

      await api.patch("/organizer/change-password", {
        oldPassword,
        newPassword,
      });

      setOkMsg("Password changed successfully");
      setOldPassword("");
      setNewPassword("");

      await onDone();
    } catch (e: any) {
      setApiError(e?.response?.data?.message || "Change password failed");
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

      <div className="relative mx-auto mt-16 w-[520px] max-w-[92vw] bg-white rounded-2xl shadow-2xl border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-lg hover:bg-gray-100 inline-flex items-center justify-center"
            aria-label="Close"
            type="button"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {apiError && (
            <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">
              {apiError}
            </div>
          )}
          {okMsg && (
            <div className="border border-green-200 bg-green-50 text-green-700 rounded-xl px-4 py-3 text-sm">
              {okMsg}
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2">Old Password *</p>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2">New Password *</p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
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
            {submitting ? "Saving..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
