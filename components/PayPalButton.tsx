'use client'

import { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function PayPalButton({
  invoiceId,
  amount,
  currency = 'USD',
}: {
  invoiceId: string
  amount: number
  currency?: string
}) {
  const router = useRouter()
  const [processing, setProcessing] = useState(false)

  return (
        <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency,
        intent: 'capture',
        // @ts-ignore — SDK accepts this but types are strict
        'buyer-country': 'US',
        // Force sandbox
        environment: process.env.NEXT_PUBLIC_PAYPAL_ENV === 'live' ? 'production' : 'sandbox',
      }}
    >
      <PayPalButtons
        disabled={processing}
        style={{ layout: 'vertical', shape: 'pill', color: 'gold', label: 'pay' }}
        createOrder={async () => {
          try {
            const res = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ invoiceId }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to create order')
            return data.orderId
          } catch (err: any) {
            toast.error(err.message || 'Could not start payment')
            throw err
          }
        }}
        onApprove={async (data) => {
          setProcessing(true)
          try {
            const res = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: data.orderID, invoiceId }),
            })
            const result = await res.json()
            if (!res.ok) throw new Error(result.error || 'Payment failed')

            toast.success('Payment successful! Hire confirmed.')
            router.push('/invoice/success')
          } catch (err: any) {
            toast.error(err.message || 'Payment failed')
          } finally {
            setProcessing(false)
          }
        }}
        onError={(err) => {
          console.error('PayPal error:', err)
          toast.error('PayPal error. Please try again.')
        }}
        onCancel={() => {
          toast.info('Payment cancelled')
        }}
      />
    </PayPalScriptProvider>
  )
}