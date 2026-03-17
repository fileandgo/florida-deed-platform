import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { createCheckoutSession } from '@/lib/stripe';
import { logAudit } from '@/lib/audit';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await db.order.findFirst({
      where: { id: orderId, userId: session.user.id },
      include: { documentType: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.paidAt) {
      return NextResponse.json({ error: 'Order is already paid' }, { status: 400 });
    }

    const total = Number(order.totalAmount) || 434;

    const checkoutSession = await createCheckoutSession({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: total,
      customerEmail: order.contactEmail,
      documentType: order.documentType?.name || 'Deed Preparation',
      propertyAddress: order.propertyAddress,
    });

    // Update order with Stripe session
    await db.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: checkoutSession.id,
        status: 'PAYMENT_PENDING',
      },
    });

    // Create payment record
    await db.payment.create({
      data: {
        orderId: order.id,
        stripeSessionId: checkoutSession.id,
        amount: total,
        status: 'pending',
      },
    });

    await logAudit({
      orderId: order.id,
      userId: session.user.id,
      action: 'payment_initiated',
      details: { stripeSessionId: checkoutSession.id, amount: total },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
