// middleware.js or _middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(function middleware(req) {
  console.log(req.nextUrl.pathname);
  console.log(req.nextauth.token.role);

  if (
    req.nextauth.token.role === "admin" &&
    req.nextUrl.pathname === "/admin"
  ) {
    return NextResponse.rewrite(new URL("/", req.url));
  }

  if (!req.nextauth?.token?.role) {
    return NextResponse.rewrite(new URL("/Login", req.url));
  }
  //   pages: {
  //     signIn: "/Login", // Redirect to /Login if not authenticated
  //     error: "/error",
  //   },
});

export const config = {
  matcher: ["/dashboard"],
};

// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// const secret = process.env.NEXTAUTH_SECRET;

// export async function middleware(req) {
//   const token = await getToken({ req, secret });

//   if (!token) {
//     // Redirect to login if not authenticated
//     return NextResponse.redirect(new URL('/Login', req.url));
//   }

//   // Your custom role-based logic
//   if (token.role === 'admin' && req.nextUrl.pathname === '/admin') {
//     return NextResponse.rewrite(new URL('/', req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/dashboard/:path*'],
// };
