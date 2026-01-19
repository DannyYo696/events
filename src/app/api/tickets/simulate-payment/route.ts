import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * SIMULATION ENDPOINT FOR TESTING
 * 
 * This endpoint simulates a successful payment flow for testing purposes.
 * Use this instead of the actual Paystack integration when developing.
 * 
 * Usage:
 * 1. Initialize a payment with /api/tickets/initialize
 * 2. Copy the reference from the response
 * 3. Call this endpoint: /api/tickets/simulate-payment?reference=YOUR_REFERENCE
 * 4. Visit /success?reference=YOUR_REFERENCE to see your ticket
 * 
 * FOR PRODUCTION: Remove this endpoint before deploying!
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference parameter is required' },
        { status: 400 }
      )
    }

    console.log('Simulating payment for reference:', reference)

    // Find the ticket by payment reference
    const ticket = await db.ticket.findUnique({
      where: { paymentRef: reference },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found. Please complete a purchase first.' },
        { status: 404 }
      )
    }

    console.log('Found ticket:', ticket.id, 'Current status:', ticket.paymentStatus)

    // Update ticket status to COMPLETED
    const updatedTicket = await db.ticket.update({
      where: { id: ticket.id },
      data: {
        paymentStatus: 'COMPLETED',
      },
    })

    console.log('Payment simulated successfully for ticket:', ticket.id)

    return NextResponse.json({
      success: true,
      message: 'Payment simulated successfully',
      ticket: updatedTicket,
      redirectTo: `/success?reference=${reference}`,
    })
  } catch (error) {
    console.error('Payment simulation error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
