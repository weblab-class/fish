import { type Session, getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from ".";

export async function protectApiRoute(
    successReponse: (session: Session) => Promise<NextResponse>
  ) {
    const session = await getServerSession(authOptions);
    if (session) {
      return successReponse(session);
    }
  
    return NextResponse.json({ status: 401 });
  }