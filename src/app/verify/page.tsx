'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, AlertTriangle, QrCode, ArrowLeft, Camera, Keyboard, Loader2, User, Mail, Ticket as TicketIcon, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import dynamic from 'next/dynamic'

// Dynamically import QR scanner to avoid SSR issues
const QrScanner = dynamic(() => import('@/components/ui/qr-scanner'), { 
  ssr: false,
  loading: () => <div className="text-center text-white">Loading camera...</div>
})

interface TicketInfo {
  id: string
  ticketCode: string
  tier: string
  quantity: number
  buyerName: string
  buyerEmail: string
  person2Name?: string
  person2Email?: string
  person2Phone?: string
  verificationStatus: string
  verifiedAt?: string
  paymentStatus?: string
}

export default function VerifyTicketsPage() {
  const router = useRouter()
  const [ticketCode, setTicketCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean
    message: string
    ticket?: TicketInfo
    status?: string
  } | null>(null)
  const [scannerEnabled, setScannerEnabled] = useState(false)
  const [activeTab, setActiveTab] = useState('manual')

  const handleVerifyTicket = async (code: string) => {
    if (!code.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a ticket code',
      })
      return
    }

    setIsVerifying(true)
    setVerificationResult(null)

    try {
      const response = await fetch('/api/tickets/verify-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketCode: code.trim() }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setVerificationResult({
          success: true,
          message: data.message,
          ticket: data.ticket,
        })
        toast({
          title: '✅ Valid Ticket',
          description: data.message,
        })
      } else {
        setVerificationResult({
          success: false,
          message: data.error || 'Ticket verification failed',
          status: data.status,
        })
        toast({
          variant: 'destructive',
          title: '❌ Invalid Ticket',
          description: data.error || 'Ticket verification failed',
        })
      }
    } catch (error) {
      console.error('Verification error:', error)
      setVerificationResult({
        success: false,
        message: 'Failed to verify ticket. Please try again.',
      })
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to verify ticket. Please try again.',
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleVerifyTicket(ticketCode)
  }

  const handleScan = (result: string | null) => {
    if (result) {
      console.log('QR Code scanned:', result)
      handleVerifyTicket(result)
      setScannerEnabled(false)
    }
  }

  const handleScanError = (error: any) => {
    console.error('QR scan error:', error)
  }

  const resetVerification = () => {
    setVerificationResult(null)
    setTicketCode('')
  }

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
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <QrCode className="h-8 w-8 text-rose-500" />
              <span className="text-xl font-bold text-white">Verify Tickets</span>
            </div>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ticket Verification</h1>
            <p className="text-slate-400">Scan QR code or enter ticket code to verify</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger value="manual" className="data-[state=active]:bg-rose-500">
                <Keyboard className="mr-2 h-4 w-4" />
                Manual Entry
              </TabsTrigger>
              <TabsTrigger value="scan" className="data-[state=active]:bg-rose-500">
                <Camera className="mr-2 h-4 w-4" />
                Scan QR Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="mt-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Enter Ticket Code</CardTitle>
                  <CardDescription className="text-slate-400">
                    Type the ticket code to verify
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ticketCode" className="text-slate-300">
                        Ticket Code
                      </Label>
                      <Input
                        id="ticketCode"
                        type="text"
                        placeholder="NF-REG-XXXXXXXX"
                        value={ticketCode}
                        onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-rose-500 text-lg font-mono"
                        disabled={isVerifying}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isVerifying || !ticketCode.trim()}
                      className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold py-6"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Verify Ticket
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scan" className="mt-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Scan QR Code</CardTitle>
                  <CardDescription className="text-slate-400">
                    Point your camera at the ticket QR code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!scannerEnabled ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-500/20 mb-6">
                        <Camera className="h-10 w-10 text-rose-500" />
                      </div>
                      <p className="text-slate-400 mb-6">
                        Enable camera to scan QR codes
                      </p>
                      <Button
                        onClick={() => setScannerEnabled(true)}
                        className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white"
                      >
                        <Camera className="mr-2 h-5 w-5" />
                        Enable Camera
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden bg-black">
                        <QrScanner
                          onScan={handleScan}
                          onError={handleScanError}
                        />
                      </div>
                      <Button
                        onClick={() => setScannerEnabled(false)}
                        variant="outline"
                        className="w-full border-slate-700 text-white hover:bg-slate-800"
                      >
                        Stop Camera
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Verification Result */}
          {verificationResult && (
            <Card className={`border-2 ${
              verificationResult.success 
                ? 'bg-emerald-900/20 border-emerald-500/50' 
                : 'bg-red-900/20 border-red-500/50'
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {verificationResult.success ? (
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20">
                        <XCircle className="h-6 w-6 text-red-500" />
                      </div>
                    )}
                    <div>
                      <CardTitle className={`text-xl ${
                        verificationResult.success ? 'text-emerald-500' : 'text-red-500'
                      }`}>
                        {verificationResult.success ? 'Valid Ticket ✓' : 'Invalid Ticket ✗'}
                      </CardTitle>
                      <CardDescription className="text-slate-300 mt-1">
                        {verificationResult.message}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={resetVerification}
                    className="text-slate-400 hover:text-white"
                  >
                    Clear
                  </Button>
                </div>
              </CardHeader>

              {verificationResult.ticket && (
                <CardContent className="space-y-4">
                  <Separator className="bg-slate-700" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Ticket Code</p>
                      <p className="text-sm font-mono font-bold text-white">
                        {verificationResult.ticket.ticketCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Status</p>
                      <Badge className={
                        verificationResult.ticket.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                          : 'bg-slate-500/10 text-slate-500 border-slate-500/30'
                      }>
                        {verificationResult.ticket.verificationStatus}
                      </Badge>
                    </div>
                  </div>

                  {/* Check if it's a couples ticket */}
                  {verificationResult.ticket.tier === 'COUPLE' && verificationResult.ticket.person2Name ? (
                    // Couples Ticket - Show both attendees
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <TicketIcon className="h-5 w-5 text-rose-500" />
                        <p className="text-sm font-semibold text-white">Couples Ticket - 2 Attendees</p>
                      </div>

                      {/* Person 1 */}
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                          <p className="text-xs font-semibold text-rose-500">ATTENDEE 1</p>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-slate-500">Name</p>
                            <p className="text-sm font-semibold text-white">
                              {verificationResult.ticket.buyerName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Email</p>
                            <p className="text-sm font-semibold text-white">
                              {verificationResult.ticket.buyerEmail}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Person 2 */}
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                          <p className="text-xs font-semibold text-rose-500">ATTENDEE 2</p>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-slate-500">Name</p>
                            <p className="text-sm font-semibold text-white">
                              {verificationResult.ticket.person2Name}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Email</p>
                            <p className="text-sm font-semibold text-white">
                              {verificationResult.ticket.person2Email}
                            </p>
                          </div>
                          {verificationResult.ticket.person2Phone && (
                            <div>
                              <p className="text-xs text-slate-500">Phone</p>
                              <p className="text-sm font-semibold text-white">
                                {verificationResult.ticket.person2Phone}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20 shrink-0">
                          <TicketIcon className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500">Ticket Tier</p>
                          <p className="text-sm font-semibold text-white">
                            {verificationResult.ticket.tier} ({verificationResult.ticket.quantity} ticket(s))
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Regular Ticket - Show single attendee
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20 shrink-0">
                          <User className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500">Attendee Name</p>
                          <p className="text-sm font-semibold text-white">
                            {verificationResult.ticket.buyerName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-rose-500/20 shrink-0">
                          <Mail className="h-5 w-5 text-rose-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500">Email</p>
                          <p className="text-sm font-semibold text-white">
                            {verificationResult.ticket.buyerEmail}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/20 shrink-0">
                          <TicketIcon className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500">Ticket Tier</p>
                          <p className="text-sm font-semibold text-white">
                            {verificationResult.ticket.tier} ({verificationResult.ticket.quantity} ticket(s))
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {verificationResult.ticket.verifiedAt && (
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 mt-4">
                      <p className="text-xs text-slate-500 mb-1">Verified At</p>
                      <p className="text-sm text-white">
                        {new Date(verificationResult.ticket.verifiedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          )}

          {/* Info Card */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-slate-900/50 border-blue-800/30 mt-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-white">Verification Guidelines</p>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      <span>Each ticket can only be verified once</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      <span>Ensure the ticket code matches exactly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      <span>Check attendee name and email match records</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-rose-500" />
              <span className="text-sm font-bold text-white">Nightflix Verification</span>
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
