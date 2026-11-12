import { NextRequest, NextResponse } from 'next/server';
import { ServerData } from '@/lib/serverData';
import { CustomCakeRequest } from '@/lib/types';

export async function GET() {
  try {
    const list = await ServerData.getCakeRequests();
    return NextResponse.json(list);
  } catch (err) {
    console.error('API GET /api/torte error:', err);
    return NextResponse.json({ error: 'Failed to fetch cake requests' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CustomCakeRequest;
    if (!body || !body.customerName) {
      return NextResponse.json({ error: 'Invalid cake request' }, { status: 400 });
    }
    const saved = await ServerData.saveCakeRequest(body);
    return NextResponse.json({ success: true, request: saved });
  } catch (err) {
    console.error('API POST /api/torte error:', err);
    return NextResponse.json({ error: 'Failed to save cake request' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, estimatedQuote } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }
    await ServerData.updateCakeStatus(id, status, estimatedQuote);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API PATCH /api/torte error:', err);
    return NextResponse.json({ error: 'Failed to update cake status' }, { status: 500 });
  }
}
