import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST endpoint to verify a ticket at the venue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticketCode } = body

    if (!ticketCode) {
      return NextResponse.json(
        { error: 'Ticket code is required' },
        { status: 400 }
      )
    }

    // Find the ticket by ticket code
    const ticket = await db.ticket.findUnique({
      where: { ticketCode },
    })

    if (!ticket) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid ticket code',
          status: 'INVALID'
        },
        { status: 404 }
      )
    }

    // Check payment status
    if (ticket.paymentStatus !== 'COMPLETED') {
      return NextResponse.json({
        success: false,
        error: 'Payment not completed',
        status: 'INVALID',
        paymentStatus: ticket.paymentStatus,
      })
    }

    // Check if already verified
    if (ticket.verificationStatus === 'VERIFIED') {
      return NextResponse.json({
        success: true,
        verified: true,
        message: 'Ticket already verified',
        ticket: {
          id: ticket.id,
          ticketCode: ticket.ticketCode,
          tier: ticket.tier,
          quantity: ticket.quantity,
          buyerName: ticket.buyerName,
          buyerEmail: ticket.buyerEmail,
          verificationStatus: ticket.verificationStatus,
          verifiedAt: ticket.updatedAt,
        },
      })
    }

    // Update ticket verification status
    const updatedTicket = await db.ticket.update({
      where: { id: ticket.id },
      data: {
        verificationStatus: 'VERIFIED',
      },
    })

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Ticket verified successfully',
      ticket: {
        id: updatedTicket.id,
        ticketCode: updatedTicket.ticketCode,
        tier: updatedTicket.tier,
        quantity: updatedTicket.quantity,
        buyerName: updatedTicket.buyerName,
        buyerEmail: updatedTicket.buyerEmail,
        verificationStatus: updatedTicket.verificationStatus,
        verifiedAt: updatedTicket.updatedAt,
      },
    })
  } catch (error) {
    console.error('Ticket verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check ticket status (for lookup)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ticketCode = searchParams.get('code')

    if (!ticketCode) {
      return NextResponse.json(
        { error: 'Ticket code is required' },
        { status: 400 }
      )
    }

    // Find the ticket by ticket code
    const ticket = await db.ticket.findUnique({
      where: { ticketCode },
    })

    if (!ticket) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid ticket code',
          status: 'INVALID'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        ticketCode: ticket.ticketCode,
        tier: ticket.tier,
        quantity: ticket.quantity,
        buyerName: ticket.buyerName,
        buyerEmail: ticket.buyerEmail,
        paymentStatus: ticket.paymentStatus,
        verificationStatus: ticket.verificationStatus,
        amount: ticket.amount,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      },
    })
  } catch (error) {
    console.error('Ticket lookup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
