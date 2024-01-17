import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { mongodbConnect, mongooseConnect } from "../mongo/connnections";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(mongodbConnect()),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      await mongooseConnect();  // ensure that mongoose is connected
  
      session.user.uid = "lol";
      console.log(session);
      console.log(user);
      return session;
    }
  }
};
