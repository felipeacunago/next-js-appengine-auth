import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(
  req:  Request
) {
    return new NextResponse(JSON.stringify(req.headers), { status: 200 });
}