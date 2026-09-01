"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

export default function RequestAccessButton() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleRequestAccess = async () => {
    if (!session?.user) {
      setMessage({ type: 'error', text: 'Please sign in to request access' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/subscriptions/request-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hub_id: 3, // Moonstone hub ID
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to request access')
      }

      setRequestSent(true)
      setMessage({
        type: 'success',
        text: 'Access request sent! An administrator will review your request.',
      })
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to submit request. Please try again.'
      setMessage({
        type: 'error',
        text: msg,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const buttonLabel = requestSent
    ? 'Request Sent'
    : isLoading
      ? 'Sending Request...'
      : 'Request Access'

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={handleRequestAccess}
        disabled={isLoading || requestSent}
        className="w-full bg-(--cta-color) hover:bg-(--cta-color)/70 disabled:bg-gray-400 text-(--black-primary-color) font-semibold py-3 px-6 rounded-lg transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
      >
        {buttonLabel}
      </button>

      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-900/30 text-green-300 border border-green-700/50'
              : 'bg-red-900/30 text-red-300 border border-red-700/50'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  )
}
