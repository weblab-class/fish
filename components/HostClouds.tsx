"use client";

import { useRouter } from "next/navigation";
import { RefObject, useState } from "react";

import { useHomeStore } from "@/phaser/stores";
import { useSignOut } from "@/services/react-query/auth";
import MailPopup from "./MailPopup";
import InvitePopup from "./InvitePopup";
import { useLuciaSession } from "@/services/lucia/LuciaSessionProvider";

interface IHostCloudsProps {
  hostUsername: string;
  inviteRef: RefObject<HTMLDivElement>;
  mailRef: RefObject<HTMLDivElement>;
}

/**
 * Options for the host.
 */
export default function HostClouds({
  hostUsername,
  inviteRef,
  mailRef,
}: IHostCloudsProps) {
  const [logoutClicked, setLogoutClicked] = useState(false);
  const router = useRouter();

  const signOutMutation = useSignOut();
  const [showInvitePopup, showMailPopup, showPopup] = useHomeStore((state) => [
    state.showInvitePopup,
    state.showMailPopup,
    state.showPopup,
  ]);
  const { session } = useLuciaSession();

  return (
    <div>
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
          console.log("hi mailajmailamalalalm");
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
          onClick={() => {}}
        />
      </div>
      {showInvitePopup && (
        <div className="flex h-screen w-screen items-center justify-center">
          <div
            className="flex items-center justify-center bg-white"
            ref={inviteRef}
          >
            <InvitePopup hostId={session!.user.uid} hostUsername={hostUsername} />
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
    </div>
  );
}
