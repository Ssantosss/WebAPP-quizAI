import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export async function GET(){
  return NextResponse.json({user: null},{headers:{'Cache-Control':'no-store'}});
}
