import { NextResponse } from "next/server";

const PRIVATE_ROUTES = [
  "/dashboard",
  "/dashboard/my-requests",
  "/dashboard/add-pet",
  "/dashboard/my-listings",
  "/dashboard/analytics",
  "/dashboard/settings",
];

const PET_DETAIL_PREFIX = "/pets/";

const AUTH_ROUTES = ["/login", "/register"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isPrivateRoute = PRIVATE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  const isPetDetailRoute =
    pathname.startsWith(PET_DETAIL_PREFIX) &&
    pathname.length > PET_DETAIL_PREFIX.length;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

  if ((isPrivateRoute || isPetDetailRoute) && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico|.*\\.webp).*)",
  ],
};
