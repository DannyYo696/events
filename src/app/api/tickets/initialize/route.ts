import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/lib/db'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://your-vercel-app.vercel.app'

const TICKET_PRICES: Record<string, number> = {
  REGULAR: 5000,
  VIP: 30000,
  GANG_OF_5: 20000,
  REGULARLY: 10000,
  VIPAKURE: 50000,
  COUPLES: 15000,
}

const TICKET_QUANTITIES: Record<string, number> = {
  REGULAR: 1,
  VIP: 1,
  GANG_OF_5: 5,
  REGULARLY: 1,
  VIPAKURE: 1,
  COUPLES: 2,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, tier, amount } = body

    if (!name || !email || !phone || !tier || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!TICKET_PRICES[tier]) {
      return NextResponse.json({ error: 'Invalid ticket tier' }, { status: 400 })
    }

    const expectedAmount = TICKET_PRICES[tier]
    if (amount !== expectedAmount) {
      return NextResponse.json({ error: 'Invalid amount for selected tier' }, { status: 400 })
    }

    const ticketCode = `NF-${tier.substring(0, 3)}-${uuidv4().substring(0, 8).toUpperCase()}`
    const paymentRef = uuidv4()

    // Create ticket in DB
    const ticket = await db.ticket.create({
      data: {
        ticketCode,
        qrCode: ticketCode,
        tier,
        quantity: TICKET_QUANTITIES[tier],
        buyerName: name,
        buyerEmail: email,
        buyerPhone: phone,
        amount,
        paymentRef,
        paymentStatus: 'PENDING',
        verificationStatus: 'NOT_VERIFIED',
      },
    })

    // Initialize Paystack payment
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // kobo
        reference: paymentRef,
        metadata: {
          ticketId: ticket.id,
          ticketCode,
          tier,
          name,
          phone,
          custom_fields: [
            { display_name: 'Ticket Code', variable_name: 'ticket_code', value: ticketCode },
          ],
        },
        callback_url: `${APP_URL}/success`,
      }),
    })

    const paystackData = await response.json()

    if (!response.ok || !paystackData.data?.authorization_url) {
      console.error('Paystack initialization failed:', paystackData)

      // Clean up DB
      await db.ticket.delete({ where: { id: ticket.id } })
      return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      reference: paymentRef,
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
    })
  } catch (err) {
    console.error('Payment initialization error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
