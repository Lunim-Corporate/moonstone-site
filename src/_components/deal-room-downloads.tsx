"use client";

import { useEffect, useState } from "react";

interface FileEntry {
  name: string;
  url: string | null;
}

export default function DealRoomDownloads() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const listRes = await fetch("/api/documents/available-files?category=deal-room");
        if (!listRes.ok) {
          const data = await listRes.json();
          setError(data.error || "Failed to load documents");
          setLoading(false);
          return;
        }

        const listData = await listRes.json();
        const fileList = listData.data as Array<{ id: string; name: string; type: string }>;

        if (!fileList?.length) {
          setLoading(false);
          return;
        }

        const results = await Promise.all(
          fileList.map(async (file): Promise<FileEntry> => {
            try {
              const urlRes = await fetch("/api/documents/secure-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileId: file.id, category: "deal-room" }),
              });
              if (!urlRes.ok) return { name: file.name, url: null };
              const urlData = await urlRes.json();
              return { name: file.name, url: urlData.data?.url ?? null };
            } catch {
              return { name: file.name, url: null };
            }
          })
        );

        setFiles(results);
      } catch {
        setError("Failed to load documents");
      } finally {
        setLoading(false);
      }
    }

    fetchFiles();
  }, []);

  return (
    <div className="mt-8 rounded p-6" style={{ backgroundColor: "#1a1a1a" }}>
      <h2 className="text-xl mb-4 text-(--cta-color)">Deal Room Documents</h2>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading && <p className="text-sm text-gray-300">Loading...</p>}

      {!loading && !error && files.length === 0 && (
        <p className="text-sm text-gray-300">
          Documents are being prepared. Please check back soon.
        </p>
      )}

      <div className="grid gap-3 md:grid-cols-3">
        {files.map((file) => (
          <div key={file.name} className="text-center">
            {file.url ? (
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2 rounded bg-(--cta-color) text-(--black-primary-color) hover:bg-(--cta-color)/70 transition-colors"
              >
                Download {file.name}
              </a>
            ) : (
              <div className="block w-full py-2 rounded bg-gray-700 text-gray-300 cursor-not-allowed">
                {file.name} — Unavailable
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
