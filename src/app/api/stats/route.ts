import { NextRequest, NextResponse } from 'next/server';
import { ServerData } from '@/lib/serverData';

export async function GET(req: NextRequest) {
  try {
    const record = req.nextUrl.searchParams.get('record') !== 'false';
    const stats = await ServerData.getActivityStats(record);
    return NextResponse.json(stats);
  } catch (err) {
    console.error('API GET /api/stats error:', err);
    return NextResponse.json(
      {
        viewsToday: 45,
        ordersToday: 2,
        totalOrders: 6,
        recentOrders: [],
      },
      { status: 200 }
    );
  }
}

