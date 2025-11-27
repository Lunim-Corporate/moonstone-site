"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { signIn } from "next-auth/react";

function SignInFormContent({ doc }: { doc: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailError("");

    if (!email) {
      setEmailError("You must enter an email address");
      return;
    }

    if (!password) {
      setError("You must enter a password");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
        router.push(callbackUrl);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordMessage("");
    setError("");
    setLoading(true);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();
      setForgotPasswordMessage(data.message);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="py-1">
        <p className="text-xs mb-4 mt-4">
          Enter your email address and we'll send instructions on how to reset
          your password.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-xs">
            {error}
          </div>
        )}

        {forgotPasswordMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-3 text-xs">
            {forgotPasswordMessage}
          </div>
        )}

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label
              htmlFor="forgot-email"
              className="block text-xs font-normal mb-1"
            >
              {doc.data.email_address}
            </label>
            <input
              type="email"
              id="forgot-email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              className="w-full px-3 py-2 rounded border border-[#b5b4b5] bg-white text-[#161616] text-sm focus:outline-none focus:border-[#006f9e] focus:border-2"
              required
            />
          </div>

          <div className="pt-4 mt-3">
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#006f9e] text-white px-8 py-2 rounded text-xs font-bold uppercase hover:bg-[#005580] transition-colors disabled:opacity-50 cursor-pointer"
                style={{ letterSpacing: "0.05em" }}
              >
                {loading ? "SENDING..." : "SEND RESET LINK"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordMessage("");
                  setError("");
                }}
                className="text-[#006f9e] px-4 py-2 rounded text-xs font-bold uppercase hover:underline transition-all cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="py-1">
      <PrismicRichText
        field={doc.data.subheading}
        components={{
          heading2: ({ children }) => (
            <h2 className="text-sm text-center my-4">{children}</h2>
          ),
        }}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-normal mb-1">
            {doc.data.email_address}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            className={`w-full px-3 py-2 rounded border ${
              emailError ? "border-red-500 border-2" : "border-[#b5b4b5]"
            } text-sm focus:outline-none focus:border-[#006f9e] focus:border-2`}
          />
          {emailError && (
            <p className="text-red-500 text-xs mt-1">{emailError}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-xs font-normal mb-1">
            {doc.data.password}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="w-full px-3 py-2 rounded border border-[#b5b4b5] text-sm focus:outline-none focus:border-[#006f9e] focus:border-2"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div className="flex items-center justify-between pt-4 mt-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#03ECF2] text-black px-8 py-2 rounded text-xs font-bold uppercase hover:bg-transparent hover:text-[#03ECF2] cursor-pointer transition-colors disabled:opacity-50 min-w-[100px]"
            style={{ letterSpacing: "0.05em" }}
          >
            {loading ? "SIGNING IN..." : doc.data.sign_in_btn || "SIGN IN"}
          </button>

          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-xs font-normal hover:underline transition-all"
          >
            <PrismicNextLink field={doc.data.forget_password} />
          </button>
        </div>
      </form>

      <div
        className="flex justify-center mb-3 -mx-20"
        style={{ marginTop: "1.5rem" }}
      >
        <div className="w-full border-t border-[#B5B4B5]"></div>
      </div>

      <div
        className="flex items-center justify-center gap-3"
        style={{ marginTop: "1.5rem" }}
      >
        <p className="text-xs">{doc.data.no_account}</p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-1.5 text-[#03ECF2] rounded text-xs font-bold uppercase hover:bg-[#03ECF2] hover:text-black transition-colors cursor-pointer"
          style={{ letterSpacing: "0.05em" }}
        >
          {doc.data.create_account_btn || "CREATE ACCOUNT"}
        </button>
      </div>
    </div>
  );
}

export default function SignInForm({ doc }: { doc: any }) {
  return (
    <Suspense
      fallback={<div className="py-1 text-center text-xs">Loading...</div>}
    >
      <SignInFormContent doc={doc} />
    </Suspense>
  );
}
