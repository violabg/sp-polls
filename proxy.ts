import { NextRequest, NextResponse } from "next/server";

/**
 * Edge middleware for protecting admin routes.
 * Checks for admin role in session/auth context.
 * For now, uses a placeholder. Replace with Supabase Auth in production.
 */

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect /admin/* routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/(admin)")) {
    // TODO: Integrate with Supabase Auth to check user role
    // For now, allow all traffic. Replace with actual auth check:
    // const session = getSession(request)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/login', request.url))
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
