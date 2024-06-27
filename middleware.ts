import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import checkToken from "./lib";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const tokenVerified = await checkToken(token as string);

  if (!token || !tokenVerified) {
    return NextResponse.redirect(new URL("/", request.url));
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/dashboard",
    "/changePassword",
    "/registerAdmin",
    "/dashboard/courses",
    "/dashboard/courses/:courseId*",
    "/dashboard/courses/:courseId*/:taskId*",
  ],
};
