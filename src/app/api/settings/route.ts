import { NextRequest, NextResponse } from 'next/server';
import { ServerData } from '@/lib/serverData';
import { StoreSettings } from '@/lib/types';

export async function GET() {
  try {
    const settings = await ServerData.getSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error('API GET /api/settings error:', err);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as StoreSettings;
    const saved = await ServerData.saveSettings(body);
    return NextResponse.json({ success: true, settings: saved });
  } catch (err) {
    console.error('API POST /api/settings error:', err);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
