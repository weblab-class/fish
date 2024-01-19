import axios from "axios";

import { useMutation } from "@tanstack/react-query";
import { mongooseConnect } from "@/services/mongo";

export async function signOut() {
  await mongooseConnect();

  return await axios.post(`${process.env.DOMAIN}/api/auth/logout`);
}

export function useSignOut() {
  return useMutation({
    mutationFn: () => signOut(),
  });
}
