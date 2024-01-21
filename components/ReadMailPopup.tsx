import React from "react";

export default function ReadMailPopup() {
  return (
    <div className="absolute z-30 flex h-full w-full items-center justify-center rounded-t-full bg-[url(/backgrounds/brownBg.png)] bg-cover shadow-xl shadow-stone-600 outline-8 outline-amber-900">
      <p className="absolute inset-y-0 mt-2 text-5xl text-white">Your Mail</p>
      <div className="z-30 flex h-5/6 w-11/12 justify-center rounded-t-full bg-[url(/backgrounds/blackBg.png)] bg-cover outline-8 outline-amber-900"></div>
    </div>
  );
}
