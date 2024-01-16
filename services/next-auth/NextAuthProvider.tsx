import { SessionProvider } from "next-auth/react";

interface INextAuthProviderProps {
  children: React.ReactNode;
}

export default function NextAuthProvider({ children }: INextAuthProviderProps) {
  return (
    <SessionProvider basePath="/api/next-auth">{children}</SessionProvider>
  );
}
