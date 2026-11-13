import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { DashboardRequestRecord } from '@/types/dashboard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse<DashboardRequestRecord[] | { error: string }>> {
  try {
    const rows = await sql`
      SELECT
        r.reference_number AS "referenceNumber",
        a.name AS "associationName",
        r.title,
        to_char(r.request_date AT TIME ZONE 'Asia/Riyadh', 'YYYY/MM/DD') AS "requestDate",
        r.total_bonds_amount::float8 AS amount,
        r.status
      FROM requests AS r
      INNER JOIN associations AS a ON a.id = r.association_id
      WHERE r.category = 'donation_bonds'
      ORDER BY r.request_date DESC
      LIMIT 100;
    `;

    return NextResponse.json(rows as DashboardRequestRecord[]);
  } catch (error: unknown) {
    console.error('Failed to load dashboard requests:', error);
    return NextResponse.json(
      { error: 'تعذر تحميل بيانات الطلبات من قاعدة البيانات.' },
      { status: 500 },
    );
  }
}
