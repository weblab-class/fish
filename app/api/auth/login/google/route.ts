import * as context from "next/headers";
import type { NextRequest } from "next/server";

import { googleAuth } from "@/services/lucia";

// https://lucia-auth.com/guidebook/github-oauth/nextjs-app/
// Set cookies for Google Auth service.
export const GET = async (_: NextRequest) => {	
	const [url, state] = await googleAuth.getAuthorizationUrl();

	// store state in HTTP ONLY
	context.cookies().set("google_oauth_state", state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 60 * 60
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
};