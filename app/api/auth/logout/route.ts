import { redirect } from "next/navigation";
import * as context from "next/headers";
import type { NextRequest } from "next/server";

import { luciaAuth } from "@/services/lucia";
import { mongooseConnect } from "@/services/mongo/connnections";

export const POST = async (request: NextRequest) => {
  await mongooseConnect();

  const authRequest = luciaAuth.handleRequest(request.method, context);

  // check if user is authenticated
  const session = await authRequest.validate();
  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  // make sure to invalidate the current session!
  await luciaAuth.invalidateSession(session.sessionId);

  // delete session cookie
  authRequest.setSession(null);

  redirect("/");
};
