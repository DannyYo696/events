'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Mail, Download, QrCode, Ticket, Calendar, MapPin, Clock, Home, Share2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import QRCode from 'react-qr-code'

interface TicketData {
  id: string
  ticketCode: string
  qrCode: string
  tier: string
  quantity: number
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  amount: number
  paymentRef: string
  paymentStatus: string
  verificationStatus: string
  createdAt: string
}

export default function SuccessPage() {
  const router = useRouter()
  const [ticketData, setTicketData] = useState<TicketData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = new URLSearchParams(window.location.search).get('reference')
      
      if (!reference) {
        setError('No payment reference found. Please complete your purchase.')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/tickets/verify?reference=${reference}`)
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify payment')
        }
        
        if (data.success && data.ticket) {
          setTicketData(data.ticket)
          setEmailSent(true)
          
          // Clear localStorage
          localStorage.removeItem('selectedTicketTier')
          localStorage.removeItem('transactionRef')
          localStorage.removeItem('buyerDetails')

          // Show success toast
          setTimeout(() => {
            toast({
              title: '🎉 Purchase Successful!',
              description: data.emailSent 
                ? 'Your ticket has been sent to your email address.' 
                : 'Your ticket is ready! (Email not configured)',
              variant: 'default',
            })
          }, 500)
        } else {
          throw new Error(data.error || 'Payment verification failed')
        }
      } catch (err) {
        console.error('Verification error:', err)
        const errorMessage = err instanceof Error ? err.message : 'Failed to verify your payment'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    verifyPayment()
  }, [router])

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  const handleDownloadTicket = () => {
    toast({
      title: 'Download Ticket',
      description: 'Check your email for the downloadable ticket.',
    })
  }

  const handleShare = async () => {
    const shareData = {
      title: 'My Nightflix Ticket',
      text: `I just got my ticket for Nightflix! See you there! 🎉`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log('Share failed:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: 'Link Copied',
        description: 'Ticket link copied to clipboard.',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/20 mb-4 animate-pulse">
            <QrCode className="h-8 w-8 text-rose-500" />
          </div>
          <p className="text-white text-lg">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <Card className="bg-slate-900/50 border-red-500/50">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Verification Failed</h1>
                <p className="text-slate-400 mb-6">{error}</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/')}
                  className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full border-slate-700 text-white hover:bg-slate-800"
                >
                  Try Again
                </Button>
              </div>

              <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-2">
                  <strong>Note:</strong> If you completed a payment, your ticket should appear. 
                  If you continue to see this error, please contact support with your payment details.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!ticketData) {
    return null
  }

  const tierColors: Record<string, { bg: string; text: string; border: string }> = {
    REGULAR: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30' },
    VIP: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' },
    GANG_OF_5: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/30' },
  }

  const colors = tierColors[ticketData.tier] || tierColors.REGULAR

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-slate-300 hover:text-white"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <div className="flex items-center gap-2">
              <Ticket className="h-8 w-8 text-rose-500" />
              <span className="text-xl font-bold text-white">Nightflix</span>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 mb-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-slate-400 text-lg mb-2">Your ticket has been purchased successfully</p>
            {emailSent && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-500">
                  Ticket details sent to {ticketData.buyerEmail}
                </span>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Ticket Card */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-slate-900 to-slate-900/50 border-slate-800 overflow-hidden">
                <CardHeader className={`border-b ${colors.border} ${colors.bg}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className={`${colors.bg} ${colors.text} border-0 mb-2`}>
                        {ticketData.tier.replace('_', ' ')}
                      </Badge>
                      <CardTitle className="text-xl sm:text-2xl text-white">Nightflix Ticket</CardTitle>
                    </div>
                    <Ticket className={`h-8 w-8 ${colors.text}`} />
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* QR Code */}
                  <div className="flex justify-center p-6 bg-white rounded-xl">
                    <QRCode
                      value={ticketData.ticketCode}
                      size={180}
                      level="H"
                      includeMargin={true}
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Ticket Code</p>
                    <p className="text-sm font-mono font-bold text-white">{ticketData.ticketCode}</p>
                  </div>

                  <Separator className="bg-slate-700" />

                  {/* Ticket Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-rose-500/20 shrink-0">
                        <Calendar className="h-5 w-5 text-rose-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Date & Time</p>
                        <p className="text-sm font-semibold text-white">TBD (Check email)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/20 shrink-0">
                        <MapPin className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Venue</p>
                        <p className="text-sm font-semibold text-white">Lagos, Nigeria</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20 shrink-0">
                        <Ticket className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Ticket Type</p>
                        <p className="text-sm font-semibold text-white">
                          {ticketData.tier.replace('_', ' ')}
                          {ticketData.quantity > 1 && ` (${ticketData.quantity} tickets)`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/20 shrink-0">
                        <Clock className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Purchased On</p>
                        <p className="text-sm font-semibold text-white">{formatDate(ticketData.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  {/* Buyer Details */}
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 font-semibold">ATTENDEE INFORMATION</p>
                    <div>
                      <p className="text-sm text-slate-400">Name</p>
                      <p className="text-base font-semibold text-white">{ticketData.buyerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Email</p>
                      <p className="text-base font-semibold text-white">{ticketData.buyerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Phone</p>
                      <p className="text-base font-semibold text-white">{ticketData.buyerPhone}</p>
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  {/* Payment Details */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500">Amount Paid</p>
                      <p className="text-lg font-bold text-rose-500">₦{ticketData.amount.toLocaleString()}</p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                      {ticketData.paymentStatus}
                    </Badge>
                  </div>

                  <div className="text-xs text-slate-500 text-center">
                    <p>Payment Reference: {ticketData.paymentRef}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Info & Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Important Information */}
              <Card className="bg-gradient-to-br from-rose-900/20 to-slate-900/50 border-rose-800/30">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-rose-500" />
                    Important Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <p className="text-sm text-slate-300">
                        Show this ticket with the QR code at the venue entrance for verification
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <p className="text-sm text-slate-300">
                        Keep this page accessible or save a screenshot for offline access
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <p className="text-sm text-slate-300">
                        A copy of your ticket has been sent to your email address
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <p className="text-sm text-slate-300">
                        Tickets are non-transferable and non-refundable
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-400">
                    If you have any questions or issues with your ticket, please contact our support team.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-400">
                      <span className="font-semibold text-white">Email:</span> support@nightflix.com
                    </p>
                    <p className="text-sm text-slate-400">
                      <span className="font-semibold text-white">Phone:</span> +234 800 000 0000
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleDownloadTicket}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Ticket
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full border-slate-700 text-white hover:bg-slate-800"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Ticket
                </Button>
                <Button
                  onClick={() => router.push('/')}
                  variant="ghost"
                  className="w-full text-slate-400 hover:text-white"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-rose-500" />
              <span className="text-sm font-bold text-white">Nightflix</span>
            </div>
            <p className="text-xs text-slate-400 text-center sm:text-left">
              © 2025 Nightflix. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
