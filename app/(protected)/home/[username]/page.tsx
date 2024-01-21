"use client";
import Phaser from "phaser";
import InvitePopup from "../../../..//components/InvitePopup";
import MailPopup from "../../../..//components/MailPopup";
import { useGameStore } from "../../../..//stores/gameStore";
import dynamic from "next/dynamic";
import Pusher from "pusher-js";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Session } from "lucia";
import { useLuciaSession } from "../../../../services/lucia/LuciaSessionProvider";
import exterior from "../../../../phaser/exterior";
import interior from "../../../../phaser/interior";
import studyroom from "../../../../phaser/studyroom";
import { useGetPlayer } from "@/services/react-query";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../../../../phaser/Game"),
  {
    ssr: false,
  },
);

export default function Home() {
  const { session } = useLuciaSession();
  const [game, showInvitePopup, showMailPopup, showPopup, setDefault, setData] =
    useGameStore((state) => [
      state.game,
      state.showInvitePopup,
      state.showMailPopup,
      state.showPopup,
      state.setDefault,
      state.setData,
    ]);
  const { data: host } = useGetPlayer(session!.user.uid);

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

  // change player name if needed
  useEffect(() => {
    useGameStore.setState({ hostUsername: host?.data?.username ?? "Host" });
  }, [host]);

  const isInterior = useGameStore.getState().scenes[0] == interior;
  const isStudyroom = useGameStore.getState().scenes[0] == studyroom;

  console.log(isInterior, isStudyroom)

  return (
    <main>
      <div className="absolute top-0 z-0 m-0 h-full w-full p-0">
        <DynamicComponentWithNoSSR />
      </div>
      {/* nav bar */}
      {!isInterior && !isStudyroom && (
        <div>
          <div
            className="absolute inset-y-0 right-0 z-10 h-28 w-96 bg-[url('/objects/logoutCloud.png')] bg-right-top bg-no-repeat hover:z-20 hover:bg-[url('/objects/logoutCloudHover.png')]"
            onClick={() => console.log("return to title screen")}
          />
          <div
            id="studyroom_id"
            className="absolute inset-y-0 right-64 z-10 h-28 w-96 bg-[url('/objects/studyCloud.png')] bg-right-top bg-no-repeat hover:z-20 hover:bg-[url('/objects/studyCloudHover.png')]"
            onClick={() => {
              setData({ scenes: [studyroom, interior, exterior] });
            }}
          />
          <div
            className="absolute inset-y-0 left-0 z-10 h-28 w-96 bg-[url('/objects/multiplayerCloud.png')] bg-left-top bg-no-repeat hover:z-20 hover:bg-[url('/objects/multiplayerCloudHover.png')]"
            onClick={() => showPopup("invite")}
          />
          <div
            className="absolute inset-y-0 left-72 z-10 h-28 w-96 bg-[url('/objects/mailCloud.png')] bg-right-top bg-no-repeat hover:z-20 hover:bg-[url('/objects/mailCloudHover.png')]"
            onClick={() => showPopup("mail")}
          />
          <div className="absolute flex w-full justify-center">
            <div
              id="interior_id"
              className="inset-y-0 z-10 h-28 w-96 bg-[url('/objects/houseCloud.png')] bg-left-top bg-no-repeat hover:z-20 hover:bg-[url('/objects/houseCloudHover.png')]"
              onClick={() => {
                setData({ scenes: [interior, studyroom, exterior] });
              }}
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
        </div>
      )}
    </main>
  );
}
