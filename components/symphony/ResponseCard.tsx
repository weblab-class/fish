import React, { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/services/pusher";
import { useUpdateVote } from "@/services/react-query/mutations/sentence-symphony";
import axios from "axios";

type Response = {
  creatorId: string;
  sentence: string;
  voterIds: string[];
};
export default function ResponseCard(props: {
  round: number;
  response: string;
  creatorId: string;
  creatorUsername: string;
  voterId: string;
  hostId: string;
  hostUsername: string;
  responsesData: Response[];
}) {
  const [clicked, setClicked] = useState(false);
  const responseBoxRef = useRef<HTMLDivElement>(null);
  const [allowUnsubscribe, setAllowUnsubscribe] = useState<boolean>(true);
  const updateVote = useUpdateVote();
  const [bind, setBind] = useState(false);

  // unclicks a response if clicked outside of box
  useEffect(() => {
    const presenceChannel = pusherClient.subscribe(
      `presence-ss-vote-${props.hostUsername}`,
    );
    presenceChannel.bind("countVotes", () => {
      setBind(true);
      // +1 to the response in the data base if clicked
      setAllowUnsubscribe(false);

      if (clicked) {
        // send player id as voter id to db

        const updateVoteFunc = async () => {
          await axios.put("/api/pusher/symphony/submitResponse", {
            hostUsername: props.hostUsername,
            creatorId: props.creatorId,
            voterId: props.voterId,
          });
          // await updateVote.mutateAsync({
          //   hostId: props.hostId,
          //   creatorId: props.creatorId,
          //   voterId: props.voterId,
          // });
          // await axios.post("/api/pusher/symphony/updateData", {
          //   hostUsername: props.hostUsername,
          //   scores: false,
          // });
        };

        updateVoteFunc();

        setAllowUnsubscribe(true);
        presenceChannel.unbind("countVotes");
        presenceChannel.unsubscribe();
      } else {
        presenceChannel.unbind("countVotes");
        presenceChannel.unsubscribe();
      }
    });

    return () => {
      if (allowUnsubscribe) {
        presenceChannel.unbind("countVotes");
        presenceChannel.unsubscribe();
      }
    };
  }, [clicked]);

  // listens for if player clicks outside the response card
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        responseBoxRef.current &&
        !responseBoxRef.current.contains(event.target as Node)
      ) {
        if (!bind) {
          setClicked(false);
        }
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
      } justify-center" z-30 ml-2 mr-2 ${props.creatorId === props.voterId ? "cursor-not-allowed overflow-hidden bg-gray-700 text-gray-200 opacity-50 " : "overflow-y-scroll bg-[url('/backgrounds/whiteGrayBg.png')] hover:cursor-pointer hover:outline "} flex h-2/5 w-1/5 items-center break-words rounded-lg p-1 text-center text-2xl text-gray-700 outline-4 outline-yellow-400 `}
      ref={responseBoxRef}
      title={
        props.creatorId === props.voterId
          ? "You can not vote for your own response"
          : ""
      }
      aria-disabled={bind}
      onClick={() => {
        if (!(props.creatorId === props.voterId)) {
          if (!bind) {
            setClicked(true);
          }
        }
      }}
    >
      <p className="w-full break-words p-3 text-center">{props.response}</p>
    </div>
  );
}
