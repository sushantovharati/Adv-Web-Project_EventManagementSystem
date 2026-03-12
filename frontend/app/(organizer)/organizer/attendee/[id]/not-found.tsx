import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Attendee not found</h1>
      <p className="text-gray-600">
        This attendee doesn&apos;t exist or you don&apos;t have access.
      </p>

      <Link
        href="/organizer/attendee"
        className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      >
        Back to Attendees
      </Link>
    </div>
  );
}
