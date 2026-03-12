"use client";

import Navbar from "@/components/layout/Navbar";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#EDF4FE]">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Contact Us
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl leading-relaxed">
            Have questions, feedback, or need support? Feel free to reach out to
            us. We&apos;re always happy to help and connect with you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Contact Info */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Get in Touch
            </h2>

            <div className="flex items-center gap-3 text-gray-700">
              <Mail size={18} className="text-blue-600" />
              <span>sushantovharati.sv@gmail.com</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Phone size={18} className="text-green-600" />
              <span>(+88) 01601-007474</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <MapPin size={18} className="text-red-600" />
              <span>AIUB, Dhaka, Bangladesh</span>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">
              Our team usually responds within 24 hours on working days.
            </p>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Send Us a Message
            </h2>

            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Write your message here..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
              >
                <Send size={16} />
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
    </>
  );
}
