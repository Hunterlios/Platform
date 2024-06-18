import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import checkToken from "./lib";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const tokenVerified = await checkToken(token as string);
  console.log("tokenVerified: ", tokenVerified);

  if (!token || !tokenVerified) {
    console.log("middleware ACTIVE REDIRECT TO HOME");
    return NextResponse.redirect(new URL("/", request.url));
  } else if (request.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("middleware ACTIVE REDIRECT TO DASHBOARD");
    return NextResponse.rewrite(new URL("/dashboard", request.url));
  }
}

export const config = {
  matcher: ["/dashboard", "/changePassword", "/registerAdmin"],
};