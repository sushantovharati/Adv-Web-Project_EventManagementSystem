import Footer from "@/components/layout/Footer";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    {/* <Navbar /> */}
    <html lang="en">
      <body
        className="min-h-screen"
        style={{ backgroundColor: "rgba(220, 231, 250, 1)" }}
      >
        {children}
      </body>
      
    </html>
    <Footer />
    </>
  );
}
