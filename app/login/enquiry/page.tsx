"use client";
import { useState } from "react";

export default function EnquiryPage() {
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true); // MVP: pretend submit
  };

  return (
    <main className="mx-auto max-w-3xl p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-semibold">Request preliminary access</h1>
      <p className="text-sm text-gray-600 mt-2">We’ll review and get back to you shortly.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="text-sm">
            <span className="block font-medium mb-1">Agency name</span>
            <input className="h-11 w-full rounded-xl border border-gray-300 px-3" required />
          </label>

          <label className="text-sm">
            <span className="block font-medium mb-1">Contact person</span>
            <input className="h-11 w-full rounded-xl border border-gray-300 px-3" required />
          </label>

          <label className="text-sm">
            <span className="block font-medium mb-1">Email</span>
            <input type="email" className="h-11 w-full rounded-xl border border-gray-300 px-3" required />
          </label>

          <label className="text-sm">
            <span className="block font-medium mb-1">Phone</span>
            <input type="tel" className="h-11 w-full rounded-xl border border-gray-300 px-3" />
          </label>

          <label className="text-sm">
            <span className="block font-medium mb-1">Business type</span>
            <select className="h-11 w-full rounded-xl border border-gray-300 px-3">
              <option>Real Estate</option>
              <option>Commercial</option>
              <option>Finance Organization</option>
              <option>Insurance Business</option>
            </select>
          </label>

          <label className="text-sm">
            <span className="block font-medium mb-1">Market</span>
            <select className="h-11 w-full rounded-xl border border-gray-300 px-3">
              <option>Domestic</option>
              <option>International</option>
            </select>
          </label>

          <label className="text-sm sm:col-span-2">
            <span className="block font-medium mb-1">Website (optional)</span>
            <input type="url" className="h-11 w-full rounded-xl border border-gray-300 px-3" placeholder="https://…" />
          </label>

          <label className="text-sm sm:col-span-2">
            <span className="block font-medium mb-1">Message / notes</span>
            <textarea rows={4} className="w-full rounded-xl border border-gray-300 px-3 py-2" placeholder="Tell us about your agency…" />
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-600">We’ll verify and contact you. This does not create an account yet.</div>
          <button type="submit" className="h-11 px-5 rounded-2xl bg-black text-white">Submit enquiry</button>
        </div>

        {submitted && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">Thanks — a Reallistr team member will contact you to set up preliminary access.</div>
        )}
      </form>
    </main>
  );
}
