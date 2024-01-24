"use client";

import InvitePopup from "@/components/InvitePopup";
import MailPopup from "@/components/MailPopup";
import { useHomeStore } from "@/phaser/stores";
import dynamic from "next/dynamic";
import Pusher from "pusher-js";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Session } from "lucia";
import { useLuciaSession } from "@/services/lucia/LuciaSessionProvider";
import { useSignOut } from "@/services/react-query/auth";
import { useRouter } from "next/navigation";
import { useGetPlayer } from "@/services/react-query";

// TODO  fix the clouds when you enter the house and then exit

const DynamicComponentWithNoSSR = dynamic(() => import("@/phaser/Game"), {
  ssr: false,
});

export default function Home() {
  const { session } = useLuciaSession();
  const router = useRouter();
  const signOutMutation = useSignOut();
  const {
    data: player,
    isSuccess,
    isError,
    error,
  } = useGetPlayer(session!.user.uid);

  // control display of popups
  const [showInvitePopup, showMailPopup, showPopup, setDefault] = useHomeStore(
    (state) => [
      state.showInvitePopup,
      state.showMailPopup,
      state.showPopup,
      state.setDefault,
    ],
  );
  // control logout
  const [logoutClicked, setLogoutClicked] = useState(false);

  const inviteRef = useRef<HTMLDivElement>(null);
  const mailRef = useRef<HTMLDivElement>(null);

  // handle clicks outside of popups
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (mailRef.current && !mailRef.current.contains(event.target as Node)) ||
        (inviteRef.current && !inviteRef.current.contains(event.target as Node))
      ) {
        console.log(mailRef.current);
        console.log(event.target);
        setDefault();
        console.log("clicked outside");
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  return (
    <main>
      <div className="absolute top-0 z-0 m-0 h-full w-full p-0">
        {player && player.data && (
          <DynamicComponentWithNoSSR
            playerId={player.data._id}
            playerUsername={player.data.username}
            playerAnimalSprite={player.data.animalSprite}
          />
        )}
      </div>

      {/* nav bar */}
      <div></div>
      <div
        className={`${logoutClicked && "pointer-events-none"} absolute inset-y-0 right-0 z-10 h-28 w-96 bg-[url('/objects/logoutCloud.png')] bg-right-top bg-no-repeat hover:z-20 hover:bg-[url('/objects/logoutCloudHover.png')]`}
        onClick={async () => {
          setLogoutClicked(true);

          await signOutMutation.mutateAsync();
          router.push(`${process.env.NEXT_PUBLIC_DOMAIN}`);

          setLogoutClicked(false);
        }}
      />
      <div
        className="absolute inset-y-0 right-80 z-10 h-28 w-96 bg-[url('/objects/studyCloud.png')] bg-right-top bg-no-repeat hover:z-20 hover:cursor-pointer hover:bg-[url('/objects/studyCloudHover.png')]"
        onClick={() => console.log("go to study room")}
      />
      <div
        className="absolute inset-y-0 left-0 z-10 h-28 w-96 bg-[url('/objects/multiplayerCloud.png')] bg-left-top bg-no-repeat hover:z-20 hover:cursor-pointer hover:bg-[url('/objects/multiplayerCloudHover.png')]"
        onClick={() => {
          showPopup("invite");
        }}
      />
      <div
        className="absolute inset-y-0 left-72 z-10 h-28 w-96 bg-[url('/objects/mailCloud.png')] bg-right-top bg-no-repeat hover:z-20 hover:cursor-pointer hover:bg-[url('/objects/mailCloudHover.png')]"
        onClick={() => {
          console.log("hi mailajmailamalalalm");
          showPopup("mail");
        }}
      />
      <div className="absolute flex w-full justify-center">
        <div
          className="absolute inset-y-0 z-10 h-28 w-96 bg-[url('/objects/houseCloud.png')] bg-left-top bg-no-repeat hover:z-20 hover:cursor-pointer hover:bg-[url('/objects/houseCloudHover.png')]"
          onClick={() => console.log("enter house")}
        />
      </div>

      {showInvitePopup && (
        <div className="flex h-screen w-screen items-center justify-center">
          <div
            className="flex items-center justify-center bg-white"
            ref={inviteRef}
          >
            <InvitePopup />
          </div>
        </div>
      )}

      {showMailPopup && (
        <div className="flex h-screen w-screen items-center justify-center">
          <div
            className="flex items-center justify-center bg-slate-200"
            ref={mailRef}
          >
            <MailPopup />
          </div>
        </div>
      )}
    </main>
  );
}
