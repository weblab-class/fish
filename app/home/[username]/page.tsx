"use client";
import NextAuthProvider from "@/services/next-auth/NextAuthProvider";
import dynamic from "next/dynamic";
import Pusher from "pusher-js";
import { useEffect, useRef, useState } from "react";

const DynamicComponentWithNoSSR = dynamic(() => import("@/phaser/Game"), {
  ssr: false,
});

export default function Home() {
  const [inviteScreen, setInviteScreen] = useState(false);

  return (
    <main>
      <div className="absolute top-0 z-0 m-0 h-full w-full p-0">
        <NextAuthProvider>
          <DynamicComponentWithNoSSR />
        </NextAuthProvider>
      </div>

      {/* nav bar */}
      <div
        className="absolute inset-y-0 right-0 z-10 h-28 w-96 bg-[url('/objects/logoutCloud.png')] bg-right-top bg-no-repeat hover:z-20 hover:bg-[url('/objects/logoutCloudHover.png')]"
        onClick={() => console.log("return to title screen")}
      />
      <div
        className="absolute inset-y-0 right-64 z-10 h-28 w-96 bg-[url('/objects/studyCloud.png')] bg-right-top bg-no-repeat hover:z-20 hover:bg-[url('/objects/studyCloudHover.png')]"
        onClick={() => console.log("go to study room")}
      />
      <div
        className="absolute inset-y-0 left-0 z-10 h-28 w-96 bg-[url('/objects/multiplayerCloud.png')] bg-left-top bg-no-repeat hover:z-20 hover:bg-[url('/objects/multiplayerCloudHover.png')]"
        onClick={() => setInviteScreen(true)}
      />
      <div
        className="absolute inset-x-72 inset-y-0 z-10 h-28 w-96 bg-[url('/objects/mailCloud.png')] bg-right-top bg-no-repeat hover:z-20 hover:bg-[url('/objects/mailCloudHover.png')]"
        onClick={() => console.log("open mailbox")}
      />
      <div className="absolute flex w-full justify-center">
        <div
          className="inset-y-0 z-10 h-28 w-96 bg-[url('/objects/houseCloud.png')] bg-left-top bg-no-repeat hover:z-20 hover:bg-[url('/objects/houseCloudHover.png')]"
          onClick={() => console.log("enter house")}
        />
      </div>
    </main>
  );
}
