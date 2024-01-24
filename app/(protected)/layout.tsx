import { redirect } from "next/navigation";
import { dehydrate } from "@tanstack/react-query";

import LuciaSessionProvider from "@/services/lucia/LuciaSessionProvider";
import { getPageSession } from "@/services/lucia/functions";
import { mongooseConnect } from "@/services/mongo";
import ReactQueryHydrate from "@/services/react-query/ReactQueryHydrate";
import getQueryClient from "@/services/react-query";
import { pusherClient } from "@/services/pusher";
import { getPlayer } from "@/services/react-query/queries/player";

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
  
  // make sure they logged in
  const session = await getPageSession();
  if (!session) redirect("/");

  // make sure they finished onboarding
  const player = await getPlayer(session.user.uid);
  if (!player.data) redirect("/");

  // initial state is the player
  const queryClient = getQueryClient();
  queryClient.setQueryData(["player", player.data._id], player.data);
  const dehydratedState = dehydrate(queryClient);

  return (
    <LuciaSessionProvider session={session}>
      <ReactQueryHydrate state={dehydratedState}>{children}</ReactQueryHydrate>
    </LuciaSessionProvider>
  );
}
