import { redirect } from "next/navigation";

import LuciaSessionProvider from "@/services/lucia/LuciaSessionProvider";
import { getPageSession } from "@/services/lucia/functions";
import { mongooseConnect } from "@/services/mongo/connnections";
import ReactQueryProvider from "@/services/mongo/react-query/ReactQueryProvider";
import ReactQueryHydrate from "@/services/mongo/react-query/ReactQueryHydrate";
import getQueryClient, { getPlayer } from "@/services/mongo/react-query";
import axios from "axios";
import { dehydrate } from "@tanstack/react-query";
import { Session } from "lucia";


/**
 * Any pages in here will be automatically protected from unauthorized access.
 * To get the session, use `const { session } = useLuciaSession()`.
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await mongooseConnect();
  const session = await getPageSession();
  if (!session) redirect("/");

  // TODO use this to get player and protect this (MAY BREAK)
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await getPlayer(session.user.uid);
    },
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <LuciaSessionProvider session={session}>{children}</LuciaSessionProvider>
    </ReactQueryHydrate>
  );
}
