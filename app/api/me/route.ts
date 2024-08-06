import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(
  req:  Request
) {
    const userEmailInHeaders = req.headers.get("x-goog-authenticated-user-email")
    console.log(req.headers)
    return new NextResponse(`${userEmailInHeaders}`, { status: 200 });
}