import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  console.log("Proxy!");

  const session = await auth.api.getSession({ headers: request.headers });
  if (session) return NextResponse.next();

  const url = new URL("/login", process.env.BASE_URL);
  url.searchParams.set("callbackUrl", request.nextUrl.href);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/app/:path*", "/app/"],
};
