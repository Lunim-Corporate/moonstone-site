"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const TECH_SUITE_URL = process.env.NEXT_PUBLIC_TECH_SUITE_URL || "http://localhost:3001";

function ConfirmEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Confirming your email...");

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Invalid confirmation link. No token provided.");
        return;
      }

      try {
        // Call tech-suite confirm-email endpoint
        const response = await fetch(`${TECH_SUITE_URL}/api/auth/confirm-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setMessage(data.message || "Email confirmation failed. The link may have expired.");
          return;
        }

        // Email confirmed successfully
        setStatus("success");
        setMessage("Email confirmed successfully! Redirecting to pitch deck...");

        // Redirect to pitch deck sign-in page (with password entry)
        setTimeout(() => {
          router.push("/deck");
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during email confirmation. Please try again.");
        console.error("Confirmation error:", error);
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          {status === "loading" && (
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
          )}
          {status === "success" && (
            <div className="text-green-500 text-6xl">✓</div>
          )}
          {status === "error" && (
            <div className="text-red-500 text-6xl">✗</div>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-4">
          {status === "loading" && "Confirming Email"}
          {status === "success" && "Email Confirmed!"}
          {status === "error" && "Confirmation Failed"}
        </h1>

        <p className="text-sm mb-6">{message}</p>

        {status === "error" && (
          <div className="space-y-3">
            <button
              onClick={() => router.push("/sign-in")}
              className="bg-(--cta-color) text-(--black-primary-color) px-6 py-2 rounded text-xs uppercase hover:bg-(--cta-color)/70 transition-colors"
            >
              Go to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  );
}
