import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set - Stripe features will not work');
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true })
  : null;

export async function createCheckoutSession(params: {
  orderId: string;
  orderNumber: string;
  amount: number;
  customerEmail: string;
  documentType: string;
  propertyAddress: string;
}) {
  if (!stripe) throw new Error('Stripe is not configured');

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: params.customerEmail,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(params.amount * 100),
          product_data: {
            name: `Deed Preparation - ${params.documentType}`,
            description: `Property: ${params.propertyAddress}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      orderId: params.orderId,
      orderNumber: params.orderNumber,
    },
    success_url: `${process.env.NEXTAUTH_URL}/portal/orders/${params.orderId}?payment=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/wizard?step=review&orderId=${params.orderId}`,
  });

  return session;
}
