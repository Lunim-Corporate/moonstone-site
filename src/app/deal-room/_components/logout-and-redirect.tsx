"use client";

import { signOut } from "next-auth/react";

export default function LogoutAndRedirect() {
  const handleLogout = () => {
    // Sign out and redirect to deal room (which will show the auth form)
    signOut({ callbackUrl: "/deal-room", redirect: true });
  };

  const handleCancel = () => {
    // Log out and redirect to home page
    signOut({ callbackUrl: "/", redirect: true });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">

        {/* Content */}
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Not Allowed</h3>
          <p className="text-sm text-gray-600 mb-6">
            Your current subscription tier doesn&apos;t have access to the Deal Room.
            You can sign in with a different account that has the required tier.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-(--cta-color) text-(--black-primary-color) rounded text-sm font-medium hover:bg-(--cta-color)/70 transition-colors"
            >
              Sign in with different account
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
