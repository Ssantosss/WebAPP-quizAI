import { NextResponse } from 'next/server';

export async function DELETE() {
  // In a real app, delete user data permanently.
  return NextResponse.json({ status: 'deleted' });
}
