import HomeNavbar from "@/components/layout/HomeNavbar";

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HomeNavbar />
      <main className="min-h-screen bg-blue-50 px-35 py-2">{children}</main>
    </>
  );
}
