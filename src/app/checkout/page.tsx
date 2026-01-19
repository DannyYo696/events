'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Loader2, Ticket, CreditCard, User, Mail, Phone, Ticket as TicketIcon, Crown, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'

const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
})

interface TicketTier {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  icon: string
  color: string
  borderColor: string
  isGroup?: boolean
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'regular': TicketIcon,
  'vip': Crown,
  'gang_of_5': Users,
}

export default function CheckoutPage() {
  const router = useRouter()
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  })

  useEffect(() => {
    // Load selected ticket tier from localStorage
    const storedTier = localStorage.getItem('selectedTicketTier')
    if (storedTier) {
      try {
        const tierData = JSON.parse(storedTier)
        // Map icon name to actual icon component if needed
        if (tierData.icon && typeof tierData.icon === 'string') {
          // Icon is already stored as string name
        }
        setSelectedTier(tierData)
      } catch (error) {
        console.error('Error parsing stored tier:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load ticket selection. Please try again.',
        })
        router.push('/')
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'No ticket selected',
        description: 'Please select a ticket tier first.',
      })
      router.push('/')
    }
    setIsLoading(false)
  }, [router])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedTier) {
      toast({
        variant: 'destructive',
        title: 'No ticket selected',
        description: 'Please select a ticket tier first.',
      })
      return
    }

    setIsProcessing(true)

    try {
      // Call the API to initialize payment
      const response = await fetch('/api/tickets/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          tier: selectedTier.id.toUpperCase().replace('-', '_'),
          amount: selectedTier.price,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to initialize payment')
      }

      const data = await response.json()

      // Redirect to Paystack checkout page
      if (data.authorization_url) {
        // Store transaction reference in localStorage
        localStorage.setItem('transactionRef', data.reference)
        localStorage.setItem('buyerDetails', JSON.stringify(values))
        
        window.location.href = data.authorization_url
      } else {
        throw new Error('Payment initialization failed')
      }
    } catch (error) {
      console.error('Payment initialization error:', error)
      toast({
        variant: 'destructive',
        title: 'Payment Error',
        description: 'Failed to initialize payment. Please try again.',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    )
  }

  if (!selectedTier) {
    return null
  }

  // Get the correct icon component
  const IconComponent = iconMap[selectedTier.id] || TicketIcon
  const pricePerPerson = selectedTier.isGroup ? Math.round(selectedTier.price / 5) : selectedTier.price

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
              Back
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
          {/* Page Title */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Complete Your Purchase</h1>
            <p className="text-slate-400">Fill in your details to proceed with payment</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {/* Order Summary */}
            <div className="md:col-span-2 space-y-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${selectedTier.color} shrink-0`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate">{selectedTier.name} Ticket</div>
                      <div className="text-sm text-slate-400">{selectedTier.description}</div>
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Ticket Type</span>
                      <span className="text-white">{selectedTier.name}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Quantity</span>
                      <span className="text-white">{selectedTier.isGroup ? '5 tickets' : '1 ticket'}</span>
                    </div>
                    {selectedTier.isGroup && (
                      <div className="flex justify-between text-sm text-slate-400">
                        <span>Price per person</span>
                        <span className="text-white">₦{pricePerPerson.toLocaleString()}</span>
                      </div>
                    )}
                    <Separator className="bg-slate-700" />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-rose-500">₦{selectedTier.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-4">
                    <CreditCard className="h-4 w-4" />
                    <span>Secured by Paystack</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-900/50 border-emerald-800/30">
                <CardContent className="p-4">
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>Instant ticket delivery via email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>Secure QR code verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>24/7 customer support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Checkout Form */}
            <div className="md:col-span-3">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Your Information</CardTitle>
                  <CardDescription className="text-slate-400">
                    Please provide your details for ticket delivery
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300 flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-rose-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300 flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-rose-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-slate-500">
                              Your ticket will be sent to this email address
                            </p>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300 flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="+234 800 000 0000"
                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-rose-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-slate-500">
                              Used for ticket verification and support
                            </p>
                          </FormItem>
                        )}
                      />

                      <Separator className="bg-slate-700" />

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="terms"
                            required
                            className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-800 text-rose-500 focus:ring-rose-500"
                          />
                          <Label htmlFor="terms" className="text-sm text-slate-300 leading-relaxed cursor-pointer">
                            I agree to the terms and conditions and understand that tickets are non-refundable
                          </Label>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold py-6 text-lg shadow-lg shadow-rose-500/25"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            Pay ₦{selectedTier.price.toLocaleString()}
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-center text-slate-500">
                        Your payment information is secure and encrypted
                      </p>
                    </form>
                  </Form>
                </CardContent>
              </Card>
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
              © 2025 Nightflix. Secure payments powered by Paystack.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
