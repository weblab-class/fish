import { redirect } from "next/navigation";

import LuciaSessionProvider from "@/services/lucia/LuciaSessionProvider";
import { getPageSession } from "@/services/lucia/functions";
import { mongooseConnect } from "@/services/mongo/connnections";


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


  return <LuciaSessionProvider session={session}>{children}</LuciaSessionProvider>;
}
