import { NextRequest, NextResponse } from 'next/server';
import { PostgresService } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    if (email) {
      const user = await PostgresService.findCustomerByEmail(email);
      if (!user) {
        return NextResponse.json({ exists: false });
      }
      return NextResponse.json({
        exists: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          city: user.city,
          cap: user.cap,
          notes: user.notes,
        },
      });
    }

    // List all users for admin
    const list = await PostgresService.getCustomers();
    return NextResponse.json(list);
  } catch (err) {
    console.error('API /api/auth/customer GET error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, name, email, phone, password, address, city, cap, notes } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email richiesta' }, { status: 400 });
    }

    if (action === 'login') {
      const user = await PostgresService.findCustomerByEmail(email);
      if (!user) {
        return NextResponse.json({ error: 'Utente non trovato. Registrati per continuare.' }, { status: 404 });
      }
      if (user.passwordHash && password && user.passwordHash !== password) {
        return NextResponse.json({ error: 'Password non corretta.' }, { status: 401 });
      }
      await PostgresService.updateCustomerLastLogin(email);
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          city: user.city,
          cap: user.cap,
          notes: user.notes,
        },
      });
    }

    // Register / Upsert
    if (!name) {
      return NextResponse.json({ error: 'Nome e Cognome richiesti per la registrazione' }, { status: 400 });
    }

    const saved = await PostgresService.registerCustomer({
      name,
      email,
      phone,
      passwordHash: password || undefined,
      address,
      city: city || 'Roma',
      cap: cap || '00156',
      notes,
    });

    return NextResponse.json({
      success: true,
      user: saved,
    });
  } catch (err) {
    console.error('API /api/auth/customer POST error:', err);
    return NextResponse.json({ error: 'Registrazione non riuscita' }, { status: 500 });
  }
}
