'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function VerifyListingPage() {
  const params = useParams()
  const listingId = params.id as string
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [message, setMessage] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const verifyListing = useCallback(async () => {
    try {
      const supabase = createBrowserSupabaseClient()
      
      // Get the verification token from URL params
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      
      if (!token) {
        setStatus('error')
        setMessage('Invalid verification link. No token provided.')
        return
      }

      // Verify the token and update listing status
      const { data: tokenData, error: tokenError } = await supabase
        .from('listing_verification_tokens')
        .select('*, listings(*)')
        .eq('token', token)
        .eq('used', false)
        .single()

      if (tokenError || !tokenData) {
        setStatus('error')
        setMessage('Invalid or expired verification link.')
        return
      }

      // Check if token is expired
      if (new Date() > new Date(tokenData.expires_at)) {
        setStatus('expired')
        setMessage('This verification link has expired. Please request a new one.')
        return
      }

      // Update listing status to active
      const { error: updateError } = await supabase
        .from('listings')
        .update({ status: 'active' })
        .eq('id', listingId)

      if (updateError) {
        setStatus('error')
        setMessage('Failed to activate listing. Please try again.')
        return
      }

      // Mark token as used
      await supabase
        .from('listing_verification_tokens')
        .update({ used: true })
        .eq('id', tokenData.id)

      setStatus('success')
      setMessage('Your listing has been successfully verified and is now live!')
      
    } catch (error) {
      console.error('Verification error:', error)
      setStatus('error')
      setMessage('An error occurred during verification. Please try again.')
    }
  }, [listingId])

  useEffect(() => {
    if (listingId) {
      verifyListing()
    }
  }, [listingId, verifyListing])

  const handleRetry = () => {
    setIsVerifying(true)
    verifyListing()
    setTimeout(() => setIsVerifying(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Verify Your Listing
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
              <p className="text-gray-600 dark:text-gray-300">
                Verifying your listing...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-green-600 dark:text-green-400 font-medium">
                {message}
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                View Your Listing
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="text-red-600 dark:text-red-400">
                {message}
              </p>
              <Button 
                onClick={handleRetry}
                disabled={isVerifying}
                variant="outline"
                className="w-full"
              >
                {isVerifying ? 'Retrying...' : 'Try Again'}
              </Button>
            </div>
          )}

          {status === 'expired' && (
            <div className="space-y-4">
              <XCircle className="h-12 w-12 text-orange-500 mx-auto" />
              <p className="text-orange-600 dark:text-orange-400">
                {message}
              </p>
              <Button 
                onClick={() => window.location.href = '/sell'}
                className="w-full"
              >
                Create New Listing
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
