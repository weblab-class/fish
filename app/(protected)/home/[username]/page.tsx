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

const DynamicComponentWithNoSSR = dynamic(() => import("@/phaser/Game"), {
  ssr: false,
});

export default function Home() {
  const { session } = useLuciaSession();
  const router = useRouter();
  const signOutMutation = useSignOut();
  const { data, isSuccess, isError, error } = useGetPlayer(session!.user.uid);

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
        <DynamicComponentWithNoSSR />
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
        className="bg-[url('/objects/studyCloud.png')] hover:bg-[url('/objects/studyCloudHover.png')] bg-no-repeat hover:z-20 hover:cursor-pointer z-10 bg-right-top absolute right-80 inset-y-0 h-28 w-96"
        onClick={() => console.log("go to study room")}
      />
      <div
        className="bg-[url('/objects/multiplayerCloud.png')] hover:bg-[url('/objects/multiplayerCloudHover.png')] hover:z-20 hover:cursor-pointer z-10 bg-no-repeat bg-left-top absolute left-0 inset-y-0 h-28 w-96"
        onClick={() => {
          console.log("hi mailajmailamalalalm")
          showPopup("invite");
        }}
      />
      <div
        className="bg-[url('/objects/mailCloud.png')] hover:bg-[url('/objects/mailCloudHover.png')] hover:z-20 hover:cursor-pointer z-10 bg-no-repeat bg-right-top absolute left-72 inset-y-0 h-28 w-96"
        onClick={() => {
          console.log("hi mailajmailamalalalm")
          showPopup("mail");
        }}
      />
      <div className="absolute flex justify-center w-full">
        <div
          className="bg-[url('/objects/houseCloud.png')] hover:bg-[url('/objects/houseCloudHover.png')] hover:z-20 hover:cursor-pointer z-10 bg-no-repeat bg-left-top absolute inset-y-0 h-28 w-96"
          onClick={() => console.log("enter house")}
        />
      </div>

      {showInvitePopup && (
        <div className="flex justify-center items-center w-screen h-screen">
          <div
            className="flex justify-center items-center bg-white"
            ref={inviteRef}
          >
            <InvitePopup />
          </div>
        </div>
      )}

      {showMailPopup && (
        <div className="flex justify-center items-center w-screen h-screen">
          <div
            className="flex justify-center items-center bg-slate-200"
            ref={mailRef}
          >
            <MailPopup />
          </div>
        </div>
      )}
    </main>
  );
}
