/**
 * Ensures that the user is signed in 
 */
import { withAuth } from "next-auth/middleware";

/**
 * Automatically detect if the user is signed in or not. 
 * If the user isn't then automatically redirect to the login page.
 */
export default withAuth(
  {
    pages: {
      signIn: "/",
      signOut: "/",
      error: "/error",
    },
  },
);

/**
 * Only match the valid API routes.
 */
export const config = {
  matcher: [
    "/",
    "/home/:path*",
    "/game/:path*"
  ],
}
