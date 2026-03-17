import { NextResponse } from "next/server";
import { pool } from '@/lib/db';

export async function GET() {
  const result = await pool.query('SELECT * FROM vacancy');

  return NextResponse.json(result.rows);
}