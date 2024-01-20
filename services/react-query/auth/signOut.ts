import axios from "axios";

import { useMutation } from "@tanstack/react-query";

export async function signOut() {
  return await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/logout`);
}

export function useSignOut() {
  return useMutation({
    mutationFn: () => signOut(),
  });
}
