import { NextRequest, NextResponse } from 'next/server';
import { ServerData } from '@/lib/serverData';
import { CustomCakeConfig } from '@/lib/types';

export async function GET() {
  try {
    const config = await ServerData.getCakeConfig();
    return NextResponse.json(config);
  } catch (err) {
    console.error('API GET /api/cake-config error:', err);
    return NextResponse.json({ error: 'Failed to fetch cake config' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CustomCakeConfig;
    if (!body || !body.cakeTypes || !body.servingsOptions) {
      return NextResponse.json({ error: 'Invalid cake configuration format' }, { status: 400 });
    }
    const saved = await ServerData.saveCakeConfig(body);
    return NextResponse.json({ success: true, config: saved });
  } catch (err) {
    console.error('API POST /api/cake-config error:', err);
    return NextResponse.json({ error: 'Failed to save cake config' }, { status: 500 });
  }
}
