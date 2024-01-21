import { useHomeStore } from "@/phaser/stores";
import React, { useEffect } from "react";

const InvitePopup = () => {
  const [setDefault] = useHomeStore(
    (state) => [
      state.setDefault,
    ],
  );

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
  return (
    <div className="absolute z-20 flex h-4/5 w-5/6 gap-10 rounded-3xl bg-[url(/backgrounds/tanBg.png)] bg-cover p-7 shadow-xl shadow-stone-600 outline-8 outline-amber-900">
      <form className="-left-1/4 w-1/2 ">
        <div className="h-full w-full rounded-3xl bg-[url('/backgrounds/whiteBg.png')] p-4">
          <p className="h-fit w-full text-5xl text-red-950 underline">
            Add Player&apos;s to Guest List
          </p>
          <p className="text-2xl text-red-900">
            Control who can visit your habitat!
          </p>
          <input
            className="h-16 w-3/4 rounded-xl p-2 text-2xl text-black outline-red-900"
            placeholder="Enter player's username"
          />
          <button className="ml-2 mt-4 h-14 w-28 rounded-3xl bg-[url('/backgrounds/redBg.png')] text-3xl text-white">
            Invite
          </button>

          <p className="mt-4 h-fit w-full text-4xl text-red-950 underline">
            Guest List
          </p>
          <p className="text-3xl text-red-950">Get users from database</p>
        </div>
      </form>

      <form className="-left-1/4 w-1/2 ">
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
};

export default InvitePopup;
