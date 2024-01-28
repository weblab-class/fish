import React, { useEffect, useRef, useState } from "react";
import { useSendMail } from "@/services/react-query/mutations/player/sendMail";
import {
  getPlayer,
  getPlayerByUsername,
} from "@/services/react-query/queries/player";
import { useLuciaSession } from "@/services/lucia/LuciaSessionProvider";
import {
  deleteMail,
  useDeleteMail,
} from "@/services/react-query/mutations/player/deleteMail";

export default function Mail(props: {
  sender: string;
  message: string;
  handleDelete: () => void;
}) {
  const [showLetter, setShowLetter] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);
  const { session } = useLuciaSession();
  const deleteMail = useDeleteMail();

  // closes letter
  useEffect(() => {
    const handleEscapePress = (event: KeyboardEvent) => {
      event.stopPropagation();
      event.preventDefault();
      setShowLetter(false);
    };

    document.addEventListener("keydown", handleEscapePress);

    return () => {
      document.removeEventListener("keydown", handleEscapePress);
    };
  });

  return (
    <div className="h-fit w-fit" ref={letterRef}>
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
            <div className="flex h-5/6 justify-center bg-[url(/backgrounds/whiteBg.png)] outline outline-gray-200">
              <div className="mt-5 h-full w-full overflow-x-hidden overflow-y-scroll break-words rounded-2xl p-2 text-3xl text-zinc-700">
                {props.message}
              </div>
              <button
                className="absolute inset-y-0 flex h-fit w-3/12 cursor-pointer items-center justify-center bg-[url(/backgrounds/blueBg.png)] p-2 text-3xl"
                onClick={async (e) => {
                  console.log("hiding");
                  const { data: sender } = await getPlayerByUsername(
                    props.sender,
                  );
                  setShowLetter(false);
                }}
              >
                Reseal
              </button>
              <button
                className="absolute inset-y-0 right-0 flex h-fit w-fit cursor-pointer bg-[url(/backgrounds/brightRedBg.png)] p-2 text-3xl"
                onClick={async (e) => {
                  const { data: sender } = await getPlayerByUsername(
                    props.sender,
                  );
                  if (!sender) throw new Error("Invalid user!");

                  await deleteMail.mutateAsync({
                    senderId: sender[0]._id.toString(),
                    content: props.message,
                    receiverId: session!.user.uid,
                  });

                  setShowLetter(false);
                  await props.handleDelete();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : (
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
