import { authOptions } from "@/services/next-auth";
import NextAuth from "next-auth";

// https://medium.com/@rohitkumarkhatri/next-auth-in-app-router-of-next-js-7df037f7a2ad
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };