import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { DashboardDonationRecord } from '@/types/dashboard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse<DashboardDonationRecord[] | { error: string }>> {
  try {
    const rows = await sql`
      SELECT
        b.bond_number AS "bondNumber",
        b.donor_name AS "donorName",
        r.title AS "campaignName",
        to_char(b.upload_date AT TIME ZONE 'Asia/Riyadh', 'YYYY/MM/DD') AS "uploadDate",
        b.amount::float8 AS "donationAmount",
        b.verification_status AS "verificationStatus"
      FROM donation_bonds AS b
      INNER JOIN requests AS r ON r.id = b.request_id
      ORDER BY b.upload_date DESC
      LIMIT 100;
    `;

    return NextResponse.json(rows as DashboardDonationRecord[]);
  } catch (error: unknown) {
    console.error('Failed to load dashboard donation bonds:', error);
    return NextResponse.json(
      { error: 'تعذر تحميل بيانات سندات التبرع من قاعدة البيانات.' },
      { status: 500 },
    );
  }
}
