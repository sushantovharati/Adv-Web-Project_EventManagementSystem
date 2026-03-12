export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-72 bg-gray-200 rounded animate-pulse" />

      <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-3">
        <div className="h-4 w-56 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-52 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-44 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-3">
        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
