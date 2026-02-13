"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function RequestAccessButton() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
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

      setMessage({
        type: 'success',
        text: 'Access request submitted! An administrator will review your request.',
      })

      // Refresh server state so the page re-renders with hasRequestedAccess=true
      router.refresh()
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

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={handleRequestAccess}
        disabled={isLoading}
        className="w-full bg-(--cta-color) hover:bg-(--cta-color)/70 disabled:bg-gray-600 text-(--black-primary-color) font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Submitting...' : 'Request Access'}
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
