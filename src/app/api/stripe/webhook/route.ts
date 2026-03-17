import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { sendPaymentReceivedEmail } from '@/lib/email';
import { formatCurrency } from '@/lib/utils';
import type Stripe from 'stripe';

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (!orderId) break;

        // Idempotent check - skip if already processed
        const existingPayment = await db.payment.findUnique({
          where: { stripeSessionId: session.id },
        });

        if (existingPayment?.status === 'succeeded') break;

        // Update payment record
        await db.payment.updateMany({
          where: { stripeSessionId: session.id },
          data: {
            stripePaymentId: session.payment_intent as string,
            status: 'succeeded',
          },
        });

        // Update order
        const order = await db.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            stripePaymentId: session.payment_intent as string,
            paidAt: new Date(),
          },
        });

        await logAudit({
          orderId,
          action: 'payment_confirmed',
          details: {
            stripeSessionId: session.id,
            paymentIntent: session.payment_intent,
            amount: session.amount_total,
          },
        });

        await logAudit({
          orderId,
          action: 'status_changed',
          details: { from: 'PAYMENT_PENDING', to: 'PAID' },
        });

        // Send email
        const amount = session.amount_total ? formatCurrency(session.amount_total / 100) : '';
        await sendPaymentReceivedEmail(order.contactEmail, order.orderNumber, amount).catch(console.error);

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        if (orderId) {
          await db.payment.updateMany({
            where: { stripeSessionId: session.id },
            data: { status: 'failed' },
          });
          await db.order.update({
            where: { id: orderId },
            data: { status: 'SUBMITTED' },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
