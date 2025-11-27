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
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [nickName, setNickName] = useState("");
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

    setTimeout(() => {
      setForgotPasswordMessage("Password reset functionality coming soon!");
      setLoading(false);
    }, 1000);
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

    setTimeout(() => {
      console.log("Account creation data:", {
        fullName,
        nickName,
        email,
        password,
      });
      setError("Account creation functionality coming soon!");
      setLoading(false);
    }, 1000);
  };

  if (showCreateAccount) {
    return (
      <div className="py-1">
        <h1 className="text-xl font-bold text-center mb-0 mt-3">Join Us</h1>

        <p className="text-xs mb-4 mt-4">Create account using email:</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div>
            <label
              htmlFor="full-name"
              className="block text-xs font-normal mb-1"
            >
              {doc.data.full_name || "Full name"}
            </label>
            <p className="text-[10px] uppercase mb-1 text-gray-600">
              AT LEAST YOUR FIRST NAME AND YOUR LAST NAME
            </p>
            <input
              type="text"
              id="full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 rounded border border-[#b5b4b5] text-white text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="nick-name"
              className="block text-xs font-normal mb-1"
            >
              {doc.data.nick_name || "What shall we call you?"}
            </label>
            <p className="text-[10px] uppercase mb-1 text-gray-600">
              JUST ONE WORD - A FIRST NAME OR NICKNAME ETC.
            </p>
            <input
              type="text"
              id="nick-name"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
              className="w-full px-3 py-2 rounded border border-[#b5b4b5] text-white text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="create-email"
              className="block text-xs font-normal mb-1"
            >
              {doc.data.email_address}
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
                emailError ? "border-red-500 border-2" : "border-[#b5b4b5]"
              } text-white text-sm`}
              required
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="create-password"
              className="block text-xs font-normal mb-1"
            >
              {doc.data.password}
            </label>
            <input
              type="password"
              id="create-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full px-3 py-2 rounded border border-[#b5b4b5] text-white text-sm"
              required
            />
          </div>

          <div className="pt-4 mt-3">
            <div className="flex gap-3 justify-between">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#03ECF2] text-black px-4 py-2 rounded text-xs font-bold uppercase hover:bg-transparent hover:text-[#03ECF2] transition-colors disabled:opacity-50 cursor-pointer"
                style={{ letterSpacing: "0.05em" }}
              >
                {loading ? "CREATING..." : "CREATE ACCOUNT"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowCreateAccount(false);
                  setError("");
                  setEmailError("");
                  setFullName("");
                  setNickName("");
                  setEmail("");
                  setPassword("");
                }}
                className="px-4 py-2 rounded text-xs font-bold uppercase text-[#03ECF2] transition-all cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        </form>

        <div
          className="flex items-center justify-center gap-3"
          style={{ marginTop: "1.5rem" }}
        >
          <p className="text-xs">Already have an account?</p>
          <button
            onClick={() => {
              setShowCreateAccount(false);
              setError("");
              setEmailError("");
            }}
            className="px-4 py-1.5 text-[#03ECF2] rounded text-xs font-bold uppercase hover:bg-[#03ECF2] hover:text-black transition-colors cursor-pointer"
            style={{ letterSpacing: "0.05em" }}
          >
            SIGN IN
          </button>
        </div>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="py-1">
        <PrismicRichText
          field={doc.data.heading}
          components={{
            heading1: ({ children }) => (
              <h1 className="text-xl font-bold text-center mb-0 mt-3">
                {children}
              </h1>
            ),
          }}
        />

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
              className="w-full px-3 py-2 rounded border border-[#b5b4b5] text-white text-sm"
              required
            />
          </div>

          <div className="pt-4 mt-3">
            <div className="flex gap-3 justify-between">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#03ECF2] text-black px-4 py-2 rounded text-xs font-bold uppercase hover:bg-transparent hover:text-[#03ECF2] transition-colors disabled:opacity-50 cursor-pointer"
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
                className="px-4 py-2 rounded text-xs font-bold uppercase text-[#03ECF2] transition-all cursor-pointer"
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
        field={doc.data.heading}
        components={{
          heading1: ({ children }) => (
            <h1 className="text-xl font-bold text-center mb-0 mt-3">
              {children}
            </h1>
          ),
        }}
      />

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
            } text-white text-sm`}
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
            className="w-full px-3 py-2 rounded border border-[#b5b4b5] text-white text-sm"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div className="flex items-center justify-between pt-4 mt-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#03ECF2] text-black px-4 py-2 rounded text-xs font-bold uppercase hover:bg-transparent hover:text-[#03ECF2] cursor-pointer transition-colors disabled:opacity-50 min-w-[100px]"
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
        className="flex items-center justify-center gap-3"
        style={{ marginTop: "1.5rem" }}
      >
        <p className="text-xs">{doc.data.no_account}</p>
        <button
          onClick={() => setShowCreateAccount(true)}
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
