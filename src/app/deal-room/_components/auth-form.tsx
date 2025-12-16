"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import { signIn } from "next-auth/react";

interface AuthFormContentProps {
  defaultToCreateAccount?: boolean;
  message?: string;
}

function AuthFormContent({ defaultToCreateAccount = false, message }: AuthFormContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  const activeClass = "inset-ring-2 inset-ring-cyan-300/60 scale-105";
  const inactiveClass = "bg-transparent";

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
        setError("Invalid email or password");
      } else {
        // Refresh to re-check authentication and subscription
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
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

      // Auto sign-in after registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but sign-in failed. Please try signing in.");
      } else {
        // Refresh to re-check authentication and subscription
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {message && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded text-center">
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}
      <div className="p-8 inset-ring-1 inset-ring-cyan-300/20 rounded backdrop-blur-xl">
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
            <h2 className="mb-2 text-xl">Already have an account?</h2>
            <p className="mb-6 text-sm">Sign in to access the deal room</p>
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
            <h2 className="mb-2 text-xl">New here?</h2>
            <p className="mb-6 text-sm">Create an account to get started</p>
          </div>
        </div>

        {/* Sign In Form */}
        {showSignIn && (
          <form onSubmit={handleSignIn} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-xs">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs mb-1">
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
                className={`w-full px-3 py-2 rounded border ${
                  emailError ? "border-red-500 border-2" : ""
                } text-white text-sm bg-transparent`}
                required
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs mb-1">
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
                className="w-full px-3 py-2 rounded border text-sm bg-transparent text-white"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-(--cta-color) text-(--black-primary-color) px-4 py-2 rounded text-xs uppercase hover:bg-(--cta-color)/70 transition-colors disabled:opacity-50 cursor-pointer tracking-[0.05rem]"
              >
                {loading ? "SIGNING IN..." : "SIGN IN"}
              </button>
            </div>
          </form>
        )}

        {/* Create Account Form */}
        {!showSignIn && (
          <form onSubmit={handleCreateAccount} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-xs">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="full-name" className="block text-xs font-normal mb-1">
                Full Name
              </label>
              <p className="uppercase mb-1 text-gray-400 text-xs">
                At least your first name and your last name
              </p>
              <input
                type="text"
                id="full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded border text-sm bg-transparent text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="nick-name" className="block text-xs font-normal mb-1">
                What shall we call you?
              </label>
              <p className="uppercase mb-1 text-gray-400 text-xs">
                Just one word - a first name or nickname etc.
              </p>
              <input
                type="text"
                id="nick-name"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                className="w-full px-3 py-2 rounded border text-sm bg-transparent text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="create-email" className="block text-xs font-normal mb-1">
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
                className={`w-full px-3 py-2 rounded border ${
                  emailError ? "border-red-500 border-2" : ""
                } text-white text-sm bg-transparent`}
                required
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>

            <div>
              <label htmlFor="create-password" className="block text-xs mb-1">
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
                className="w-full px-3 py-2 rounded border text-sm bg-transparent text-white"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-(--cta-color) text-(--black-primary-color) px-4 py-2 rounded text-xs uppercase hover:bg-(--cta-color)/70 transition-colors disabled:opacity-50 cursor-pointer tracking-[0.05rem]"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default function AuthForm({ defaultToCreateAccount = false, message }: { defaultToCreateAccount?: boolean; message?: string }) {
  return (
    <Suspense fallback={<div className="text-center text-xs">Loading...</div>}>
      <AuthFormContent defaultToCreateAccount={defaultToCreateAccount} message={message} />
    </Suspense>
  );
}
