import { NextRequest, NextResponse } from 'next/server';
import { ServerData } from '@/lib/serverData';
import { Order } from '@/lib/types';

export async function GET() {
  try {
    const orders = await ServerData.getOrders();
    return NextResponse.json(orders);
  } catch (err) {
    console.error('API GET /api/orders error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Order;
    if (!body || !body.orderNumber) {
      return NextResponse.json({ error: 'Invalid order' }, { status: 400 });
    }
    const saved = await ServerData.saveOrder(body);
    return NextResponse.json({ success: true, order: saved });
  } catch (err) {
    console.error('API POST /api/orders error:', err);
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }
    await ServerData.updateOrderStatus(id, status);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API PATCH /api/orders error:', err);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
