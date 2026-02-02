import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secretKey = process.env.JWT_SECRET || "default-dev-secret"
const key = new TextEncoder().encode(secretKey)

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value

  // If trying to access login or register page
  if (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")) {
    if (session) {
      try {
        await jwtVerify(session, key, { algorithms: ["HS256"] })
        // If valid session, redirect to home
        return NextResponse.redirect(new URL("/", request.url))
      } catch (error) {
        // If invalid session, let them go to login
        console.error("Invalid session on auth page check", error)
      }
    }
    return NextResponse.next()
  }

  // Protected routes (home page /)
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    await jwtVerify(session, key, { algorithms: ["HS256"] })
    return NextResponse.next()
  } catch (error) {
    console.error("Invalid session", error)
    // Clear the cookie if invalid and redirect
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("session")
    return response
  }
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*"],
}
