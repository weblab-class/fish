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

  const {
    register: registerInvite,
    handleSubmit: handleInvite,
    resetField: resetInvite,
    formState: { isSubmitting: isInviteLoading },
  } = useForm<{ inviteUsername: string }>();

  const {
    register: registerJoin,
    handleSubmit: handleJoin,
    resetField: resetJoin,
    formState: { isSubmitting: isJoinLoading },
  } = useForm<{ joinUsername: string }>();

  const router = useRouter();
  const [setDefault] = useHomeStore((state) => [state.setDefault]);
  const [isMulti, setIsMulti] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [guestNotFound, setGuestNotFound] = useState(false);
  const [hostNotFound, setHostNotFound] = useState(false);
  const [errorText, setErrorText] = useState("");

  const onInviteSubmit: SubmitHandler<{ inviteUsername: string }> = async (
    data,
  ) => {
    const username = data.inviteUsername;
    const { data: guest } = await getPlayerByUsername(username);
    if (!guest) throw new Error("Invalid user!"); // TODO add error message to form
    if (!guest[0]) {
      setGuestNotFound(true);
      setTimeout(() => setGuestNotFound(false), 1000);
    } else {
      await sendInviteMutation.mutateAsync({
        hostId: hostId,
        guestId: guest[0]._id.toString(),
      });
      resetInvite("inviteUsername");

      refetchHostRoom();
    }
  };
  const onJoinSubmit: SubmitHandler<{ joinUsername: string }> = async ({
    joinUsername,
  }) => {
    // router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/home/${joinUsername}`);
    const { data: host } = await getPlayerByUsername(joinUsername);
    if (!host) throw new Error("Invalid user!"); // TODO add error message to form
    if (!host[0]) {
      setHostNotFound(true);
      setErrorText("User does not exist");
      setTimeout(() => setHostNotFound(false), 1000);
    } else {
      window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN}/home/${joinUsername}`;
      resetJoin("joinUsername");
      setDefault();
    }

    // setDefault();
  };
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
  }, [JSON.stringify(guestListIds)]); // TODO optimize calls AND fix removal of whitelist
  return (
    <div className="absolute z-20 flex h-4/5 w-5/6 gap-10 rounded-3xl bg-[url(/backgrounds/tanBg.png)] bg-cover p-7 shadow-xl shadow-stone-600 outline-8 outline-amber-900">
      <form
        className="-left-1/4 w-1/2 "
        onSubmit={handleInvite(onInviteSubmit)}
      >
        <div className="h-full w-full rounded-3xl bg-[url('/backgrounds/whiteBg.png')] p-4">
          <p className="h-fit w-full text-5xl text-red-950 underline">
            Add Player&apos;s to Guest List
          </p>
          <p className="text-2xl text-red-900">
            Control who can visit your habitat!
          </p>
          {guestNotFound && (
            <p className="w-full text-center text-2xl text-red-500">
              User does not exist
            </p>
          )}
          <input
            className="h-16 w-3/4 rounded-xl p-2 text-2xl text-black outline-red-900"
            placeholder="Enter player's username"
            autoComplete="off"
            required
            minLength={1}
            {...registerInvite("inviteUsername")}
          />

          <button className="ml-2 mt-4 h-14 w-28 rounded-3xl bg-[url('/backgrounds/redBg.png')] text-3xl text-white outline-white hover:bg-[url('/backgrounds/pinkBg.png')] hover:outline">
            Invite
          </button>

          <p className="mt-4 h-fit w-full text-4xl text-red-950 underline">
            Guest List
          </p>
          <div className="text-3xl text-red-950">
            {guests.length ? (
              <ul>
                {guests.map((g) => (
                  <li key={g._id.toString()}>{g.username}</li>
                ))}
              </ul>
            ) : (
              <div>Add your animal friends to your habitat!</div>
            )}
          </div>
        </div>
      </form>

      {isHost && isMulti ? (
        <div className="h-full w-1/2 rounded-3xl bg-[url('/backgrounds/whiteBg.png')] p-4">
          <div className="h-3/4 w-full bg-[url(/icons/sentenceIcon.png)] bg-contain bg-center bg-no-repeat" />

          <div className="flex items-center justify-center">
            <button
              disabled={loading}
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
              {loading ? "Loading..." : "Start Game with Current Visitors"}
            </button>
          </div>
        </div>
      ) : isHost ? (
        <form className="-left-1/4 w-1/2 " onSubmit={handleJoin(onJoinSubmit)}>
          <div className="h-full w-full rounded-3xl bg-[url('/backgrounds/whiteBg.png')] p-4">
            <img src="/icons/strawberryCow.png"></img>
            <p className="h-fit w-full text-5xl text-red-950 underline">
              Visit a Player&apos;s Habitat
            </p>
            <p className="text-2xl text-red-900">
              Make sure you are on the Players Guest List!
            </p>
            <input
              autoComplete="off"
              className="h-16 w-3/4 rounded-xl p-2 text-2xl text-black outline-red-900"
              placeholder="Enter player's username"
              required
              minLength={1}
              {...registerJoin("joinUsername")}
            />
            <button className="ml-2 mt-4 h-14 w-28 rounded-3xl bg-[url('/backgrounds/redBg.png')] text-3xl text-white outline-white hover:bg-[url('/backgrounds/pinkBg.png')] hover:outline">
              Join
            </button>
            {hostNotFound && (
              <p className="w-full text-center text-2xl text-red-500">
                {errorText}
              </p>
            )}
          </div>
        </form>
      ) : (
        <div className="h-full w-1/2 rounded-3xl bg-[url('/backgrounds/whiteBg.png')] p-4">
          <div className="h-3/4 w-full bg-[url(/icons/sentenceIcon.png)] bg-contain bg-center bg-no-repeat" />

          <div className="flex items-center justify-center">
            <button
              disabled={loading}
              className="ml-2 mt-4 h-fit w-fit rounded-2xl bg-[url('/backgrounds/redBg.png')] p-4 text-4xl text-white outline-white hover:bg-[url('/backgrounds/pinkBg.png')] hover:outline"
              onClick={async () => {
                setLoading(true);
                router.push(`${process.env.NEXT_PUBLIC_DOMAIN}`);

                // setDefault();
                window.location.reload();
              }}
            >
              {loading ? "Going Home.." : "Go Home"}
            </button>
          </div>
        </div>
      )}

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
