import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const protectedRoutes = ["/analytics-dashboard"];
const publicRoutes = ["/login"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );
  const isPublicRoute = publicRoutes.some((p) => path === p);

  const token = req.cookies.get("session")?.value;
  const session = token ? await decrypt(token) : null;

  if (isProtectedRoute && !session?.user_id) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && session?.user_id) {
    return NextResponse.redirect(new URL("/analytics-dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

// Apply to all routes except Next static assets/images and favicon
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};