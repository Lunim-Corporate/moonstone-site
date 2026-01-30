import Link from "next/link";

const FILES = [
  { label: "PDF", envKey: "PITCH_DECK_PDF_URL" },
  { label: "Keynote", envKey: "PITCH_DECK_KEYNOTE_URL" },
  { label: "PowerPoint", envKey: "PITCH_DECK_POWERPOINT_URL" },
];

export default function PitchDeckDownloads() {
  const availableFiles = FILES.map((file) => ({
    ...file,
    url: process.env[file.envKey],
  }));

  const hasAny = availableFiles.some((file) => !!file.url);

  return (
    <div className="mt-8 rounded p-6" style={{ backgroundColor: "#1a1a1a" }}>
      <h2 className="text-xl mb-4 text-(--cta-color)">Pitch Deck Downloads</h2>
      {!hasAny && (
        <p className="text-sm text-gray-300">
          Documents are being prepared. Please check back soon.
        </p>
      )}
      <div className="grid gap-3 md:grid-cols-3">
        {availableFiles.map((file) => (
          <div key={file.label} className="text-center">
            {file.url ? (
              <Link
                href={file.url}
                target="_blank"
                className="block w-full py-2 rounded bg-(--cta-color) text-(--black-primary-color) hover:bg-(--cta-color)/70 transition-colors"
              >
                Download {file.label}
              </Link>
            ) : (
              <div className="block w-full py-2 rounded bg-gray-700 text-gray-300 cursor-not-allowed">
                {file.label} Coming Soon
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
