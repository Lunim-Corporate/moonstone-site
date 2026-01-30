"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

export default function RequestAccessButton() {
  const { data: session } = useSession()
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
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to submit request. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-3 text-gray-900">
          Request Deal Room Access
        </h3>
        <p className="text-gray-700 mb-4 text-sm leading-relaxed">
          You currently have access to the pitch deck. To access the full Deal Room with exclusive
          documents and resources, request access below. An administrator will review your request.
        </p>

        <button
          onClick={handleRequestAccess}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Submitting...' : 'Request Access to Deal Room'}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}
