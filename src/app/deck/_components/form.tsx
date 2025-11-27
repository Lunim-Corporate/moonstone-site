"use client"
// Prismic
import { SliceZone } from "@prismicio/react";
// components map is imported inside the client wrapper to avoid passing functions to client components
import { components } from "@/src/slices";
// UI
import { Switch } from "@/components/ui/switch";
// React
import { useState } from "react";

export default function Form({ slices }: { slices: unknown[] }) {
  const [showPasswordForm, setShowPasswordForm] = useState(true);

  return (
    <>
      <div className="text-center py-2">
        <Switch
          checked={showPasswordForm}
          onCheckedChange={(val) => setShowPasswordForm(Boolean(val))}
        />
      </div>
      <SliceZone
        // @ts-expect-error: slices come from Prismic and are compatible with SliceZone
        slices={slices}
        components={components}
        context={showPasswordForm}
      />
    </>
  );
}
