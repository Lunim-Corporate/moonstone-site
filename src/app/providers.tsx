"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import Bugsnag from "@bugsnag/js";

let bugsnagStarted = false;

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!bugsnagStarted) {
      Bugsnag.start({
        apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY ?? '125d4e1a653190795d94c6d854a434d4',
      });
      bugsnagStarted = true;
    }
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
