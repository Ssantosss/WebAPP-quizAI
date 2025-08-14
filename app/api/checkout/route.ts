import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';

export const runtime = 'nodejs';
const prices = new Set([
  process.env.PRICE_PREMIUM_MONTH,
  process.env.PRICE_PREMIUM_6MO,
  process.env.PRICE_PREMIUM_YEAR,
  process.env.PRICE_PREMIUM_2YEAR,
  process.env.PRICE_PRO_MONTH,
  process.env.PRICE_PRO_6MO,
  process.env.PRICE_PRO_YEAR,
  process.env.PRICE_PRO_2YEAR,
].filter(Boolean) as string[]);
const schema = z.object({ priceId:z.string(), plan:z.string() });

export async function POST(req:NextRequest){
  const { priceId, plan } = schema.parse(await req.json());
  if(!prices.has(priceId)) return NextResponse.json({error:'invalid_price'},{status:400,headers:{'Cache-Control':'no-store'}});
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,{apiVersion:'2022-11-15'});
  const session = await stripe.checkout.sessions.create({
    mode:'subscription',
    line_items:[{ price:priceId, quantity:1 }],
    success_url: process.env.STRIPE_SUCCESS_URL as string,
    cancel_url: process.env.STRIPE_CANCEL_URL as string,
    metadata:{ plan }
  });
  return NextResponse.json({url: session.url},{headers:{'Cache-Control':'no-store'}});
}
