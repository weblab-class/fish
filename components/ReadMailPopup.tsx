import React, { useEffect, useMemo, useState } from "react";

import { useLuciaSession } from "@/services/lucia/LuciaSessionProvider";
import {
  getPlayer,
  getPlayerByUsername,
  useGetPlayer,
  useGetPlayerByUsername,
} from "@/services/react-query/queries/player";
import Mail from "./Mail";
import { sendError } from "next/dist/server/api-utils";
import { Content } from "next/font/google";

export default function ReadMailPopup() {
  const { session } = useLuciaSession();
  const { data: receiver } = useGetPlayer(session!.user.uid);

  const [letters, setLetters] = useState<any>([]);
  // FIX STATE LATER

  useEffect(() => {
    if (!receiver?.data) return;
    const updateMail = async () => {
      const mail = await Promise.all(
        (receiver?.data?.inbox || []).map(async (letter) => {
          const { data: sender } = await getPlayer(letter.senderId.toString());

          return {
            content: letter.content,
            sender: sender?.username,
          };
        }),
      );
      setLetters(mail);
    };
    updateMail();
  }, [receiver?.data?.inbox]);

  useEffect(() => {
    console.log(letters);
  }, [letters]);

  return (
    <div className="absolute z-30 flex h-full w-full items-center justify-center rounded-t-full bg-[url(/backgrounds/brownBg.png)] bg-cover text-white shadow-xl shadow-stone-600 outline-8 outline-amber-900">
      <p className="absolute inset-y-0 mt-2 text-5xl text-white">Your Mail</p>

      <div className="z-20 flex h-5/6 w-11/12 items-end justify-center rounded-t-full bg-[url(/backgrounds/blackBg.png)] bg-cover outline-8 outline-amber-900">
        <div className="h-1/12 max-full bottom-0 flex w-fit flex-wrap justify-center">
          {letters.map((letter: { sender: string; content: string }) => (
            <Mail sender={letter.sender} message={letter.content} />
          ))}
        </div>
      </div>
    </div>
  );
}
