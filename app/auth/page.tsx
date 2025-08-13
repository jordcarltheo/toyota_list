"use client"

import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { signIn } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      await signIn(email)
      setSent(true)
      toast({
        title: "Check your email",
        description: "We've sent you a magic link to sign in.",
      })
    } catch (error) {
      console.error('Sign in error:', error)
      toast({
        title: "Error",
        description: "Failed to send sign in link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                We&apos;ve sent a magic link to <strong>{email}</strong>. 
                Click the link in your email to sign in.
              </p>
              <Button 
                onClick={() => setSent(false)}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Try Another Email
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sign In to Your Account</CardTitle>
            <p className="text-gray-600">
              Enter your email address and we&apos;ll send you a magic link to sign in.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Magic Link
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <span className="text-blue-600">
                  Just sign in with your email to create one automatically.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
