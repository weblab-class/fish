import { OAuthRequestError } from "@lucia-auth/oauth";
import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";

import { luciaAuth, googleAuth } from "@/services/lucia";
import { mongooseConnect } from "@/services/mongo";

// modified from https://lucia-auth.com/guidebook/github-oauth/nextjs-app/

export const GET = async (req: NextRequest) => {
  const storedState = cookies().get("google_oauth_state")?.value;
  const url = new URL(req.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  // validate state and make sure google oauth exists
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    await mongooseConnect();

    const { getExistingUser, googleUser, createUser } =
      await googleAuth.validateCallback(code);

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const user = await createUser({
        attributes: {
          uid: googleUser.sub,
        },
      });
      return user;
    };

    const user = await getUser();
    const session = await luciaAuth.createSession({
      userId: user.userId,
      attributes: {},
    });

    // set session so that auth state changes
    const authRequest = luciaAuth.handleRequest(req.method, {
      cookies,
      headers,
    });
    authRequest.setSession(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/", // redirect to home 
      },
    });
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      return new Response(e.message, {
        status: 400,
      });
    }

    console.error(e);
    return new Response(null, {
      status: 500,
    });
  }
};
