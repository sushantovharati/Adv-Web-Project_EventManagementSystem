"use client";

import { useEffect, useMemo, useState } from "react";
import Pusher from "pusher-js";
import { Bell, X } from "lucide-react";

type NotiType = "event" | "attendee" | "system";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: NotiType;
  time: string; 
};

function timeAgo(iso: string) {
  const t = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - t);

  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export default function OrganizerNotifications({
  organizerId,
  onRefetch,
}: {
  organizerId: number;
  onRefetch?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [toast, setToast] = useState<NotificationItem | null>(null);

  const unreadCount = useMemo(() => items.length, [items]);

  const pushNoti = (n: Omit<NotificationItem, "id">) => {
    const item: NotificationItem = {
      ...n,
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    };

    setItems((prev) => [item, ...prev].slice(0, 20)); // keep last 20
    setToast(item);

    // auto close toast
    window.clearTimeout((pushNoti as any)._t);
    (pushNoti as any)._t = window.setTimeout(() => setToast(null), 3000);
  };

  console.log("PUSHER subscribe => organizerId:", organizerId);

  useEffect(() => {
    if (!organizerId) return;

    const key = process.env.NEXT_PUBLIC_PUSHER_KEY!;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER!;

    const pusher = new Pusher(key, { cluster });

    const channelName = `organizer-${organizerId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("event.created", (data: any) => {
      pushNoti({
        title: "Event Created",
        message: data?.title ? `New event: ${data.title}` : (data?.message ?? "Event created"),
        type: "event",
        time: data?.createdAt ?? new Date().toISOString(),
      });
      onRefetch?.();
    });

    channel.bind("attendee.created", (data: any) => {
      pushNoti({
        title: "Attendee Added",
        message:
          data?.name
            ? `Added attendee: ${data.name}`
            : (data?.message ?? "Attendee added"),
        type: "attendee",
        time: data?.createdAt ?? new Date().toISOString(),
      });
      onRefetch?.();
    });

    // optional (future): event.updated / event.deleted / attendee.deleted
    channel.bind("event.updated", (data: any) => {
      pushNoti({
        title: "Event Updated",
        message: data?.title ? `Updated: ${data.title}` : (data?.message ?? "Event updated"),
        type: "event",
        time: data?.updatedAt ?? new Date().toISOString(),
      });
      onRefetch?.();
    });

    channel.bind("event.deleted", (data: any) => {
      pushNoti({
        title: "Event Deleted",
        message: data?.message ?? "Event deleted",
        type: "event",
        time: new Date().toISOString(),
      });
      onRefetch?.();
    });

    channel.bind("attendee.deleted", (data: any) => {
      pushNoti({
        title: "Attendee Removed",
        message: data?.message ?? "Attendee removed",
        type: "attendee",
        time: new Date().toISOString(),
      });
      onRefetch?.();
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizerId]);

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-3 w-[380px] rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div>
              <p className="text-sm font-semibold text-gray-900">Notifications</p>
              <p className="text-xs text-gray-500">Channel: organizer-{organizerId}</p>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={() => setItems([])}
                  className="text-xs text-gray-600 hover:text-gray-900"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="max-h-[360px] overflow-auto">
            {items.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-sm text-gray-600">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Create an event/attendee from another tab to see live updates.
                </p>
              </div>
            ) : (
              <ul className="divide-y">
                {items.map((n) => (
                  <li key={n.id} className="px-4 py-3 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{timeAgo(n.time)}</p>
                      </div>

                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${
                          n.type === "event"
                            ? "border-blue-200 text-blue-700 bg-blue-50"
                            : n.type === "attendee"
                            ? "border-green-200 text-green-700 bg-green-50"
                            : "border-gray-200 text-gray-700 bg-gray-50"
                        }`}
                      >
                        {n.type}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Toast (top-right style) */}
      {toast && (
        <div className="fixed right-6 top-6 z-[60] w-[360px] rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          <div className="px-4 py-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
              <p className="text-sm text-gray-600 mt-0.5">{toast.message}</p>
              <p className="text-xs text-gray-400 mt-1">{timeAgo(toast.time)}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-gray-100"
              aria-label="Close toast"
            >
              <X className="h-4 w-4 text-gray-700" />
            </button>
          </div>
          <div className="h-1 bg-blue-600" />
        </div>
      )}
    </div>
  );
}
