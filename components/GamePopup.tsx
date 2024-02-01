"use client";

import { useHomeStore } from "@/phaser/stores";
import { useSendInvite } from "@/services/react-query/mutations/player-room";
import { useGetPlayerRoom } from "@/services/react-query/queries/player-room";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  getPlayer,
  getPlayerByUsername,
  useGetPlayerByUsername,
} from "@/services/react-query/queries/player";
import type { Player } from "@/services/mongo/models";
import { pusherClient } from "@/services/pusher";
import { PresenceChannel } from "pusher-js";
import { ISendPlayerDataParams, IRedirectParams } from "@/phaser/types";
import axios from "axios";

interface IInvitePopup {
  hostId: string;
  hostUsername: string;
  isHost: boolean;
}

async function getGuests(guestIds: string[]) {
  const guests = await Promise.all(guestIds.map((id) => getPlayer(id)!));

  // filter out any guests that failed fetch
  const filteredGuests = guests.flatMap((g) => (g.data ? [g.data] : []));
  return filteredGuests;
}

const InvitePopup = ({ hostId, hostUsername, isHost }: IInvitePopup) => {
  const sendInviteMutation = useSendInvite();
  const { data: hostRoom, refetch: refetchHostRoom } = useGetPlayerRoom(
    hostId,
    false,
  );
  const guestListIds = useMemo(
    () => hostRoom?.data?.whitelist ?? null,
    [JSON.stringify(hostRoom?.data?.whitelist ?? null)],
  );
  const [guests, setGuests] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [setDefault] = useHomeStore((state) => [state.setDefault]);
  const [isMulti, setIsMulti] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [guestNotFound, setGuestNotFound] = useState(false);
  const [hostNotFound, setHostNotFound] = useState(false);
  const [errorText, setErrorText] = useState("");

  // closes popup when escape key is pressed
  useEffect(() => {
    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDefault();
      }
    };

    document.addEventListener("keydown", handleEscapePress);

    return () => {
      document.removeEventListener("keydown", handleEscapePress);
    };
  });

  useEffect(() => {
    refetchHostRoom();
    const homeChannel = pusherClient.subscribe(
      `presence-home-${hostUsername}`,
    ) as PresenceChannel;
    if (homeChannel.members.count > 1) setIsMulti(true);
  }, []);

  useEffect(() => {
    (async () => {
      if (guestListIds?.length) {
        setGuests(await getGuests(guestListIds));
        return;
      }

      setGuests([]);
    })();
  }, [JSON.stringify(guestListIds)]);
  return (
    <div className="absolute z-20 flex h-4/5 w-5/6 gap-10 rounded-3xl bg-[url(/backgrounds/tanBg.png)] bg-cover p-7 shadow-xl shadow-stone-600 outline-8 outline-amber-900">
      {isMulti ? (
        <div className="flex h-full w-1/2 items-center justify-center rounded-3xl bg-[url('/backgrounds/whiteBg.png')] p-4 text-5xl text-rose-900">
          Play Sentence Symphony with your current guests! See how to play in
          the Help Menu in the bottom right corner.
        </div>
      ) : (
        <div className="flex h-full w-1/2 items-center justify-center rounded-3xl bg-[url('/backgrounds/whiteBg.png')] p-4 text-center text-5xl text-rose-900">
          Invite friends to play Sentence Symphony! See how to play in the Help
          Menu in the bottom right corner.
        </div>
      )}

      <div className="h-full w-1/2 rounded-3xl bg-[url('/backgrounds/whiteBg.png')] p-4">
        <div className="h-3/4 w-full bg-[url(/icons/sentenceIcon.png)] bg-contain bg-center bg-no-repeat" />

        <div className="flex items-center justify-center">
          <button
            disabled={!(loading && !isMulti)}
            className="ml-2 mt-4 h-fit w-fit rounded-2xl bg-[url('/backgrounds/redBg.png')] p-2 text-4xl text-white outline-white hover:bg-[url('/backgrounds/pinkBg.png')] hover:outline"
            onClick={async () => {
              setLoading(true);
              await axios.post(
                `${process.env.NEXT_PUBLIC_DOMAIN}/api/pusher/shared/redirect`,
                {
                  channelName: `presence-home-${hostUsername}`,
                  redirectLink: `${process.env.NEXT_PUBLIC_DOMAIN}/game/${hostUsername}`,
                } as IRedirectParams,
              );
            }}
          >
            {loading
              ? "Loading..."
              : isMulti
                ? "Start Game with Current Visitors"
                : "Invite Friends to Play"}
          </button>
        </div>
      </div>

      <div
        className="absolute right-0 top-0 z-30 flex h-16 w-16 items-center justify-center rounded-2xl bg-[url('/backgrounds/redBg.png')] text-3xl text-white outline-white hover:cursor-pointer hover:bg-[url('/backgrounds/pinkBg.png')] hover:outline"
        onClick={() => {
          setDefault();
        }}
      >
        X
      </div>
    </div>
  );
};

export default InvitePopup;
