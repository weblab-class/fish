"use client";

import { useLuciaSession } from "@/services/lucia/LuciaSessionProvider";
import ReactQueryProvider from "@/services/mongo/react-query/ReactQueryProvider";
import { AnimalSprite } from "@/services/mongo/models";
import { useCreatePlayer } from "@/services/mongo/react-query/mutations";
import axios from "axios";
import { useRef } from "react";
import { useRouter } from "next/router";

export default function TitlePageOnboarding() {
  const router = useRouter();
  const createPlayerMutation = useCreatePlayer();
  // add form values

  return (
    <button onClick={async () => {
      // await createPlayerMutation.mutate( { });
      // if the player successfullly created
      // router.push(`/home/${username here}`)
    }}>
      Bruh
    </button>
  );
}