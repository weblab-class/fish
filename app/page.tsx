import { getPageSession } from "@/services/lucia/functions";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import TitlePageOnboarding from "./TitlePageOnboarding";
import { redirect } from "next/navigation";
import { mongooseConnect } from "@/services/mongo/connnections";
import TitlePageLogin from "./TitlePageLogin";

/**
 * This is the title page. If you need to render stuff dynamically, use `session`. Any client components should be
 */
export default async function TitlePage() {
  await mongooseConnect();
  const session = await getPageSession();
  // TODO: call database and see if they finished the onboarding process. if they did, then do `redirect()` to the /home/{session.user.id}

  return (
    <div className="flex flex-col gap-5">
      {!session ? <TitlePageLogin /> : <TitlePageOnboarding />}
    </div>
  );
}
