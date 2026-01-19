'use client'

import { useState } from 'react'
import { QrCode, Loader2, CheckCircle2, XCircle, AlertCircle, RefreshCw, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'

interface VerificationResult {
  success: boolean
  verified?: boolean
  message?: string
  error?: string
  status?: string
  paymentStatus?: string
  ticket?: {
    id: string
    ticketCode: string
    tier: string
    quantity: number
    buyerName: string
    buyerEmail: string
    amount?: number
    verificationStatus: string
    verifiedAt?: string
    createdAt?: string
  }
}

export default function VerifyPage() {
  const [ticketCode, setTicketCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleVerify = async () => {
    if (!ticketCode.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Ticket Code',
        description: 'Please enter a ticket code to verify.',
      })
      return
    }

    setIsVerifying(true)
    setResult(null)

    try {
      const response = await fetch('/api/tickets/verify-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketCode: ticketCode.trim() }),
      })

      if (!response.ok) {
        throw new Error('Verification request failed')
      }

      const data: VerificationResult = await response.json()
      setResult(data)

      if (data.success && data.verified) {
        toast({
          title: '✅ Ticket Verified',
          description: data.message || 'Ticket has been verified successfully',
          variant: 'default',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: data.error || 'Ticket could not be verified',
        })
      }
    } catch (error) {
      console.error('Verification error:', error)
      setResult({
        success: false,
        error: 'Failed to verify ticket. Please try again.',
        status: 'ERROR',
      })
      toast({
        variant: 'destructive',
        title: 'Verification Error',
        description: 'An error occurred while verifying the ticket.',
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify()
    }
  }

  const handleReset = () => {
    setTicketCode('')
    setResult(null)
    setShowAdvanced(false)
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'REGULAR':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
      case 'VIP':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30'
      case 'GANG_OF_5':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/30'
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/30'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="h-8 w-8 text-rose-500" />
              <span className="text-xl font-bold text-white">Nightflix</span>
              <span className="text-sm text-slate-400 ml-2">Ticket Verification</span>
            </div>
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              className="text-slate-300 hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Exit
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Verify Ticket
            </h1>
            <p className="text-slate-400">
              Enter or scan the ticket code to verify authenticity
            </p>
          </div>

          {/* Verification Input */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Ticket Code</CardTitle>
              <CardDescription className="text-slate-400">
                Enter the ticket code from the attendee's ticket
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ticketCode" className="text-slate-300">
                  Ticket Code
                </Label>
                <Input
                  id="ticketCode"
                  type="text"
                  value={ticketCode}
                  onChange={(e) => setTicketCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="NF-REG-XXXXXXXX"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 text-lg font-mono focus-visible:ring-rose-500"
                  disabled={isVerifying}
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <QrCode className="mr-2 h-4 w-4" />
                      Verify Ticket
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  disabled={isVerifying}
                  className="border-slate-700 text-white hover:bg-slate-800"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Verification Result */}
          {result && (
            <Card
              className={`border-2 ${
                result.success && result.verified
                  ? 'border-emerald-500/50 bg-emerald-950/20'
                  : result.success
                  ? 'border-amber-500/50 bg-amber-950/20'
                  : 'border-red-500/50 bg-red-950/20'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {result.success && result.verified ? (
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    </div>
                  ) : result.success ? (
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 shrink-0">
                      <AlertCircle className="h-6 w-6 text-amber-500" />
                    </div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 shrink-0">
                      <XCircle className="h-6 w-6 text-red-500" />
                    </div>
                  )}

                  <div className="flex-1">
                    {result.success && result.verified ? (
                      <div>
                        <h3 className="text-xl font-bold text-emerald-500 mb-2">
                          Ticket Verified!
                        </h3>
                        <p className="text-slate-300 mb-4">
                          {result.message || 'This ticket is valid and has been verified.'}
                        </p>

                        {result.ticket && (
                          <div className="space-y-3">
                            <Separator className="bg-slate-700" />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-slate-500 mb-1">Ticket Type</p>
                                <Badge className={getTierBadgeColor(result.ticket.tier)}>
                                  {result.ticket.tier.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 mb-1">Quantity</p>
                                <p className="text-sm font-semibold text-white">
                                  {result.ticket.quantity} ticket(s)
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs text-slate-500 mb-1">Ticket Code</p>
                              <p className="text-sm font-mono font-semibold text-white">
                                {result.ticket.ticketCode}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-500 mb-1">Attendee Name</p>
                              <p className="text-base font-semibold text-white">
                                {result.ticket.buyerName}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-500 mb-1">Email</p>
                              <p className="text-sm text-slate-300">
                                {result.ticket.buyerEmail}
                              </p>
                            </div>

                            {result.ticket.amount && (
                              <div>
                                <p className="text-xs text-slate-500 mb-1">Amount Paid</p>
                                <p className="text-base font-semibold text-rose-500">
                                  ₦{result.ticket.amount.toLocaleString()}
                                </p>
                              </div>
                            )}

                            <Separator className="bg-slate-700" />

                            <div>
                              <p className="text-xs text-slate-500 mb-1">Verified At</p>
                              <p className="text-sm text-slate-300">
                                {result.ticket.verifiedAt ? formatDate(result.ticket.verifiedAt) : 'N/A'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : result.success ? (
                      <div>
                        <h3 className="text-xl font-bold text-amber-500 mb-2">
                          Already Verified
                        </h3>
                        <p className="text-slate-300 mb-4">
                          {result.message || 'This ticket has already been verified.'}
                        </p>

                        {result.ticket && (
                          <div className="space-y-3">
                            <Separator className="bg-slate-700" />
                            
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Ticket Type</p>
                              <Badge className={getTierBadgeColor(result.ticket.tier)}>
                                {result.ticket.tier.replace('_', ' ')}
                              </Badge>
                            </div>

                            <div>
                              <p className="text-xs text-slate-500 mb-1">Attendee Name</p>
                              <p className="text-base font-semibold text-white">
                                {result.ticket.buyerName}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-500 mb-1">Verified At</p>
                              <p className="text-sm text-slate-300">
                                {result.ticket.verifiedAt ? formatDate(result.ticket.verifiedAt) : 'N/A'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-bold text-red-500 mb-2">
                          Verification Failed
                        </h3>
                        <p className="text-slate-300">
                          {result.error || 'This ticket is invalid or could not be verified.'}
                        </p>
                        {result.status && (
                          <p className="text-xs text-slate-500 mt-2">
                            Status: {result.status}
                          </p>
                        )}
                        {result.paymentStatus && (
                          <p className="text-xs text-slate-500 mt-1">
                            Payment Status: {result.paymentStatus}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Verification Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <p className="text-sm text-slate-300">
                  Ask the attendee to show their ticket with the QR code
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <p className="text-sm text-slate-300">
                  Enter the ticket code manually or use a QR scanner
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <p className="text-sm text-slate-300">
                  Click "Verify Ticket" to check authenticity
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <p className="text-sm text-slate-300">
                  Green = Valid, Yellow = Already Verified, Red = Invalid
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-slate-400 text-center">
            © 2025 Nightflix Ticket Verification System
          </p>
        </div>
      </footer>
    </div>
  )
}
