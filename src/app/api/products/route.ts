import { NextRequest, NextResponse } from 'next/server';
import { ServerData } from '@/lib/serverData';
import { Product } from '@/lib/types';

export async function GET() {
  try {
    const products = await ServerData.getProducts();
    return NextResponse.json(products);
  } catch (err) {
    console.error('API GET /api/products error:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // If an array of products is sent, perform a full catalog update / sync
    if (Array.isArray(body)) {
      const updated = await ServerData.setProducts(body as Product[]);
      return NextResponse.json({ success: true, count: updated.length, products: updated });
    }

    // Otherwise upsert a single product
    const product = body as Product;
    if (!product || !product.id || !product.name) {
      return NextResponse.json({ error: 'Invalid product data' }, { status: 400 });
    }

    const saved = await ServerData.saveProduct(product);
    return NextResponse.json({ success: true, product: saved });
  } catch (err) {
    console.error('API POST /api/products error:', err);
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
    }
    await ServerData.deleteProduct(id);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (err) {
    console.error('API DELETE /api/products error:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
