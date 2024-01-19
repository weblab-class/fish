"use client";

import { getPageSession } from "@/services/lucia/functions";
import axios from "axios";
import { RedirectType, redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLuciaSession } from "@/services/lucia/LuciaSessionProvider";
import { useSignOut } from "@/services/react-query/auth";

/**
 * This is only used when the person logs out, as we need to make sure that the session on `TitlePage` gets refreshed,
 * no matter where the user is on the page.
 */
export default function RedirectTitlePage() {
  const router = useRouter();
  const { session } = useLuciaSession();
  const signOutMutation = useSignOut();

  return (
    <div>
      <p>{session?.user.userId ?? "hello"}</p>
      <a
        onClick={() => {
          signOutMutation.mutate();;
          router.replace("/");
        }}
      >
        Sign out
      </a>
    </div>
  );
}
