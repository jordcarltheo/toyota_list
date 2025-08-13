import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServerClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        
        // Handle seller fee payment
        if (session.metadata?.type === 'seller_fee') {
          const { listing_id, user_id } = session.metadata
          
          // Update payment status
          await supabase
            .from('payments')
            .update({ 
              status: 'paid',
              stripe_checkout_id: session.id
            })
            .eq('listing_id', listing_id)
            .eq('payer_id', user_id)

          // Activate the listing
          await supabase
            .from('listings')
            .update({ status: 'active' })
            .eq('id', listing_id)

          console.log(`Listing ${listing_id} activated for user ${user_id}`)
        }

        // Handle buyer fee payment
        if (session.metadata?.type === 'buyer_fee') {
          const { listing_id, buyer_id, seller_id } = session.metadata
          
          // Create order record
          await supabase
            .from('orders')
            .insert({
              listing_id,
              buyer_id,
              seller_id,
              stripe_payment_intent_id: session.payment_intent as string,
              amount: parseInt(process.env.BUYER_FEE_CENTS || '9900'),
              status: 'paid'
            })

          console.log(`Buyer fee paid for listing ${listing_id} by user ${buyer_id}`)
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
