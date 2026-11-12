import { NextRequest, NextResponse } from 'next/server';
import { PostgresService } from '@/lib/db';

export async function GET() {
  try {
    const creds = await PostgresService.getAdminCredentials();
    return NextResponse.json({ email: creds.email });
  } catch (err) {
    console.error('API /api/admin/credentials GET error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, newEmail, newPassword } = body;

    // 1. Verify credentials for login
    if (action === 'verify' || action === 'login') {
      const creds = await PostgresService.getAdminCredentials();
      const match =
        email.trim().toLowerCase() === creds.email.toLowerCase() &&
        password === creds.passwordHash;

      if (!match) {
        return NextResponse.json({ success: false, error: 'Credenziali non corrette.' }, { status: 401 });
      }

      return NextResponse.json({ success: true, email: creds.email });
    }

    // 2. Change / Update credentials
    if (action === 'update') {
      if (!newEmail || !newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { error: 'Email valida e password di almeno 6 caratteri richieste.' },
          { status: 400 }
        );
      }

      await PostgresService.updateAdminCredentials(newEmail, newPassword);
      return NextResponse.json({ success: true, email: newEmail.trim().toLowerCase() });
    }

    return NextResponse.json({ error: 'Azione non valida.' }, { status: 400 });
  } catch (err) {
    console.error('API /api/admin/credentials POST error:', err);
    return NextResponse.json({ error: 'Errore server durante la modifica credenziali.' }, { status: 500 });
  }
}

