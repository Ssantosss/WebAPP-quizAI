import { NextResponse } from 'next/server';

export async function GET() {
  // In a real app, bundle user data for download.
  return NextResponse.json({ status: 'ok', data: [] });
}
