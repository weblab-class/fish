"use client";

import { useHomeStore } from "@/phaser/stores";
import { useSendInvite } from "@/services/react-query/mutations/player-room";
import { useGetPlayerRoom } from "@/services/react-query/queries/player-room";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  getPlayer,
  getPlayerByUsername,
  useGetPlayerByUsername,
} from "@/services/react-query/queries/player";
import type { Player } from "@/services/mongo/models";
import { Menu, Transition } from "@headlessui/react";
import {
  FaChevronDown,
  FaChevronUp,
  FaPlay,
  FaPlayCircle,
} from "react-icons/fa";
import { getGames } from "@/phaser/settings/functions";

async function getGuests(guestIds: string[]) {
  const guests = await Promise.all(guestIds.map((id) => getPlayer(id)!));

  // filter out any guests that failed fetch
  const filteredGuests = guests.flatMap((g) => (g.data ? [g.data] : []));
  return filteredGuests;
}

interface IInvitePopup {
  hostId: string;
  hostUsername: string;
}

export default function InvitePopup({ hostId, hostUsername }: IInvitePopup) {
  const sendInviteMutation = useSendInvite();
  const { data: hostRoom, refetch: refetchHostRoom } = useGetPlayerRoom(
    hostId,
    false,
  );
  const guestListIds = hostRoom?.data?.whitelist ?? null;
  const [guests, setGuests] = useState<Player[]>([]);

  // console.log(guestListIds, guests);

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

  const onInviteSubmit: SubmitHandler<{ inviteUsername: string }> = async (
    data,
  ) => {
    const username = data.inviteUsername;
    const { data: guest } = await getPlayerByUsername(username);
    if (!guest) throw new Error("Invalid user!"); // TODO add error message to form

    await sendInviteMutation.mutateAsync({
      hostId: hostId,
      guestId: guest[0]._id.toString(),
    });
    resetInvite("inviteUsername");

    refetchHostRoom();
  };
  const onJoinSubmit: SubmitHandler<{ joinUsername: string }> = ({
    joinUsername,
  }) => {
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/home/${joinUsername}`);
    resetJoin("joinUsername");
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
  }, []);

  useEffect(() => {
    // console.log(guestListIds);

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
        <div className="relative h-full w-full rounded-3xl bg-[url('/backgrounds/whiteBg.png')] p-4">
          <p className="h-fit w-full text-5xl text-red-950 underline">
            Add Player&apos;s to Guest List
          </p>
          <p className="text-2xl text-red-900">
            Control who can visit your habitat!
          </p>
          <input
            className="h-16 w-3/4 rounded-xl p-2 text-2xl text-black outline-red-900"
            placeholder="Enter player's username"
            {...registerInvite("inviteUsername")}
          />
          <button className="ml-2 mt-4 h-14 w-28 rounded-3xl bg-[url('/backgrounds/redBg.png')] text-3xl text-white">
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
          <div className="absolute bottom-5 right-5">
            <GameMenuPopover hostUsername={hostUsername} />
          </div>
        </div>
      </form>

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
            className="h-16 w-3/4 rounded-xl p-2 text-2xl text-black outline-red-900"
            placeholder="Enter player's username"
            {...registerJoin("joinUsername")}
          />
          <button className="ml-2 mt-4 h-14 w-28 rounded-3xl bg-[url('/backgrounds/redBg.png')] text-3xl text-white">
            Join
          </button>
        </div>
      </form>
      <div
        className="absolute right-0 top-0 z-30 flex h-16 w-16 items-center justify-center rounded-2xl bg-[url('/backgrounds/redBg.png')] text-3xl text-white hover:cursor-pointer hover:bg-[url('/backgrounds/brightRedBg.png')]"
        onClick={() => {
          setDefault();
        }}
      >
        X
      </div>
    </div>
  );
}

interface IGameMenuPopoverProps {
  hostUsername: string;
}

function GameMenuPopover({ hostUsername }: IGameMenuPopoverProps) {
  const router = useRouter();

  const games = getGames(hostUsername);

  return (
    <Menu>
      {({ open }) => (
        <>
          <Menu.Button className="flex flex-row items-center gap-3 rounded-2xl bg-[url(/backgrounds/brightRedBg.png)] px-4 py-2 text-[25px] text-white">
            🎮 Play a game!
            {!open ? <FaChevronUp /> : <FaChevronDown />}
          </Menu.Button>
          {/** https://headlessui.com/react/menu */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute -top-2 right-0 flex h-max w-64 -translate-y-full transform flex-col gap-3 rounded-xl bg-white">
              {games.map(({ game, desc, redirectLink, requirements }) => (
                <Menu.Item>
                  <div
                    className="active-border group relative h-44 rounded-xl p-3 hover:border-green-400 hover:bg-slate-100"
                    onClick={() => router.push(redirectLink)}
                  >
                    <h1 className="text-2xl">{game}</h1>
                    <p className="block text-lg group-hover:hidden">{desc}</p>
                    <p className="block text-md italic group-hover:hidden">{requirements}</p>
                    <div className="-translate-y-5/12 absolute left-1/2 top-1/2 -translate-x-1/2 transform">
                      <div className="hidden h-fit flex-row items-center justify-end gap-3 text-xl group-hover:flex">
                        <FaPlayCircle scale="0.5" />
                        <p>Let's PLAY!</p>
                      </div>
                    </div>
                  </div>
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
