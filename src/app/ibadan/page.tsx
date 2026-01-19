'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Ticket, Calendar, MapPin, Users, Star, Crown, Zap, ArrowRight, Clock, CheckCircle2, Building2, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'

const TICKET_TIERS = [
  {
    id: 'regular',
    name: 'Regular',
    price: 5000,
    description: 'Standard access to event',
    features: [
      'Event entry',
      'General seating area',
      'Access to main venue',
      'Digital ticket delivery'
    ],
    icon: Ticket,
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-500'
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 30000,
    description: 'Premium experience with exclusive perks',
    features: [
      'Priority entrance',
      'Premium seating area',
      'Exclusive VIP lounge access',
      'Complimentary drinks',
      'Meet and greet opportunity',
      'Digital ticket delivery'
    ],
    icon: Crown,
    color: 'bg-amber-500',
    borderColor: 'border-amber-500',
    popular: true
  },
  {
    id: 'gang_of_5',
    name: 'Gang of 5',
    price: 20000,
    description: 'Group package for 5 people',
    features: [
      '5 tickets included',
      'Group seating arrangement',
      'Entry for your entire squad',
      'Discounted rate per person (₦4,000)',
      'Digital ticket delivery'
    ],
    icon: Users,
    color: 'bg-purple-500',
    borderColor: 'border-purple-500',
    isGroup: true
  }
]

export default function IbadanPage() {
  const router = useRouter()
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleBuyTicket = (tierId: string) => {
    const tier = TICKET_TIERS.find(t => t.id === tierId)
    if (!tier) return

    setSelectedTier(tierId)

    // Store selected tier and city in localStorage
    const tierToStore = {
      ...tier,
      icon: tierId,
      city: 'Ibadan'
    }
    localStorage.setItem('selectedTicketTier', JSON.stringify(tierToStore))

    toast({
      title: 'Ticket tier selected',
      description: `You selected ${tier.name} ticket tier for Ibadan. Proceeding to checkout...`,
    })

    // Redirect to checkout page
    window.location.href = '/checkout?city=ibadan'
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  const eventDate = new Date()
  eventDate.setDate(eventDate.getDate() + 31)

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
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              Back to Home
            </Button>
            <div className="flex items-center">
  <img
    src="https://raw.githubusercontent.com/DannyYo696/svillage/7c466bf2c8e9b34724c7e49168765b0b77f308a0/Nightflix%20L1.png"
    alt="Nightflix Logo"
    className="h-30 w-auto"
  />
</div>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Section */}
        <section className="text-center mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Zap className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-semibold text-purple-500">Ibadan Edition • Limited Tickets Available</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Nightflix Inc.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mt-2">
              Ibadan Experience
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Experience the ultimate night of entertainment in the ancient city. Join us for an unforgettable event at Ibadan's premier venue!
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base text-slate-300 mb-12">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <span>Saturday, February 14, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <span>5:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-500" />
              <span>Ibadan, Nigeria</span>
            </div>
          </div>

          {/* Venue Details */}
          <Card className="max-w-2xl mx-auto mb-8 bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/20 shrink-0">
                  <Building2 className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-white mb-2">Venue: University of Ibadan Conference Center</h3>
                  <p className="text-sm text-slate-400 mb-2">University of Ibadan, Ibadan</p>
                  
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            size="lg"
            onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-purple-500/25"
          >
            Get Your Ibadan Tickets
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </section>

        {/* Ticket Tiers Section */}
        <section id="tickets" className="mb-16 sm:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Choose Your Ibadan Experience</h2>
            <p className="text-slate-400 text-lg">Select the perfect ticket tier for your Nightflix Ibadan experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {TICKET_TIERS.map((tier) => {
              const Icon = tier.icon
              const pricePerPerson = tier.isGroup ? Math.round(tier.price / 5) : tier.price

              return (
                <Card
                  key={tier.id}
                  className={`relative bg-slate-900/50 border-slate-800 hover:border-${tier.color.split('-')[1]}-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${tier.borderColor}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 font-semibold shadow-lg">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${tier.color} mb-4 mx-auto shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white">{tier.name}</CardTitle>
                    <CardDescription className="text-slate-400 mt-2">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-center py-4">
                      <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                        ₦{tier.price.toLocaleString()}
                      </div>
                      {tier.isGroup && (
                        <div className="text-sm text-slate-400">
                          ₦{pricePerPerson.toLocaleString()} per person (5 tickets)
                        </div>
                      )}
                    </div>

                    <Separator className="bg-slate-800" />

                    <ul className="space-y-3">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() => handleBuyTicket(tier.id)}
                      disabled={isProcessing}
                      className={`w-full bg-gradient-to-r ${tier.color.replace('bg-', 'from-')} to-${tier.color.split('-')[1]}-600 hover:from-${tier.color.split('-')[1]}-600 hover:to-${tier.color.split('-')[1]}-700 text-white font-semibold py-6 text-lg shadow-lg`}
                    >
                      {isProcessing && selectedTier === tier.id ? (
                        'Processing...'
                      ) : (
                        <>
                          Buy {tier.name} Ticket
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Ibadan-Specific About Section */}
        <section id="about" className="mb-16 sm:mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">Why Nightflix Ibadan?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <Star className="h-12 w-12 text-purple-500 mb-4" />
                  <CardTitle className="text-xl text-white">Cultural Fusion Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">
                    Experience a unique blend of traditional and contemporary entertainment. The Ibadan edition celebrates the rich cultural heritage of the ancient city.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <Users className="h-12 w-12 text-pink-500 mb-4" />
                  <CardTitle className="text-xl text-white">Connect with Pacesetters</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">
                    Network with Ibadan's movers and shakers. From entrepreneurs to creatives, meet people who are shaping the city's future.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <MapPin className="h-12 w-12 text-emerald-500 mb-4" />
                  <CardTitle className="text-xl text-white">Historic UI Venue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">
                    Hosted at the prestigious University of Ibadan Conference Center. A venue that combines academic excellence with modern entertainment facilities.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <Ticket className="h-12 w-12 text-amber-500 mb-4" />
                  <CardTitle className="text-xl text-white">Affordable Luxury</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">
                    Premium entertainment at Ibadan prices. Experience world-class production value and performances at a fraction of Lagos prices.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Getting There Section */}
        <section id="getting-there" className="mb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">Getting There</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <Navigation className="h-8 w-8 text-purple-500 mb-3" />
                  <CardTitle className="text-lg text-white">By Car</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400">
                    Free parking available at UI campus. 10 minutes from Bodija, 20 minutes from Challenge area.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <Users className="h-8 w-8 text-pink-500 mb-3" />
                  <CardTitle className="text-lg text-white">Ride-Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400">
                    Uber and Bolt drivers familiar with UI campus. Direct drop-off at the conference center entrance.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <Building2 className="h-8 w-8 text-emerald-500 mb-3" />
                  <CardTitle className="text-lg text-white">Public Transport</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400">
                    Commercial buses and taxis available to Bodija and Challenge. Short commute from any part of the city.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Ticket className="h-6 w-6 text-rose-500" />
              <span className="text-lg font-bold text-white">Nightflix Ibadan</span>
            </div>
            <p className="text-sm text-slate-400 text-center sm:text-left">
              © 2025 Nightflix. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
