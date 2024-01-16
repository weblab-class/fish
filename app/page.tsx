"use client";

import NextAuthProvider from "@/services/next-auth/NextAuthProvider";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function TitlePage() {
  return (
    <NextAuthProvider>
      <TitleContent />
    </NextAuthProvider>
  );
}

function TitleContent() {
  const session = useSession();

  return (
    <div>
      <button onClick={() => signIn("google")}>Sign In With Google</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
