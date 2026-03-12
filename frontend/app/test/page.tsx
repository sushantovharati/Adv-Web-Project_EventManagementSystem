"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function TestPage() {
  const [publicMsg, setPublicMsg] = useState("");
  const [authMsg, setAuthMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Public connection test
  const testPublic = async () => {
    try {
      const res = await api.get("/organizer/test-connection");
      setPublicMsg(res.data.message || "Public connection OK");
    } catch (err: any) {
      setPublicMsg(
        err?.response?.data?.message || "Public connection FAILED"
      );
    }
  };

  // Protected auth test (HttpOnly cookie required)
  const testAuth = async () => {
    try {
      const res = await api.get("/organizer/test-auth");
      setAuthMsg("Authorized ✅ Cookie working");
    } catch (err: any) {
      setAuthMsg("Unauthorized ❌ Login required");
    }
  };

  useEffect(() => {
    setLoading(true);
    testPublic().finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Frontend ↔ Backend Test</h1>

      {loading && <p>Testing public connection...</p>}

      <div className="mb-4">
        <h2 className="font-semibold">Public Test</h2>
        <p className="text-sm text-gray-700">{publicMsg}</p>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold">Protected Test</h2>
        <p className="text-sm text-gray-700">{authMsg}</p>

        <button
          onClick={testAuth}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Test Auth (Cookie)
        </button>
      </div>
    </div>
  );
}
