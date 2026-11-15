import { NextRequest, NextResponse } from 'next/server';
import { ServerData } from '@/lib/serverData';

export async function GET(req: NextRequest) {
  try {
    // 1. Get or create persistent visitor ID (1-year cookie)
    let visitorId = req.cookies.get('sfornami_vid')?.value;
    if (!visitorId) {
      visitorId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `v-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    }

    // 2. Check today's date in Rome timezone (YYYY-MM-DD)
    const todayRome = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Rome',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());

    const lastVisitedDate = req.cookies.get('sfornami_visited_today')?.value;
    const explicitlySkipRecord = req.nextUrl.searchParams.get('record') === 'false';

    // Only record a view if not explicitly skipped AND this visitor hasn't visited today yet
    const hasAlreadyVisitedToday = lastVisitedDate === todayRome;
    const shouldRecordView = !explicitlySkipRecord && !hasAlreadyVisitedToday;

    const stats = await ServerData.getActivityStats(visitorId, shouldRecordView);

    const res = NextResponse.json(stats);

    // Set persistent visitor ID (1 year)
    res.cookies.set('sfornami_vid', visitorId, {
      path: '/',
      maxAge: 365 * 24 * 3600,
      sameSite: 'lax',
      httpOnly: false,
    });

    // Set today's visited cookie (valid for 48 hours to cross midnight cleanly)
    res.cookies.set('sfornami_visited_today', todayRome, {
      path: '/',
      maxAge: 48 * 3600,
      sameSite: 'lax',
      httpOnly: false,
    });

    return res;
  } catch (err) {
    if ((err as any)?.digest?.startsWith('NEXT_')) {
      throw err;
    }
    console.error('API GET /api/stats error:', err);
    return NextResponse.json(
      {
        viewsToday: 1,
        ordersToday: 0,
        totalOrders: 0,
        recentOrders: [],
      },
      { status: 200 }
    );
  }
}
