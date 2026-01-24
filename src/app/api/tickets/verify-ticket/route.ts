import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

    const ticket = await db.ticket.findUnique({
      where: { ticketCode: ticketCode.toUpperCase() },
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

    if (ticket.paymentStatus !== 'COMPLETED') {
      return NextResponse.json({
        success: false,
        error: 'Payment not completed',
        status: 'INVALID',
        paymentStatus: ticket.paymentStatus,
      })
    }

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
          person2Name: ticket.person2Name,
          person2Email: ticket.person2Email,
          verificationStatus: ticket.verificationStatus,
          verifiedAt: ticket.updatedAt,
        },
      })
    }

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
        person2Name: updatedTicket.person2Name,
        person2Email: updatedTicket.person2Email,
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
