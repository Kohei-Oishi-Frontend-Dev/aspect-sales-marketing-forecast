import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "test return value from API for Get request" });
}

export async function POST(req: Request) {
    const body = await req.json();
    const { name } = body;
    return NextResponse.json({ message: "test return value from API for Post request", data: { name } });
}