import { NextResponse } from 'next/server';
import { requireAdmin, adminFail } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

// Bare-minimum diagnostic: auth + JSON, no other imports.
// If this crashes, the issue is the route path itself.
export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return adminFail();
  }
  return NextResponse.json({ ok: true, route: 'seed-blog' });
}
