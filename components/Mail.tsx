import React, { useEffect, useState } from "react";

export default function Mail(props: { sender: string; message: string }) {
  const [showLetter, setShowLetter] = useState(false);

  // closes letter
  useEffect(() => {
    const handleEscapePress = (event: KeyboardEvent) => {
      setShowLetter(false);
    };

    document.addEventListener("keydown", handleEscapePress);

    return () => {
      document.removeEventListener("keydown", handleEscapePress);
    };
  });
  return (
    <div className="h-fit w-fit">
      {showLetter ? (
        // <div className="h-full flex items-center justify-center">
        //   <div className="flex absolute rounded-t-full shadow-xl shadow-stone-600 h-full w-full bg-gray-400 bg-[url(/backgrounds//brownBg.png)] bg-cover items-center justify-center outline-8 outline-amber-900 z-30">
        <div className="absolute inset-0 flex h-full w-full justify-center">
          <div className="absolute z-40 mt-5 h-full w-8/12 bg-[url(/backgrounds/whiteGrayBg.png)]"></div>
          <div className="absolute z-40 mt-5 h-full w-8/12 bg-[url(/backgrounds/whiteGrayBg.png)]"></div>
          <div className="absolute z-40 mt-5 h-full w-8/12 flex-col justify-center bg-[url(/backgrounds/whiteGrayBg.png)] p-4 shadow-2xl shadow-zinc-800">
            {/* Sender Field */}
            <div className="mt-5 flex bg-[url(/backgrounds/whiteBg.png)] outline outline-gray-200">
              <div className="ml-5 h-fit rounded-2xl p-2 text-3xl text-zinc-700">
                From: {props.sender}
              </div>
            </div>
            {/* Message Field */}
            <div className="h-5/6 bg-[url(/backgrounds/whiteBg.png)] outline outline-gray-200">
              <div className="mt-5 h-full w-full overflow-x-hidden overflow-y-scroll break-words rounded-2xl p-2 text-3xl text-zinc-700">
                {props.message}
              </div>
              <div
                className="absolute inset-y-0 right-0 flex h-fit w-3/12 cursor-pointer items-center justify-center bg-[url(/backgrounds/blueBg.png)] p-2 text-3xl"
                onClick={() => {}}
              >
                Reseal
              </div>
            </div>
          </div>
        </div>
      ) : (
        // </div>
        // open letter
        <div className="ml-1 mr-1 flex h-fit w-fit items-end shadow-md shadow-gray-800 hover:z-10">
          <div
            className="flex h-1/6 w-full items-center justify-center rounded-lg bg-[url(/backgrounds/whiteGrayBg.png)] pl-6 pr-6 text-center text-4xl text-gray-800 shadow-sm shadow-slate-900 outline-2 outline-white hover:z-10 hover:outline"
            onClick={() => {
              setShowLetter(true);
            }}
          >
            From: {props.sender}
          </div>
        </div>
      )}
    </div>
  );
}
