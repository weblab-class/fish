import { useGameStore } from "@/phaser/gameStore";
import React, { useEffect, useState } from "react";
import ReadMailPopup from "./ReadMailPopup";
import SendMailPopup from "./SendMailPopup";

const MailPopup = () => {
  const [showInvitePopup, showMailPopup, showPopup, setDefault] = useGameStore(
    (state) => [
      state.showInvitePopup,
      state.showMailPopup,
      state.showPopup,
      state.setDefault,
    ],
  );
  const [mailSelection, setMailSelection] = useState<string>("");

  // closes newest popus
  useEffect(() => {
    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (mailSelection === "") {
          setDefault();
        } else {
          setMailSelection("");
        }
      }
    };

    document.addEventListener("keydown", handleEscapePress);

    return () => {
      document.removeEventListener("keydown", handleEscapePress);
    };
  });

  return (
    <div className="absolute bottom-0 flex h-5/6 w-2/5 justify-center">
      <div className="absolute z-20 flex h-4/5 w-full rounded-t-full bg-[url(/backgrounds/grayBg.png)] bg-cover shadow-xl shadow-stone-600 outline-8 outline-amber-900">
        {mailSelection === "read" ? (
          <ReadMailPopup />
        ) : mailSelection === "send" ? (
          <div>
            <SendMailPopup />
          </div>
        ) : (
          <div className="absolute z-30 flex h-full w-full items-center justify-center rounded-t-full bg-gray-400 bg-[url(/backgrounds/brownBg.png)] bg-cover shadow-xl shadow-stone-600 outline-8 outline-amber-900">
            <div className="z-30 flex h-5/6 w-11/12 justify-center rounded-t-full bg-[url(/backgrounds/lighterBrownBg.png)] bg-cover shadow-2xl shadow-stone-600 outline-8 outline-amber-900">
              <div
                className="absolute mt-28 flex h-1/4 w-3/5 items-end justify-center rounded-t-full bg-[url('/backgrounds/blackBg.png')] p-5 text-white hover:cursor-pointer hover:bg-black"
                onClick={() => {
                  setMailSelection("send");
                  showPopup("mail");
                }}
              >
                <p className="text-4xl">Send Mail</p>
              </div>
              <div className="items-bottom shad inset-y-0 m-2 flex h-fit w-4/12 justify-center rounded-t-full bg-[url('/backgrounds/brownBg.png')] text-3xl">
                <div
                  className="items-bottom inset-y-0 m-2 flex h-full w-full justify-center rounded-t-full bg-[url('/backgrounds/blackBg.png')] p-2 text-3xl text-white shadow-xl shadow-stone-800 hover:cursor-pointer hover:bg-zinc-950"
                  onClick={() => {
                    setMailSelection("read");
                    showPopup("mail");
                  }}
                >
                  Read Mail
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className="shadow-3xl z:10 absolute right-0 top-0 z-10 flex h-3/4 w-24 justify-center rounded-2xl bg-[url('/backgrounds/redBg.png')] pt-3 text-6xl text-white hover:cursor-pointer hover:bg-[url('/backgrounds/brightRedBg.png')]"
          onClick={() => {
            setDefault();
          }}
        >
          X
        </div>
      </div>
      <div className="absolute bottom-0 z-10 h-1/4 w-2/12 bg-[url('/backgrounds/brownBg.png')]"></div>
    </div>
  );
};

export default MailPopup;
