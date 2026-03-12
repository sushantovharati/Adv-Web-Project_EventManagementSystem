import { CalendarDays } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-[#0B1220] to-[#0E1A2F] text-gray-300">
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

                {/* Brand */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                            <CalendarDays size={20} className="text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-white"> CampusEvents </h2>
                    </div>

                    <p className="text-gray-400 max-w-sm leading-relaxed">
                        A modern platform for seamless event planning and management.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Quick Links
                    </h3>
                    <ul className="space-y-3">
                        <li> <Link href="/about" className="hover:text-white transition"> About Us </Link> </li>
                        <li> <Link href="/contact" className="hover:text-white transition"> Contact </Link> </li>
                        <li> <Link href="/privacy-policy" className="hover:text-white transition"> Privacy Policy </Link> </li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4"> Contact </h3>
                    <ul className="space-y-3 text-gray-400">
                        <li> <a href="mailto:sushantovharati.sv@gmail.com" className="hover:text-white transition" > sushantovharati.sv@gmail.com </a> </li>
                        <li> <a href="tel:+8801601007474" className="hover:text-white transition"> (+88) 01601-007474 </a> </li>
                        <li>AIUB, Dhaka, Bangladesh</li>
                    </ul>
                </div>

            </div>

            <div className="border-t border-white/10">
                <p className="text-center text-sm text-gray-400 py-6">
                    © 2026 CampusEvents. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
