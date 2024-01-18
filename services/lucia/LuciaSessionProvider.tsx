"use client";

import { Session } from "lucia";
import React, { useContext } from "react";

/// CONTEXT
type LuciaSessionContextType = {
  session: Session | null;
};
const LuciaSessionContext = React.createContext<LuciaSessionContextType>({
  session: null,
});

/// COMPONENT
interface ILuciaSessionContextProps {
  children: React.ReactNode;
  session: Session;
}

/**
 * This is for the (protected) layout. DO NOT USE THIS IN OTHER FILES.
 */
export default function LuciaSessionProvider({
  children,
  session,
}: ILuciaSessionContextProps) {
  return (
    <LuciaSessionContext.Provider value={{ session }}>
      {children}
    </LuciaSessionContext.Provider>
  );
}

/**
 * Use this in client components under (protected) to get the Lucia session.
 */
export const useLuciaSession = () => {
  const context = useContext(LuciaSessionContext);

  return context;
}
