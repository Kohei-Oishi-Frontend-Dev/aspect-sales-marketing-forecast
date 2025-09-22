import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get the current user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sectors, regions, services } = body;

    // Validate the input
    if (!Array.isArray(sectors) || !Array.isArray(regions) || !Array.isArray(services)) {
      return NextResponse.json(
        { error: "Invalid input format" },
        { status: 400 }
      );
    }

    // Save or update user preferences
    const userPreference = await prisma.userPreference.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        sectors,
        regions,
        services,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        sectors,
        regions,
        services,
      },
    });

    return NextResponse.json({
      success: true,
      preferences: userPreference,
    });
  } catch (error) {
    console.error("Error saving user preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get the current user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user preferences
    const userPreference = await prisma.userPreference.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      preferences: userPreference,
    });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}