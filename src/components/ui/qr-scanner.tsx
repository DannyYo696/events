'use client'

import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface QrScannerProps {
  onScan: (result: string | null) => void
  onError: (error: any) => void
}

export default function QrScanner({ onScan, onError }: QrScannerProps) {
  const qrRegionRef = useRef<HTMLDivElement>(null)
  const qrCodeRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    if (!qrRegionRef.current) return

    const qrCode = new Html5Qrcode(qrRegionRef.current.id)
    qrCodeRef.current = qrCode

    const startScanning = async () => {
      try {
        await qrCode.start(
          { facingMode: 'environment' }, // back camera on mobile
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScan(decodedText)
          },
          (error) => {
            // html5-qrcode throws frequent "no QR found" errors — ignore those
            if (!error?.includes?.('No QR code found')) {
              console.warn('QR scan error:', error)
            }
          }
        )
      } catch (err) {
        console.error('Failed to start QR scanner:', err)
        onError(err)
      }
    }

    startScanning()

    return () => {
      qrCode
        .stop()
        .then(() => qrCode.clear())
        .catch(() => {})
    }
  }, [onScan, onError])

  return (
    <div
      id="qr-reader"
      ref={qrRegionRef}
      className="w-full rounded-lg overflow-hidden"
      style={{ maxWidth: '400px' }}
    />
  )
}
