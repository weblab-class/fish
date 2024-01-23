"server only";

import * as context from "next/headers";
import type { Session } from "lucia";
import { cache } from "react";
import { NextRequest, NextResponse } from 'next/server';


import { luciaAuth } from "@/services/lucia";
import { mongooseConnect } from "../mongo";
import { CustomErrorCode, ICustomError } from "@/types";

type CachedSessionCallback = () => Promise<Session | null>;

/**
 * Get the current session. This is **server-side**.
 * 
 * @returns A `Promise` to a `Session`. If the user isn't signed in, then this is `null`.
 */
export const getPageSession = cache<CachedSessionCallback>(async () => {
	await mongooseConnect();
	
	const authRequest = luciaAuth.handleRequest("GET", context);
	return authRequest.validate();
});

/**
 * Protect the API route from unauthorized (not logged in) users.
 * 
 * @param req 
 * @param sessionResponse 
 * @returns 
 */
export async function authorizeApiRoute(req: NextRequest, sessionResponse: (session: Session) => Promise<NextResponse>) {
	const authRequest = luciaAuth.handleRequest(req.method, context);
	const session = await authRequest.validate();

	if (session) {
		return await sessionResponse(session);
	}

	return NextResponse.json({ message: "User has not logged in.", code: CustomErrorCode.PLAYER_NOT_AUTHENTICATED } as ICustomError, { status: 403, statusText: "User is not authenticated. Please go back to login."});
}