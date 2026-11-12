import { NextRequest, NextResponse } from 'next/server';
import { ServerData } from '@/lib/serverData';
import { HomePageContent } from '@/lib/types';

export async function GET() {
  try {
    const content = await ServerData.getHomepageContent();
    return NextResponse.json(content);
  } catch (err) {
    console.error('API GET /api/homepage error:', err);
    return NextResponse.json({ error: 'Failed to fetch homepage content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as HomePageContent;
    const saved = await ServerData.saveHomepageContent(body);
    return NextResponse.json({ success: true, content: saved });
  } catch (err) {
    console.error('API POST /api/homepage error:', err);
    return NextResponse.json({ error: 'Failed to save homepage content' }, { status: 500 });
  }
}
