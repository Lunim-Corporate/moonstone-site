"use client";

import { useEffect, useRef } from "react";

interface AccessAttemptNotifierProps {
  fullName?: string | null;
  email?: string | null;
  nickName?: string | null;
  currentTier?: string | null;
}

export default function AccessAttemptNotifier({
  fullName,
  email,
  nickName,
  currentTier,
}: AccessAttemptNotifierProps) {
  const hasSent = useRef(false);

  useEffect(() => {
    if (hasSent.current) return;
    hasSent.current = true;

    void fetch("/api/deal-room/access-attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        email,
        nickName,
        currentTier,
      }),
    });
  }, [fullName, email, nickName, currentTier]);

  return null;
}
