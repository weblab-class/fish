import { type Session, getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from ".";

export async function protectApiRoute(
    sessionReponse: (session: Session) => Promise<NextResponse>
  ) {
    const session = await getServerSession(authOptions);
    if (session) {
      return sessionReponse(session);
    }
  
    return NextResponse.json("Not authenticated user!", { status: 401 });
  }