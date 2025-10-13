"use client";
import { useMemo, useState } from "react";

function randomToken(len = 24) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export default function ExternalMediaInvite() {
  const [emails, setEmails] = useState("");
  const [context, setContext] = useState("Agency");
  const [note, setNote] = useState("");
  const [expiryDays, setExpiryDays] = useState(7);
  const [singleUse, setSingleUse] = useState(true);
  const [pin, setPin] = useState("");
  const token = useMemo(() => randomToken(), []);
  const url = useMemo(() => `${typeof window !== "undefined" ? window.location.origin : ""}/upload/${token}`, [token]);

  function copyLink() {
    if (navigator?.clipboard?.writeText) navigator.clipboard.writeText(url);
    alert("Link copied (MVP):\n" + url);
  }

  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm p-5 bg-white">
      <div className="text-base font-semibold">Invite media company</div>
      <div className="text-sm text-gray-600 mt-0.5">
        Send a secure link so your media partner can upload images/video.
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm">
          <span className="block font-medium mb-1">Recipient email(s)</span>
          <input
            type="text"
            placeholder="studio@example.com, editor@example.com"
            className="w-full h-11 rounded-xl border border-gray-300 px-3"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
          <div className="mt-1 text-xs text-gray-600">Separate multiple with commas.</div>
        </label>

        <label className="text-sm">
          <span className="block font-medium mb-1">Listing / Agency</span>
          <input
            type="text"
            placeholder="e.g. 24 Ocean Ave, Manly • Smith & Co."
            className="w-full h-11 rounded-xl border border-gray-300 px-3"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </label>

        <label className="text-sm md:col-span-2">
          <span className="block font-medium mb-1">Note (optional)</span>
          <textarea
            className="w-full rounded-xl border border-gray-300 px-3 py-2"
            rows={3}
            placeholder="Any special instructions…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="text-sm">
          <span className="block font-medium mb-1">Expires</span>
          <select
            className="w-full h-11 rounded-xl border border-gray-300 px-3"
            value={expiryDays}
            onChange={(e) => setExpiryDays(parseInt(e.target.value, 10))}
          >
            <option value={3}>3 days</option>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
          </select>
        </label>

        <label className="text-sm flex items-center gap-2">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-gray-300"
            checked={singleUse}
            onChange={(e) => setSingleUse(e.target.checked)}
          />
          <span className="font-medium">Single-use link</span>
        </label>

        <label className="text-sm">
          <span className="block font-medium mb-1">PIN (optional)</span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            className="w-full h-11 rounded-xl border border-gray-300 px-3"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="e.g. 123456"
          />
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200 p-3 text-sm flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1 overflow-hidden">
          <div className="text-gray-600">Generated link (MVP)</div>
          <div className="truncate font-medium">{url}</div>
          <div className="text-xs text-gray-500 mt-1">
            This link will be expiring in {expiryDays} day(s){singleUse ? " • single-use" : ""}{pin ? " • PIN required" : ""}.
          </div>
        </div>
        <div className="flex gap-2">
          <button className="h-10 px-4 rounded-xl border border-gray-300" onClick={copyLink}>Copy link</button>
          <button className="h-10 px-4 rounded-xl bg-black text-white" onClick={() => alert("Invite sent (MVP)")}>Send invite</button>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-600">
        Files are encrypted in transit and scanned on upload. Uploaders can only see their own files.
      </div>
    </div>
  );
}
