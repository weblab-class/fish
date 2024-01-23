import React, { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/services/pusher";
import { useUpdateVote } from "@/services/react-query/mutations/sentence-symphony";
import axios from "axios";
export default function ResponseCard(props: {
  round: number;
  response: string;
  creatorId: string;
  creatorUsername: string;
  voterId: string;
  hostId: string;
  hostUsername: string;
}) {
  const [clicked, setClicked] = useState(false);
  const responseBoxRef = useRef<HTMLDivElement>(null);
  const updateVote = useUpdateVote();

  // unclicks a response if clicked outside of box
  useEffect(() => {
    const presenceChannel = pusherClient.subscribe(
      `presence-ss-vote-${props.hostUsername}`,
    );
    presenceChannel.bind("countVotes", () => {
      // +1 to the response in the data base if clicked

      if (clicked) {
        // send player id as voter id to db
        console.log("voted for: ", props.creatorId, props.response);
        const updateVoteFunc = async () => {
          await updateVote.mutateAsync({
            hostId: props.hostId,
            creatorId: props.creatorId,
            voterId: props.voterId,
          });

          await axios.post("/api/pusher/symphony/updateData", {
            hostUsername: props.hostUsername,
          });
        };
        updateVoteFunc();
      }
    });

    return () => {
      presenceChannel.unbind("countVotes");
      presenceChannel.unsubscribe();
    };
  }, [clicked]);

  // listens for if player clicks outside the response card
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        responseBoxRef.current &&
        !responseBoxRef.current.contains(event.target as Node)
      ) {
        setClicked(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });
  return (
    <div
      className={`${
        clicked ? "outline" : ""
      } justify-center" z-50 ml-2 mr-2 ${props.creatorId === props.voterId ? "cursor-not-allowed bg-gray-700 text-gray-200 opacity-50 " : "bg-[url('/backgrounds/whiteGrayBg.png')] hover:cursor-pointer hover:outline "} flex h-2/5 w-1/5 items-center break-words rounded-lg text-center text-3xl text-gray-700 outline-4 outline-yellow-400 `}
      ref={responseBoxRef}
      onClick={() => {
        if (!(props.creatorId === props.voterId)) {
          setClicked(true);
        }
      }}
    >
      <p className="w-full break-words p-2 text-center">{props.response}</p>
    </div>
  );
}
