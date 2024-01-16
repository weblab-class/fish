"use client";
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
      <div className="absolute top-0 w-full h-full m-0 p-0 z-0">
        <DynamicComponentWithNoSSR />
      </div>

      {/* nav bar */}
      <div
        className="bg-[url('/logoutCloud.png')] hover:bg-[url('/logoutCloudHover.png')] hover:z-20 z-10 bg-no-repeat bg-right-top absolute right-0 inset-y-0 h-28 w-96"
        onClick={() => console.log("return to title screen")}
      />
      <div
        className="bg-[url('/studyCloud.png')] hover:bg-[url('/studyCloudHover.png')] bg-no-repeat hover:z-20 z-10 bg-right-top absolute right-64 inset-y-0 h-28 w-96"
        onClick={() => console.log("go to study room")}
      />
      <div
        className="bg-[url('/multiplayerCloud.png')] hover:bg-[url('/multiplayerCloudHover.png')] hover:z-20 z-10 bg-no-repeat bg-left-top absolute left-0 inset-y-0 h-28 w-96"
        onClick={() => setInviteScreen(true)}
      />
      <div
        className="bg-[url('/mailCloud.png')] hover:bg-[url('/mailCloudHover.png')] hover:z-20 z-10 bg-no-repeat bg-right-top absolute inset-x-72 inset-y-0 h-28 w-96"
        onClick={() => console.log("open mailbox")}
      />
      <div
        className="bg-[url('/houseCloud.png')] hover:bg-[url('/houseCloudHover.png')] hover:z-20 z-10 bg-no-repeat bg-left-top absolute right-1/3 inset-y-0 h-28 w-96"
        onClick={() => console.log("enter house")}
      />
    
    {/* Invite/Join friends pop up */}
      {inviteScreen && (
        <div className="absolute rounded-3xl shadow-xl shadow-stone-600 h-5/6 w-5/6 bg-[url(/tanBg.png)] bg-cover outline-8 outline-amber-900 z-20">
        </div>
      )}
    </main>
  );
}
