import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

const priceMap: Record<string, Record<string, string | undefined>> = {
  premium: {
    month: process.env.PRICE_PREMIUM_MONTH,
    '6mo': process.env.PRICE_PREMIUM_6MO,
    year: process.env.PRICE_PREMIUM_YEAR,
    '2year': process.env.PRICE_PREMIUM_2YEAR,
  },
  pro: {
    month: process.env.PRICE_PRO_MONTH,
    '6mo': process.env.PRICE_PRO_6MO,
    year: process.env.PRICE_PRO_YEAR,
    '2year': process.env.PRICE_PRO_2YEAR,
  },
};

export async function POST(req: NextRequest) {
  const { plan, period } = await req.json();
  const priceId = priceMap[plan]?.[period];
  if (!priceId) {
    return NextResponse.json({ error: 'invalid_price' }, { status: 400 });
  }
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: process.env.STRIPE_SUCCESS_URL || '',
      cancel_url: process.env.STRIPE_CANCEL_URL || '',
    });
    return NextResponse.json({ id: session.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
