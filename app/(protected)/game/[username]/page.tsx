"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { pusherClient } from "@/services/pusher";
import axios from "axios";
import ResponseCard from "@/components/symphony/ResponseCard";
import { PresenceChannel } from "pusher-js";
import ChatLog from "@/components/symphony/ChatLog";
import VoteCount from "@/components/symphony/VoteCount";
import { useMultiplayerStore } from "@/phaser/stores";
import { useLuciaSession } from "@/services/lucia/LuciaSessionProvider";
import dynamic from "next/dynamic";
import { useGetPlayer, useGetPlayerByUsername } from "@/services/react-query";
import { AnimalSprite, PlayerRoomStatus } from "@/types";

import {
  getSentenceSymphony,
  useGetSentenceSymphony,
} from "@/services/react-query/queries/sentence-symphony";
import {
  useSubmitSentence,
  useCreateSentenceSymphony,
  useUpdateVote,
  startNewRound,
  useStartNewRound,
} from "@/services/react-query/mutations/sentence-symphony";
import { PlayerInfo } from "@/phaser/types";
import { AiFillSkype } from "react-icons/ai";

const PieChartWithoutSSR = dynamic(
  () => import("@/components/symphony/PieScore"),
  {
    ssr: false,
  },
);

type Input = {
  response: string;
};

type FullResponse = {
  sentence: string;
  creatorId: string;
  voteIds: string[];
};

// const sessionId= session!.user.uid
// TODO if a random person tries to join the game without the host's permissions, kick them out
//      1. it is okay for the random person to subscribe
//      2. however, when they get the game room, if they are not on there, redirect out (to anywhere)

export default function GamePage({ params }: { params: { username: string } }) {
  // NOTE: subscribes once even though it may render multiple-times
  const gameChannel = pusherClient.subscribe(`presence-ss-${params.username}`);

  // session data
  const { session } = useLuciaSession();
  const playerId = session!.user.uid;
  const [isHost, setIsHost] = useState(true);
  const [allPlayers, setAllPlayers] = useState<any>(); // TO DO: ADD TYPE
  const [gameRoomExists, setGameRoomExists] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // queries
  const { data: player, isLoading: isPlayerLoading } = useGetPlayer(
    session!.user.uid,
  );
  const { data: host, isLoading: isHostLoading } = useGetPlayerByUsername(
    params.username,
  );
  const isBothFinishedLoading = !isPlayerLoading && !isHostLoading; // make sure both is loaded in before creation

  // mutations
  const createSentenceSymphony = useCreateSentenceSymphony();
  const submitSentence = useSubmitSentence();
  const startNewRound = useStartNewRound();

  // loading states
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [waiting, setWaiting] = useState(true);

  // game timer
  const [time, setTime] = useState<number>();
  const [timesUp, setTimesUp] = useState<boolean>(false);

  // specific game stuff
  const [roundType, setRoundType] = useState<string>("selecting");
  const [prompt, setPrompt] = useState<string>("Prompt/Theme");
  const [endScreen, setEndScreen] = useState<boolean>(false);
  const [submittedResponse, setSubmittedResponse] = useState<boolean>(false);
  const [currentStory, setCurrentStory] = useState("");
  const [mostVoted, setMostVoted] = useState<string>("");
  const [responses, setResponses] = useState<FullResponse[]>();
  const [roundNumber, setRoundNumber] = useState<number>(0);

  //testing data (replace with multiplayer store)

  // react hook form (for writing sentences)
  const {
    register,
    handleSubmit,
    resetField,
    formState: { isSubmitting },
  } = useForm<Input>();

  //TO DO CHANGE ALL player.data.username to currentPlayer.username
  console.log(waiting);

  // one time events
  useEffect(() => {
    // makes sure timer is stopped before starting a new timer
    const stopTimer = async () => {
      await axios.delete("/api/pusher/symphony/gameTimer");
    };

    const gameChannel = pusherClient.subscribe(
      `presence-ss-${params.username}`,
    );
    console.log(gameChannel);

    console.log("init use effect called");

    // makes sure host data and player data are loaded
    if (!host?.data || !host.data[0] || !player?.data) return;

    const hostId = host?.data[0]._id;
    const playerId = player?.data?._id;

    if (hostId === playerId) {
      setIsHost(true);
    } else {
      setIsHost(false);
    }

    // TO DO: change 1 to otherPlayers.length (using multiplayer store)
    if (isHost && !gameRoomExists) {
      const createSentenceSymphonyFunc = async () => {
        await createSentenceSymphony.mutateAsync({
          hostInfo: {
            uid: session!.user.uid,
            username: params.username,
            sprite: "bunny" as AnimalSprite,
            x: 0,
            y: 0,
            roomStatus: "interior" as PlayerRoomStatus,
          },
          otherPlayerInfo: [
            {
              uid: "rqy478h7yarmrmc",
              username: "kchapmit",
              sprite: "hedgehog" as AnimalSprite,
              x: 0,
              y: 0,
              roomStatus: "interior" as PlayerRoomStatus,
            },
            {
              uid: "kxrguwi37czcyjc",
              username: "kenn19",
              sprite: "beaver" as AnimalSprite,
              x: 0,
              y: 0,
              roomStatus: "interior" as PlayerRoomStatus,
            },
            {
              uid: "kxrguwi37czcyjc",
              username: "kenn19",
              sprite: "beaver" as AnimalSprite,
              x: 0,
              y: 0,
              roomStatus: "interior" as PlayerRoomStatus,
            },
          ],
          initialPrompt: "this is the first prompt",
        });
        await axios.post("/api/pusher/symphony/gameRoomCreated", {
          hostUsername: params.username,
        });
        setGameRoomExists(true);
      };
      createSentenceSymphonyFunc();

      const gameRoomCreatedFunc = async () => {
        await axios.post("/api/pusher/symphony/gameRoomCreated", {
          hostUsername: params.username,
        });
        setGameRoomExists(true);
      };
      gameRoomCreatedFunc();
    }

    console.log("binding");
    console.log(gameChannel);
    console.log("all channels", pusherClient.allChannels);
    gameChannel.bind("pusher:subscription_succeeded", () => {
      console.log("success yay");
      setIsSubscribed(true);
    });

    if (isHost) {
      const hostChannel = pusherClient.subscribe(
        `presence-ss-host-${params.username}`,
      );
      hostChannel.bind("pusher:subscription_succeeded", () => {
        console.log("host success yay");
      });
    }

    gameChannel.bind("pusher:subscription_error", (error: any) => {
      console.log("error", error);
    });

    gameChannel.bind(
      "pusher:member_added",
      (member: { id: any; info: any }) => {
        console.log("success member added");
      },
    );

    gameChannel.bind(
      "pusher:member_removed",
      (member: { id: any; info: any }) => {
        console.log("removed member");
      },
    );
    // all players listen for new generated prompts (only host can control prompt generation)
    gameChannel.bind("generatePrompt", (data: { prompt: string }) => {
      setPrompt(data.prompt);
      setSubmissionLoading(false);
    });

    // host makes sure timer stops before unloading
    window.addEventListener("beforeunload", () => {
      stopTimer();
    });

    // clean up
    return () => {
      gameChannel.unbind_all;
      pusherClient.unsubscribe(`presence-ss-host-${params.username}`);
      pusherClient.unsubscribe(`presence-ss-${params.username}`);
      window.removeEventListener("beforeunload", () => {
        stopTimer();
      });
      stopTimer();
    };
  }, [isBothFinishedLoading]);

  // ONLY HOST changes current story, after voting is done
  useEffect(() => {
    // host listens for when voting count is done then changes the round

    if (isHost) {
      const hostChannel = pusherClient.subscribe(
        `presence-ss-host-${params.username}`,
      );
      hostChannel.bind(
        "mostVoted",
        async (data: { mostVotedResponse: string }) => {
          console.log(data.mostVotedResponse, "mostVoted");
          setCurrentStory(currentStory + data.mostVotedResponse);
          console.log(currentStory);
          setMostVoted(data.mostVotedResponse);

          await axios.post("/api/pusher/symphony/roundChange", {
            newRound: "voted",
            roundNumber: roundNumber + 1,
            hostUsername: params.username,
          });
        },
      );
      return () => {
        if (isHost) {
          hostChannel.unbind("mostVoted");
        }
      };
    }
  }, [currentStory]);

  useEffect(() => {
    if (gameRoomExists) {
      const gameRoomRecFunc = async function () {
        const gameRoomRes = await getSentenceSymphony(session!.user.uid);
        const gameRoomPlayers = gameRoomRes.data?.allPlayers;
        console.log(gameRoomRes.data, "data");
        console.log(gameRoomRes.data?.allPlayers, "players");
        setAllPlayers(gameRoomPlayers);
        setWaiting(false);
      };
      gameRoomRecFunc();
    }

    console.log("players", allPlayers);
    console.log(waiting);
  }, [gameRoomExists, isSubscribed]);

  // timer events
  // dependencies: roundType, endScreen, player?.data
  useEffect(() => {
    // only host controls timer
    // if (!player?.data) return;

    const gameChannel = pusherClient.subscribe(
      `presence-ss-${params.username}`,
    );

    gameChannel.bind("gameRoomCreated", () => {
      console.log("game room binding received");
      setGameRoomExists(true);
    });

    let timerDuration = 6;

    if (roundType != "selecting") {
      timerDuration = 6;
    }

    // start timer after new round
    if (roundType != "end") {
      const timer = async () => {
        await axios.post(`/api/pusher/symphony/gameTimer`, {
          time: timerDuration,
          hostUsername: params.username,
        });
      };
      timer();
    }

    gameChannel.bind("updateData", async () => {
      if (!host?.data) return;

      const gameRoomRes = await getSentenceSymphony(
        host.data[0]._id.toString(),
      );
      const gameRoomData = gameRoomRes.data;
      if (gameRoomData) {
        const voteOpts = gameRoomData.voteOptions.map((info) => ({
          ...info,
          creatorId: info.creatorId.toString(),
          voteIds: [...info.voteIds.map((voteId) => voteId.toString())],
        }));
        setResponses(voteOpts);
      }
    });

    // ALL PLAYERS the host makes a call to the server when the round should change. Then, all players listen for "roundChange" event to trigger. Then, every player updates their RoundType and RoundNumber
    // ROUND CHANGE BINDING
    gameChannel.bind(
      "roundChange",
      async (data: { newRound: string; roundNumber: number }) => {
        //submit all responses when time runs out
        console.log("round change binding triggered", data.newRound);
        if (data.newRound === "voting") {
          handleSubmit(onSubmit)();
          resetField("response");
        }

        // clears responses in database
        if (data.newRound === "writing") {
          const startNewRoundFunc = async () => {
            if (!host?.data) return;
            await startNewRound.mutateAsync({
              hostId: host.data[0]._id.toString(),
            });
          };
          startNewRoundFunc();
        }

        setSubmittedResponse(false);

        setRoundType(data.newRound);
        setRoundNumber(data.roundNumber);
      },
    );

    // YOU WERE HERE
    // gameChannel.bind("mostVoted",(data:{mostVotedPrompt:string,newPrompt}))

    gameChannel.bind("timer", (data: { time: number }) => {
      console.log(data.time);

      setTime(data.time);
      if (data.time === 0 && roundNumber < 15) {
        // only host controls stopTimer
        const stopTimer = async () => {
          await axios.delete("/api/pusher/symphony/gameTimer");
        };
        stopTimer();

        setTimesUp(true);
        setTimeout(() => {
          setTimesUp(false);
          setTime(6);
        }, 1000);

        // only host controls roundChangeFunc
        roundChangeFunc(roundType);
      }
    });

    // clean up
    return () => {
      gameChannel.unbind("timer");
      gameChannel.unbind("roundChange");
    };
  }, [roundType, endScreen]);

  //   submitting responses
  const onSubmit: SubmitHandler<Input> = (data) => {
    // data contains response, send player's id and response to db
    // submit response to database
    // response: player,votes
    //disables change of submission

    const responseData = { response: data.response, player: "player_id" };
    // TO DO: send data to DB

    console.log("submitting", submittedResponse, data.response);

    if (!submittedResponse && data.response.length > 0) {
      const submitSentenceFunc = async () => {
        if (!host?.data) return;
        await submitSentence.mutateAsync({
          // TO DO CHANGE HOST ID
          hostId: host.data[0]._id.toString(),
          creatorId: session!.user.uid,
          sentence: data.response,
        });
      };
      submitSentenceFunc();
    }

    setSubmittedResponse(true);
    setSubmissionLoading(false);

    const updateData = async () => {
      await axios.post("/api/pusher/symphony/updateData", {
        hostUsername: params.username,
      });
    };
    updateData();

    // clears text area
  };

  // generate new prompts
  function handleGenerate() {
    // check if user is the host
    setSubmissionLoading(true);
    const randomPrompt = [
      "A fish goes to the grocery store.",
      "A cow is flying.",
      "A cat runs a marathon.",
      "A penguin and his best friend go to school.",
      "A bear steals honey.",
      "A duck sells lemonade.",
      "A duck buys grapes.",
      "A shiba buys ramen.",
    ];

    const randomNumber = Math.round(Math.random() * (randomPrompt.length - 1));

    const generatePrompt = async () => {
      // server will trigger an event signalling a prompt change for all players to update
      await axios.post("/api/pusher/symphony/generatePrompt", {
        prompt: "Prompt: " + randomPrompt[randomNumber],
        hostUsername: params.username,
      });
    };
    generatePrompt();
  }

  // handles round changes, host makes post requests and the server triggers changes for all players
  const roundChangeFunc = (roundTypeParam: string) => {
    const stopTimer = async () => {
      await axios.delete("/api/pusher/symphony/gameTimer");
    };
    stopTimer();

    // change from writing to voting
    if (roundTypeParam === "writing") {
      setTime(6);
      const roundChange = async () => {
        await axios.post("/api/pusher/symphony/roundChange", {
          newRound: "voting",
          roundNumber: roundNumber + 1,
          hostUsername: params.username,
        });
      };
      roundChange();

      // stops the game
      // TO DO: adjust number of rounds in a game
    } else if (roundNumber === 10) {
      setTime(6);
      const roundChange = async () => {
        await axios.post("/api/pusher/symphony/roundChange", {
          newRound: "end",
          roundNumber: roundNumber + 1,
          hostUsername: params.username,
        });
        console.log("end");
      };
      roundChange();

      // changes from voted screen to pie chart scores
    } else if (roundTypeParam === "voted") {
      setTime(6);
      const roundChange = async () => {
        await axios.post("/api/pusher/symphony/roundChange", {
          newRound: "scores",
          roundNumber: roundNumber + 1,
          hostUsername: params.username,
        });
      };
      roundChange();

      // changes from pie chart to writing
    } else if (roundTypeParam === "scores") {
      setTime(6);

      const roundChange = async () => {
        await axios.post("/api/pusher/symphony/roundChange", {
          newRound: "writing",
          roundNumber: roundNumber + 1,
          hostUsername: params.username,
        });
      };
      roundChange();

      // changes from voting to vote count screen
    } else if (roundTypeParam === "voting") {
      setTime(6);
      // triggers counting of votes
      const countVotes = async () => {
        await axios.put("/api/pusher/symphony/submittedResponse", {
          currentStory: currentStory,
          hostUsername: params.username,
        });

        await axios.post("/api/pusher/symphony/roundChange", {
          hostUsername: params.username,
          newRound: "voted",
          roundNumber: roundNumber + 1,
        });
      };
      countVotes();

      // changes from selecting a prompt to writing the first sentence
    } else if (roundTypeParam === "selecting") {
      setTime(6);
      const roundChange = async () => {
        await axios.post("/api/pusher/symphony/roundChange", {
          newRound: "writing",
          roundNumber: roundNumber + 1,
          hostUsername: params.username,
        });
      };
      roundChange();
    } else if (roundTypeParam === "end") {
    }
  };

  return (
    <div className="h-screen w-screen bg-[url('/backgrounds/brownBg.png')] bg-cover bg-no-repeat">
      {/* header with timer, prompt, and round number */}
      <div className="flex w-full justify-center">
        <div className="absolute h-fit w-full flex-row items-center rounded-b-2xl bg-[url('/backgrounds/tanTransparentBg.png')] bg-cover bg-no-repeat">
          {/* timer */}
          <div className="ml-3 p-3 text-5xl text-white">
            {timesUp ? <p>Time&apos;s Up!</p> : <p>Time: {time}</p>}
          </div>
          {/* round number */}
          <div className="absolute right-0 top-0 p-3 pr-5 text-5xl text-white">
            Round {Math.ceil(roundNumber / 4)}/8
            {/* get from size of array in database */}
          </div>
        </div>
        {/* prompt */}

        <div className="top-0 z-10 h-fit w-3/6 flex-row justify-center text-wrap rounded-b-3xl bg-[url('/backgrounds/whiteGrayBg.png')] bg-cover bg-no-repeat p-7 text-center text-4xl text-gray-600">
          {roundType === "voting" ? (
            <div>
              <p className="rounded-2xl bg-opacity-25 bg-[url('/backgrounds/lighterBrownBg.png')] bg-cover p-1 text-5xl text-white">
                Vote for the best response!
              </p>
              <p>{prompt}</p>
            </div>
          ) : roundType === "scores" ? (
            <div>
              <p className="rounded-2xl bg-opacity-25 bg-[url('/backgrounds/lighterBrownBg.png')] bg-cover p-1 text-5xl text-white">
                Current Contributions
              </p>{" "}
              <p>{prompt}</p>
            </div>
          ) : roundType === "voted" ? (
            <div>
              <p className="rounded-2xl bg-[url('/backgrounds/lighterBrownBg.png')] bg-cover p-1 text-5xl text-white">
                Votes are in!
              </p>
              <p>{prompt}</p>
            </div>
          ) : roundType === "writing" ? (
            <div>
              <p className="rounded-2xl bg-[url('/backgrounds/lighterBrownBg.png')] bg-cover p-1 text-5xl text-white">
                Write a Story Snippet!
              </p>
              <p>{prompt}</p>
            </div>
          ) : (
            <div>
              <p className="bg-coverp-1 rounded-2xl bg-[url('/backgrounds/lighterBrownBg.png')] text-5xl text-white">
                Select a Prompt for your Story!
              </p>
              <p>{prompt}</p>
            </div>
          )}

          <div
            className={`${
              roundType === "voting" ||
              roundType === "voted" ||
              roundType === "scores" ||
              roundType === "selecting"
                ? "max-h-28"
                : "max-h-80"
            } justify-center overflow-auto text-wrap break-all bg-cover bg-no-repeat p-7`}
          >
            {currentStory}
          </div>
        </div>
      </div>

      {isBothFinishedLoading && (
        <div className="top-17 absolute top-20 z-50 ml-6 flex h-1/5 w-22% items-end">
          <ChatLog
            username={player?.data ? player?.data?.username : "anonymous"}
            hostUsername={params.username}
          />
        </div>
      )}

      {/* selecting round */}
      {
        roundType === "selecting" ? (
          <div className="z-40 flex items-center justify-center">
            {/* TO DO: only host has access to these buttons */}
            <button
              className={`${isHost ? "cursor-pointer hover:bg-[url(/backgrounds/pinkBg.png)] hover:outline " : "cursor-not-allowed "} z-20 ml-10 mt-5 h-fit rounded-2xl bg-[url(/backgrounds/redBg.png)] p-4 text-4xl text-white outline outline-white`}
              disabled={submissionLoading && !isHost}
              onClick={handleGenerate}
            >
              {isHost
                ? "Generate New Prompt"
                : "Waiting for host to select a prompt..."}
            </button>
            {isHost && (
              <button
                className={`${isHost ? "cursor-pointer hover:bg-[url(/backgrounds/pinkBg.png)] hover:outline " : "cursor-not-allowed "} z-20 ml-10 mt-5 h-fit rounded-2xl bg-[url(/backgrounds/redBg.png)] p-4 text-4xl text-white outline outline-white`}
                disabled={submissionLoading && !isHost}
                onClick={() => {
                  console.log("clicked");
                  const stopTimer = async () => {
                    await axios.delete("/api/pusher/symphony/gameTimer");
                  };
                  stopTimer();

                  // change to writing round for everyone
                  roundChangeFunc(roundType);
                }}
              >
                {isHost ? "Start Game" : "Waiting for host to start..."}
              </button>
            )}
          </div>
        ) : roundType === "writing" ? (
          <form
            id="responseInput"
            className="mt-5 h-1/3"
            onSubmit={(e) => {
              e.preventDefault();
              //TO DO: see what presenceChannel.members returns
              axios.post("/api/pusher/symphony/submittedResponse", {
                playerSocketId: pusherClient.connection.socket_id,
                members: (gameChannel as PresenceChannel).members,
                hostUsername: params.username,
              });
              //disables submission after submitting once
              setSubmissionLoading(true);
              console.log("SUBMITTING");

              handleSubmit(onSubmit);
            }}
          >
            {/* text area input box */}
            <div className="flex justify-center">
              <textarea
                className={`z-20 h-40 w-1/3 rounded-xl p-3 text-3xl text-gray-700 ${
                  submittedResponse
                    ? " cursor-not-allowed bg-white opacity-60 outline"
                    : " opacity-90"
                }`}
                placeholder="Add your story snippet"
                maxLength={100}
                minLength={1}
                pattern="[a-zA-Z0-9\s\.,!@#$%^&*()-_+=;:'\"
                disabled={submittedResponse}
                {...register("response")}
              ></textarea>
            </div>
            <div className="flex justify-center">
              <button
                className={`z-20 mt-5 h-fit rounded-2xl p-4 text-4xl text-white outline-white hover:bg-[url(/backgrounds/brightRedBg.png)] hover:outline ${
                  submittedResponse || submissionLoading
                    ? "cursor-not-allowed bg-[url(/backgrounds/brightRedBg.png)] text-white outline outline-white"
                    : "bg-[url(/backgrounds/redBg.png)] opacity-90"
                }`}
              >
                {!submittedResponse && !submissionLoading
                  ? "Submit"
                  : "Waiting for other players..."}
              </button>
            </div>
          </form>
        ) : endScreen ? (
          <div> {currentStory} </div>
        ) : roundType === "voting" ? (
          // voting
          <div className="h-full w-full">
            {responses && (
              <div className="z-20 mt-6 flex h-65% w-full flex-wrap items-start justify-center">
                {/* <div className="flex items-center justify-center flex-wrap z-10"> */}
                {/* TO DO: get responses from database */}

                {responses.map((response) => (
                  <ResponseCard
                    // responses.sessionId
                    key={response.creatorId}
                    creatorId={response.creatorId}
                    response={response.sentence}
                    creatorUsername={"creator username"}
                    voterId={"hsfa"}
                    hostId={session!.user.uid}
                    hostUsername={params.username}
                    round={roundNumber}
                  />
                ))}
                {/* </div> */}
              </div>
            )}
          </div>
        ) : roundType === "voted" ? (
          <div className="h-full w-full">
            {responses && (
              <div className="z-20 mt-6 flex h-65% w-full flex-wrap items-start justify-center">
                {responses.map((response) => (
                  <VoteCount
                    key={response.creatorId}
                    creatorId={response.creatorId}
                    response={response.sentence}
                    // GET USERNAME OF CREATOR useGetPlayer("creatorId")
                    creatorUsername={"creator username"}
                    votes={
                      response.voteIds != undefined
                        ? response.voteIds.length
                        : 0
                    }
                    voterId={session!.user.uid}
                    hostId={session!.user.uid}
                    // TO DO CHANGE WON TO REAL LOGIC
                    won={false}
                  />
                ))}
              </div>
            )}
          </div>
        ) : roundType === "scores" ? (
          <div className="-m-3 flex h-fit w-full items-start justify-center">
            <PieChartWithoutSSR
              data={[
                { name: "Group A", value: 50 },
                { name: "Group B", value: 300 },
                { name: "Group C", value: 300 },
                { name: "Group D", value: 200 },
              ]}
            />
          </div>
        ) : (
          <div className="-m-3 flex h-fit w-full items-start justify-center">
            THIS PLAYER WON
            <PieChartWithoutSSR
              data={[
                { name: "Group A", value: 50 },
                { name: "Group B", value: 300 },
                { name: "Group C", value: 300 },
                { name: "Group D", value: 200 },
              ]}
            />
          </div>
        )
        // Most voted response screen
      }
      <div>
        {isSubscribed && !waiting && gameRoomExists && (
          <div className="h-full w-full">
            {/* player 1 (host) */}
            <div className="absolute bottom-0 left-0 h-1/5 w-10/12 bg-[url('/players/bunnyHead.png')] bg-contain bg-no-repeat "></div>
            <div className="absolute bottom-0 left-0 flex h-23% w-10% items-start justify-center">
              <p className="w-fit rounded-xl bg-white bg-opacity-15 pl-2 pr-2 text-center text-2xl text-pink-200">
                {params.username}
              </p>
            </div>

            {/* player 2 */}
            <div className="absolute bottom-0 left-0 flex h-1/5 w-1/5 justify-end bg-[url('/players/shibaHead.png')] bg-contain bg-right bg-no-repeat">
              <div className="absolute -top-15% bottom-0 flex h-full w-1/2 items-start justify-center">
                <p className="w-fit rounded-xl bg-white bg-opacity-15 pl-2 pr-2 text-center text-2xl text-green-200">
                  {allPlayers[1].gameName}
                </p>
              </div>
            </div>

            {/* player 5 */}
            {allPlayers.length > 4 && (
              <div className="absolute bottom-0 left-0 flex h-1/5 w-30% items-end justify-end bg-[url('/players/cowHead.png')] bg-contain bg-right bg-no-repeat ">
                <div className="absolute -top-15% bottom-0 flex h-full w-1/3 items-start justify-center">
                  <p className="w-fit rounded-xl bg-white bg-opacity-15 pl-2 pr-2 text-center text-2xl text-blue-200">
                    {allPlayers[4].gameName}
                  </p>
                </div>
              </div>
            )}

            {/* player 3 */}
            {allPlayers.length > 2 && (
              <div className="absolute bottom-0 left-0 flex h-1/5 w-30% items-end justify-end bg-[url('/players/cowHead.png')] bg-contain bg-right bg-no-repeat ">
                <div className="absolute -top-15% bottom-0 flex h-full w-1/3 items-start justify-center">
                  <p className="w-fit rounded-xl bg-white bg-opacity-15 pl-2 pr-2 text-center text-2xl text-yellow-200">
                    {allPlayers[2].gameName}
                  </p>
                </div>
              </div>
            )}

            {/* player 4 */}
            {allPlayers.length > 3 && (
              <div className="absolute bottom-0 left-0 flex h-1/5 w-2/5 justify-end bg-[url('/players/bearHead.png')] bg-contain bg-right bg-no-repeat">
                <div className="absolute -top-15% bottom-0 flex h-full w-1/4 items-start  justify-center">
                  <p className="w-fit rounded-xl bg-white bg-opacity-15 pl-2 pr-2 text-center text-2xl text-red-300">
                    {allPlayers[3].gameName}
                  </p>
                </div>
              </div>
            )}

            {/* player 6 */}
            {allPlayers.length > 5 && (
              <div className="absolute bottom-0 left-0 flex h-1/5 w-4/5 justify-end bg-[url('/players/catHead.png')] bg-contain bg-right bg-no-repeat">
                <div className="absolute -top-15% bottom-0 flex h-full w-12% items-start justify-center">
                  <p className="w-fit rounded-xl bg-white bg-opacity-15 pl-2 pr-2 text-center text-2xl text-purple-300">
                    Usern
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
