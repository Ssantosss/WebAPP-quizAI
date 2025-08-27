import { NextResponse } from 'next/server';
import Stripe from 'stripe';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any });

export async function POST(req: Request) {
  const { priceId, plan } = await req.json();
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: process.env.STRIPE_SUCCESS_URL!,
    cancel_url: process.env.STRIPE_CANCEL_URL!,
    metadata: { plan },
  });
  return NextResponse.json({ url: session.url }, { headers: { 'Cache-Control': 'no-store' } });
}
