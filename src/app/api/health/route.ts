import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', app: 'sfornami', timestamp: new Date().toISOString() });
}
