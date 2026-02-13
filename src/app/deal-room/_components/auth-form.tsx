"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import { signIn } from "next-auth/react";

interface AuthFormContentProps {
  defaultToCreateAccount?: boolean;
  message?: string;
  variant?: "deal-room" | "deck";
}

function AuthFormContent({
  defaultToCreateAccount = false,
  message,
  variant = "deal-room",
}: AuthFormContentProps) {
  const router = useRouter();
  const [showSignIn, setShowSignIn] = useState<boolean>(!defaultToCreateAccount);
  const signInToggle = useRef<HTMLDivElement | null>(null);
  const createAccountToggle = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [nickName, setNickName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const isDeck = variant === "deck";

  const activeClass = "inset-ring-2 inset-ring-cyan-300/60 scale-105";
  const inactiveClass = "inset-ring-2 inset-ring-cyan-300/10";

  // Keyboard accessibility for toggling forms
  useEffect(() => {
    const handleKeyDownOnSignInToggle = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (!showSignIn) setShowSignIn(true);
      }
    };

    const element = signInToggle.current;
    if (element) element.addEventListener("keydown", handleKeyDownOnSignInToggle);
    return () => {
      if (element) element.removeEventListener("keydown", handleKeyDownOnSignInToggle);
    };
  }, [signInToggle, showSignIn]);

  useEffect(() => {
    const handleKeyDownOnCreateAccountToggle = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (showSignIn) setShowSignIn(false);
      }
    };

    const element = createAccountToggle.current;
    if (element) element.addEventListener("keydown", handleKeyDownOnCreateAccountToggle);
    return () => {
      if (element) element.removeEventListener("keydown", handleKeyDownOnCreateAccountToggle);
    };
  }, [createAccountToggle, showSignIn]);

  const handleSignIn = async (e: React.FormEvent) => {
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
        setError(result.error);
      } else {
        // Refresh to re-check authentication and subscription
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailError("");

    if (!fullName) {
      setError("You must enter your full name");
      return;
    }

    if (!nickName) {
      setError("You must enter a nickname");
      return;
    }

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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: fullName,
          friendly_name: nickName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Show success message for email confirmation
      setRegistrationSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  // Show success message if registration was successful
  if (registrationSuccess) {
    return (
      <div className="rounded p-8" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-(--cta-color)/90 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-(--cta-color)">
            {isDeck ? "Pitch Deck Access Granted" : "Account Created Successfully"}
          </h2>
          <p className="text-md mb-4">
            Thank you for creating an account. Please check your email to confirm your account{isDeck ? " and access the pitch deck" : " and request access to the Deal Room"}.
          </p>
          <p className="text-md text-gray-400 mb-6">
            We&apos;ve sent a confirmation email to <strong>{email}</strong>.<br />
            Click the link in that email.
          </p>
          <button
            onClick={() => {
              setRegistrationSuccess(false);
              setShowSignIn(true);
              setPassword("");
            }}
            className="px-6 py-2 bg-(--cta-color) text-(--black-primary-color) rounded text-md font-medium hover:bg-(--cta-color)/70 transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {message && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded text-center">
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}
      <div className="rounded p-8" style={{ backgroundColor: "#1a1a1a" }}>
        <h1 className="text-center mb-6 text-2xl text-(--cta-color)">Welcome to the Investor Area</h1>
        <div className="flex flex-col md:flex-row justify-around py-6 gap-6 mb-5">
          {/* Sign In toggle */}
          <div
            className={`rounded-2xl p-4 transform transition-transform duration-200 hover:scale-105 focus:scale-105 cursor-pointer ${
              showSignIn ? activeClass : inactiveClass
            }`}
            tabIndex={0}
            ref={signInToggle}
            onClick={() => {
              if (!showSignIn) {
                setShowSignIn(true);
                setError("");
                setEmailError("");
              }
            }}
          >
            <h2 className="mb-2 text-xl text-(--cta-color)">Already have an account?</h2>
            <p className="mb-6 text-m">
              Sign in to access the {isDeck ? "pitch deck" : "deal room"}
            </p>
          </div>
          {/* Create Account Toggle */}
          <div
            className={`rounded-2xl p-4 transform transition-transform duration-200 hover:scale-105 focus:scale-105 cursor-pointer ${
              !showSignIn ? activeClass : inactiveClass
            }`}
            tabIndex={0}
            ref={createAccountToggle}
            onClick={() => {
              if (showSignIn) {
                setShowSignIn(false);
                setError("");
                setEmailError("");
              }
            }}
          >
            <h2 className="mb-2 text-xl text-(--cta-color)">New here?</h2>
            <p className="mb-6 text-m">
              Create an account for immediate access to the pitch deck and/or to request access to all Deal Room documents.
            </p>
          </div>
        </div>

        {/* Sign In Form */}
        {showSignIn && (
          <form onSubmit={handleSignIn} className="max-w-lg mx-auto">
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-white">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                className={`w-full p-2 rounded border ${
                  emailError ? "border-red-500 border-2" : ""
                }`}
                required
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-white">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full p-2 rounded border"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 mt-4 text-left">
                {error}
              </div>
            )}

            <div className="text-left mt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-(--cta-color) text-(--black-primary-color) p-3.5 rounded cursor-pointer hover:bg-(--cta-color)/70 transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
        )}

        {/* Create Account Form */}
        {!showSignIn && (
          <form onSubmit={handleCreateAccount} className="max-w-lg mx-auto">
            {/* Row 1: Full Name and Nickname */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="full-name" className="block mb-2 text-white">
                  Full Name
                </label>
                <input
                  type="text"
                  id="full-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 rounded border"
                  placeholder="First and last name"
                  required
                />
              </div>
              <div>
                <label htmlFor="nick-name" className="block mb-2 text-white">
                  Nickname
                </label>
                <input
                  type="text"
                  id="nick-name"
                  value={nickName}
                  onChange={(e) => setNickName(e.target.value)}
                  className="w-full p-2 rounded border"
                  placeholder="What shall we call you?"
                  required
                />
              </div>
            </div>

            {/* Row 2: Email and Password */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="create-email" className="block mb-2 text-white">
                  Email Address
                </label>
                <input
                  type="email"
                  id="create-email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  className={`w-full p-2 rounded border ${
                    emailError ? "border-red-500 border-2" : ""
                  }`}
                  required
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>
              <div>
                <label htmlFor="create-password" className="block mb-2 text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="create-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full p-2 rounded border"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 mt-4 text-left">
                {error}
              </div>
            )}

            <div className="text-left mt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-(--cta-color) text-(--black-primary-color) p-3.5 rounded cursor-pointer hover:bg-(--cta-color)/70 transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default function AuthForm({
  defaultToCreateAccount = false,
  message,
  variant = "deal-room",
}: {
  defaultToCreateAccount?: boolean;
  message?: string;
  variant?: "deal-room" | "deck";
}) {
  return (
    <Suspense fallback={<div className="text-center text-xs">Loading...</div>}>
      <AuthFormContent
        defaultToCreateAccount={defaultToCreateAccount}
        message={message}
        variant={variant}
      />
    </Suspense>
  );
}
