import Link from "next/link";
import { ShieldCheck, Lock, Database, Mail } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function PrivacyPolicyPage() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#EDF4FE]">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Privacy Policy
            </h1>
          </div>

          <p className="mt-4 text-gray-600 max-w-3xl leading-relaxed">
            This Privacy Policy explains how CampusEvents collects, uses, and
            protects your information when you use our website and services.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Last updated: <span className="font-medium">January 17, 2026</span>
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 space-y-10">
          {/* 1 */}
          <PolicyBlock
            icon={<Database size={18} className="text-blue-600" />}
            title="1) Information We Collect"
          >
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Account details such as name, email, phone number, and basic
                profile information (when you register).
              </li>
              <li>
                Event-related data such as events you create, join, or manage.
              </li>
              <li>
                Technical data like browser type, device information, and basic
                usage analytics to improve performance and experience.
              </li>
            </ul>
          </PolicyBlock>

          {/* 2 */}
          <PolicyBlock
            icon={<Lock size={18} className="text-green-600" />}
            title="2) How We Use Your Information"
          >
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and maintain the CampusEvents service.</li>
              <li>To authenticate users and keep accounts secure.</li>
              <li>To manage event features and user interactions.</li>
              <li>To improve features, performance, and user experience.</li>
              <li>
                To communicate important updates or support responses when you
                contact us.
              </li>
            </ul>
          </PolicyBlock>

          {/* 3 */}
          <PolicyBlock
            icon={<ShieldCheck size={18} className="text-purple-600" />}
            title="3) Data Protection & Security"
          >
            <p className="text-gray-600 leading-relaxed">
              We use reasonable security practices to protect your information.
              This may include access control, authentication, and secure data
              storage. However, no online system can be guaranteed 100% secure.
            </p>
          </PolicyBlock>

          {/* 4 */}
          <PolicyBlock
            icon={<Database size={18} className="text-teal-600" />}
            title="4) Data Sharing"
          >
            <p className="text-gray-600 leading-relaxed">
              We do not sell your personal information. We may share limited
              information only when necessary to operate the platform (for
              example, hosting providers) or to comply with legal obligations.
            </p>
          </PolicyBlock>

          {/* 5 */}
          <PolicyBlock
            icon={<Lock size={18} className="text-orange-600" />}
            title="5) Cookies"
          >
            <p className="text-gray-600 leading-relaxed">
              We may use cookies to support login sessions and improve site
              performance. You can control cookies through your browser settings.
            </p>
          </PolicyBlock>

          {/* 6 */}
          <PolicyBlock
            icon={<Mail size={18} className="text-red-600" />}
            title="6) Contact Us"
          >
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a
                href="mailto:sushantovharati.sv@gmail.com"
                className="text-blue-600 font-semibold hover:underline"
              >
                sushantovharati.sv@gmail.com
              </a>
              .
            </p>

            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-flex rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-50 transition"
              >
                Go to Contact Page
              </Link>
            </div>
          </PolicyBlock>
        </div>
      </section>
    </div>
    </>
  );
}

function PolicyBlock({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>

      <div className="mt-3 text-gray-600">{children}</div>
    </div>
  );
}
