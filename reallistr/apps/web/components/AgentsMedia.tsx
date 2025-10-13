"use client";
import { useMemo, useState } from "react";

function prettySize(bytes?: number) {
  if (!bytes && bytes !== 0) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export default function AgentsMedia() {
  const [agentsFile, setAgentsFile] = useState<File>();
  const [mediaZip, setMediaZip] = useState<File>();

  const summary = useMemo(() => {
    return {
      agentsName: agentsFile?.name,
      agentsSize: prettySize(agentsFile?.size),
      mediaName: mediaZip?.name,
      mediaSize: prettySize(mediaZip?.size),
    };
  }, [agentsFile, mediaZip]);

  return (
    <div className="space-y-6">
      {/* Intro / purpose */}
      <div className="rounded-2xl border border-gray-200 shadow-sm p-5 bg-white">
        <div className="text-base font-semibold">Upload agents and media</div>
        <div className="text-sm text-gray-600 mt-0.5">
          Upload your agents list and media so listings can be matched instantly.
        </div>
      </div>

      {/* Upload card */}
      <div className="rounded-2xl border border-gray-200 shadow-sm p-5 bg-white">
        <div className="text-base font-semibold">Agents media</div>
        <div className="text-sm text-gray-600 mt-0.5">Upload agents list and optional media ZIP</div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm">
            <span className="block font-medium mb-1">Agents file (.csv / .xlsx)</span>
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              className="block w-full rounded-xl border border-gray-300 p-2"
              onChange={(e) => setAgentsFile(e.target.files?.[0])}
            />
            <div className="mt-1 text-xs text-gray-600">
              CSV must include: <span className="font-medium">Name, Email, Phone, Role</span>
            </div>
            {summary.agentsName && (
              <div className="mt-1 text-xs text-gray-600">Selected: {summary.agentsName} • {summary.agentsSize}</div>
            )}
          </label>

          <label className="text-sm">
            <span className="block font-medium mb-1">Media ZIP (optional)</span>
            <input
              type="file"
              accept=".zip"
              className="block w-full rounded-xl border border-gray-300 p-2"
              onChange={(e) => setMediaZip(e.target.files?.[0])}
            />
            <div className="mt-1 text-xs text-gray-600">
              ZIP should contain images/video. Suggested naming: <span className="font-medium">agentID_filename</span>
            </div>
            {summary.mediaName && (
              <div className="mt-1 text-xs text-gray-600">Selected: {summary.mediaName} • {summary.mediaSize}</div>
            )}
          </label>
        </div>

        {/* Faux progress stub to show professionalism */}
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full w-1/6 bg-gray-300" />
          </div>
          <div className="mt-1 text-xs text-gray-500">Ready to upload • MVP placeholder</div>
        </div>
      </div>

      {/* Compact summary */}
      <div className="rounded-2xl border border-gray-200 shadow-sm p-5 bg-white">
        <div className="text-base font-semibold">Upload summary</div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3">
            <span className="text-gray-600">Agents file</span>
            <span className="font-medium">
              {summary.agentsName ? `${summary.agentsName} • ${summary.agentsSize}` : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3">
            <span className="text-gray-600">Media ZIP</span>
            <span className="font-medium">
              {summary.mediaName ? `${summary.mediaName} • ${summary.mediaSize}` : "—"}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <button
            className="h-11 px-5 rounded-2xl bg-black text-white"
            onClick={() => alert("MVP: files will upload on confirmation")}
          >
            Continue to confirmation →
          </button>
          <div className="text-xs text-gray-600">
            Files remain private. You can replace them anytime before payment.
          </div>
        </div>
      </div>
    </div>
  );
}
