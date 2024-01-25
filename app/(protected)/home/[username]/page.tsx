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
import Timer from "@/components/timer";
import Stopwatch from "@/components/stopwatch";
import ReactAudioPlayer from "react-audio-player";

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
  const isExterior = useGameStore.getState().scenes[0] == exterior;

  const time = new Date();
  let total = document.getElementById("h")?.value * 60 * 60 + document.getElementById("m")?.value * 60 + document.getElementById("s")?.value;
  time.setSeconds(time.getSeconds() + total);

  return (
    <main>
      <div className="absolute top-0 z-0 m-0 h-full w-full p-0">
        <DynamicComponentWithNoSSR />
      </div>
      {/* music */}
      <button 
        className = "absolute z-10 h-16 w-16 bottom-10 right-20 bg-[url('/objects/music.png')] bg-no-repeat bg-contain rounded-full hover:bg-white hover:bg-opacity-70"
        onClick = {() => {console.log("volume toggle")}}
      />
      {/* interior */}
      { isInterior && (
        <ReactAudioPlayer
          src="/music/home-everyday-motion-avbe.mp3"
          autoPlay
          loop
        />
      )}
      {/* exterior */}
      { isExterior && (
        <ReactAudioPlayer
          src="/music/exterior-pixel-playground-color-parade.mp3"
          autoPlay
          loop
        />
      )}
      {/* studyroom */}
      { isStudyroom && (
        <div>
          <ReactAudioPlayer
            src="/music/studyroom-skylight-simon-folwar.mp3"
            autoPlay
            loop
          />
          <span
            className = "absolute z-10 h-20 w-16 bg-[url('/objects/leave.png')] bg-right-top bg-no-repeat top-10 right-20 hover:bg-[url('/objects/leave_hover.png')]"
            onClick={() => {
              setData({scenes:[interior, studyroom, exterior]})
            }}
          />
          <div className="w-full h-full flex items-center justify-center select-none">
            <div
              id = "studyroom_load_sprites"
              className = "absolute flex flex-wrap bottom-0 z-10 h-3/5 w-1/2 justify-evenly"
            >
            </div>
          </div>
          <div className="w-70 z-30 h-52 flex items-center justify-center m-9">
            {/* <span className = "absolute flex flex-wrap top-0 z-30 h-1/5 w-1/5 m-16 justify-center top-0">
              <form id='duration' className = "z-40 right-0 select-none">
                <input id='h' name='h' type='number' min='0' max='23' className = "cursor-text opacity-50"/>
                <label htmlFor='h' className = "p-1">h</label>
                <input id='m' name='m' type='number' min='0' max='59' className = "cursor-text opacity-50"/>
                <label htmlFor='m' className = "p-1">m</label>
                <input id='s' name='s' type='number' min='0' max='59' className = "cursor-text opacity-50"/>
                <label htmlFor='s' className = "p-1">s</label>
              </form>
            </span> */}
            {
              total ? (
                <span className = "z-30 w-70">
                  <Timer expiryTimestamp={time} />
                </span>
              ) : (
                <span className = "z-30 w-70">
                  <Stopwatch />
                </span>
              )
            }
          </div>
        </div>
        )
      }
      {/* nav bar */}
      {isExterior && (
        <div>
          <div
            className="absolute inset-y-0 right-0 z-10 h-28 w-96 bg-[url('/objects/logoutCloud.png')] bg-right-top bg-no-repeat hover:z-20 hover:bg-[url('/objects/logoutCloudHover.png')]"
            onClick={() => console.log("return to title screen")}
          />
          <div
            className="absolute inset-y-0 right-64 z-10 h-28 w-96 bg-[url('/objects/studyCloud.png')] bg-right-top bg-no-repeat hover:z-20 hover:bg-[url('/objects/studyCloudHover.png')]"
            onClick={() => { 
              setData({ scenes: [studyroom, interior, exterior] });
              //game?.scene.switch("exterior", "studyroom");
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
              className="inset-y-0 z-10 h-28 w-96 bg-[url('/objects/houseCloud.png')] bg-left-top bg-no-repeat hover:z-20 hover:bg-[url('/objects/houseCloudHover.png')]"
              onClick={() => { 
                setData({ scenes: [interior, exterior, studyroom] });
                //game?.scene.switch("exterior", "interior");
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
