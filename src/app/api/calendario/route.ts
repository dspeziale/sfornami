import { NextRequest, NextResponse } from 'next/server';
import { ServerData } from '@/lib/serverData';
import { TimeSlot } from '@/lib/types';

export async function GET() {
  try {
    const slots = await ServerData.getTimeSlots();
    return NextResponse.json(slots);
  } catch (err) {
    console.error('API GET /api/calendario error:', err);
    return NextResponse.json({ error: 'Failed to fetch time slots' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const slots = (await req.json()) as TimeSlot[];
    const saved = await ServerData.saveTimeSlots(slots);
    return NextResponse.json({ success: true, slots: saved });
  } catch (err) {
    console.error('API POST /api/calendario error:', err);
    return NextResponse.json({ error: 'Failed to save time slots' }, { status: 500 });
  }
}
