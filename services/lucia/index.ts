import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { mongoose } from "@lucia-auth/adapter-mongoose";
import { google } from "@lucia-auth/oauth/providers";

import { User, Key, Session } from "./models";

/**
 * Authentication used to connect the application.
 */
export const luciaAuth = lucia({
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },
  adapter: mongoose({
    // @ts-ignore
    User,
    Key,
    Session,
  }),

  getUserAttributes: (data) => {
    return {
        uid: data.id,
    }
  }
});
export const googleAuth = google(luciaAuth, {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/login/google/callback`,

})

export type Auth = typeof luciaAuth;
