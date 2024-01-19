import { getPageSession } from "@/services/lucia/functions";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import TitlePageOnboarding from "./TitlePageOnboarding";
import { redirect } from "next/navigation";
import { mongooseConnect } from "@/services/mongo/connnections";
import TitlePageLogin from "./TitlePageLogin";
import LuciaSessionProvider from "@/services/lucia/LuciaSessionProvider";
import ReactQueryProvider from "@/services/react-query/ReactQueryProvider";
import { getPlayer } from "@/services/react-query";

/**
 * This is the title page. If you need to render stuff dynamically, use `session`. Any client components should be
 * created outside this folder, since this is a server component.
 */
export default async function TitlePage() {
  await mongooseConnect();
  const session = await getPageSession();
  const player = session ? await getPlayer(session.user.uid) : null;
  if (player?.data) redirect(`/home/${player.data.username}`);

  return (
    <div className="flex flex-col gap-5">
      {!session ? (
        <TitlePageLogin />
      ) : (
        <LuciaSessionProvider session={session}>
          <TitlePageOnboarding />
        </LuciaSessionProvider>
      )}
    </div>
  );
}
