"use client";
// TO DO: dont create sentence symphony until all players are subscribed
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { pusherClient } from "@/services/pusher";
import axios from "axios";
import { useRouter } from "next/navigation";
import ResponseCard from "@/components/symphony/ResponseCard";
import { PresenceChannel } from "pusher-js";
import ChatLog from "@/components/symphony/ChatLog";
import VoteCount from "@/components/symphony/VoteCount";
import { useMultiplayerStore } from "@/phaser/stores";
import { useLuciaSession } from "@/services/lucia/LuciaSessionProvider";
import dynamic from "next/dynamic";
import {
  useGetPlayer,
  useGetPlayerByUsername,
} from "@/services/react-query/queries/player";
import { AnimalSprite, PlayerRoomStatus } from "@/types";

import {
  getSentenceSymphony,
  useGetSentenceSymphony,
} from "@/services/react-query/queries/sentence-symphony";
import {
  useSubmitSentence,
  useCreateSentenceSymphony,
  useDeleteSentenceSymphony,
  useCalculateWinner,
  calculateWinner,
  useUpdateVote,
  startNewRound,
  useStartNewRound,
  forceSubmissions,
  useForceSubmissions,
} from "@/services/react-query/mutations/sentence-symphony";
import { PlayerInfo } from "@/phaser/types";
import { AiFillSkype } from "react-icons/ai";
import { GamePlayerInfo, SSVoteOption } from "@/services/mongo/models";
import { ImFilePdf } from "react-icons/im";

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
  const gameChannel = pusherClient.subscribe(
    `presence-ss-${params.username}`,
  ) as PresenceChannel;
  const [
    hostUsername,
    currentPlayerPhaserSprite,
    currentPlayer,
    otherPlayers,
    deleteOther,
  ] = useMultiplayerStore((state) => [
    state.hostUsername,
    state.currentPlayerPhaserSprite,
    state.currentPlayer,
    state.otherPlayers,
    state.deleteOther,
  ]);

  // session data
  const { session } = useLuciaSession();
  const playerId = session!.user.uid;
  const [isHost, setIsHost] = useState(true);
  const [allPlayers, setAllPlayers] = useState<GamePlayerInfo[]>([]);
  const [allSprites, setAllSprites] = useState<AnimalSprite[]>([]);
  const [gameRoomExists, setGameRoomExists] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const router = useRouter();

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
  const forceSubmissions = useForceSubmissions();
  const deleteSentenceSymphony = useDeleteSentenceSymphony();

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
  const [buttonPressed, setButtonPressed] = useState<boolean>(false);
  const [currentStory, setCurrentStory] = useState("");
  const [oldStory, setOldStory] = useState("");
  const [mostVoted, setMostVoted] = useState<string>("");
  const [prevWinner, setPrevWinner] = useState<SSVoteOption>();
  const [votedWinner, setVotedWinner] = useState<string>("");
  const [responses, setResponses] = useState<FullResponse[]>([]);
  const [roundNumber, setRoundNumber] = useState<number>(0);
  const [topContributor, setTopContributor] = useState<string>("");
  const [memberCount, setMemberCount] = useState<number>(0);

  const randomTestPrompts = [
    "A fish goes to the grocery store.",
    "A cow is flying.",
    "A cat runs a marathon.",
    "A penguin and his best friend go to school.",
    "A bear steals honey.",
    "A duck sells lemonade.",
    "A duck buys grapes.",
    "A shiba buys ramen.",
    "A beaver opens a cafe.",
  ];

  interface Contribution {
    playerName: string;
    value: number;
  }
  const [contributions, setContributions] = useState<Contribution[]>([]);

  //testing data (replace with multiplayer store)

  // react hook form (for writing sentences)
  const {
    register,
    handleSubmit,
    resetField,
    formState: { isSubmitting },
  } = useForm<Input>();

  // immediate game channel subscription events
  useEffect(() => {
    console.log(otherPlayers, currentPlayer, hostUsername, "otherPlayers");
    const gameChannel = pusherClient.subscribe(
      `presence-ss-${params.username}`,
    );

    gameChannel.bind("pusher:subscription_succeeded", () => {
      console.log("success yay");
      setIsSubscribed(true);
    });

    gameChannel.bind("pusher:subscription_error", (error: any) => {
      console.log("error", error);
    });

    gameChannel.bind(
      "pusher:member_added",
      (member: { id: any; info: any }) => {
        console.log("success member added,", member.info, member.id);
        setMemberCount(memberCount + 1);
        console.log("channel info:", gameChannel);
      },
    );

    // TO DO: REMOVE MEMBER FROM MULTIPLAYER STORE AND IF MEMBER REMOVED IS HOST, REDIRECT
    gameChannel.bind(
      "pusher:member_removed",
      (member: { id: any; info: any }) => {
        console.log("removed member");
      },
    );

    gameChannel.bind("gameRoomCreated", () => {
      console.log("game room binding received");
      setGameRoomExists(true);
    });
    // all players listen for new generated prompts (only host can control prompt generation)
    gameChannel.bind("generatePrompt", (data: { prompt: string }) => {
      setPrompt(data.prompt);
      setSubmissionLoading(false);
    });
  });

  // events after host and player data are loaded
  useEffect(() => {
    // makes sure timer is stopped before unloading
    const stopTimer = async () => {
      await axios.delete("/api/pusher/symphony/gameTimer");
    };

    // makes sure host data and player data are loaded
    if (!host?.data || !host.data[0] || !player?.data) return;

    const hostId = host?.data[0]._id;
    const playerId = player?.data?._id;

    if (hostId === playerId) {
      setIsHost(true);
    } else {
      setIsHost(false);
    }

    if (isHost) {
      handleGenerate;
    }

    console.log(
      (gameChannel as PresenceChannel).members.count,
      "presence",
      otherPlayers.size,
      "size",
    );
    if ((gameChannel as PresenceChannel).members.count < otherPlayers.size + 1)
      return;
    if (isHost && !gameRoomExists) {
      const createSentenceSymphonyFunc = async () => {
        if (!host.data) return;
        await createSentenceSymphony.mutateAsync({
          hostInfo: {
            uid: host.data[0]._id.toString(),
            username: params.username,
            sprite: currentPlayer?.sprite!,
            x: 0,
            y: 0,
            roomStatus: PlayerRoomStatus.EXTERIOR,
          },
          otherPlayerInfo: Array.from(otherPlayers.values()),
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

    if (isHost) {
      const hostChannel = pusherClient.subscribe(
        `presence-ss-host-${params.username}`,
      );
      hostChannel.bind("pusher:subscription_succeeded", () => {
        console.log("host success yay");
        setIsSubscribed(true);
      });
    }

    // host makes sure timer stops before unloading
    window.addEventListener("beforeunload", () => {
      stopTimer();
    });

    // clean up
    return () => {
      gameChannel.unbind_all;
      if (isHost) {
        pusherClient.unsubscribe(`presence-ss-host-${params.username}`);
      }

      pusherClient.unsubscribe(`presence-ss-${params.username}`);
      window.removeEventListener("beforeunload", () => {
        stopTimer();
      });
      stopTimer();
    };
  }, [isBothFinishedLoading, memberCount, isSubscribed]);

  // ONLY HOST changes current story, after voting is done
  useEffect(() => {
    // host listens for when voting count is done then changes the round

    if (isHost) {
      const hostChannel = pusherClient.subscribe(
        `presence-ss-host-${params.username}`,
      );
      hostChannel.bind("mostVoted", async () => {
        await axios.post("/api/pusher/symphony/roundChange", {
          newRound: "voted",
          roundNumber: roundNumber + 1,
          hostUsername: params.username,
        });
      });
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
        if (!host?.data) return;
        const gameRoomRes = await getSentenceSymphony(
          host!.data[0]._id.toString(),
        );
        const gameRoomPlayers = gameRoomRes.data?.allPlayers!; // gameRoomExists = true
        const gameRoomSprites = [
          ...gameRoomPlayers.map((player) => {
            if (!gameChannel.members.get(player.playerId.toString())) return;
            return gameChannel.members.get(player.playerId.toString()).info
              .sprite;
          }),
        ];

        console.log(gameRoomRes.data?.allPlayers, "players");

        setAllPlayers(gameRoomPlayers);
        setAllSprites(gameRoomSprites);
        console.log(gameRoomSprites, "sprites");

        setWaiting(false);
      };
      gameRoomRecFunc();
    }

    console.log("players", allPlayers);
    console.log(waiting);
  }, [gameRoomExists, isSubscribed]);

  useEffect(() => {
    console.log(allPlayers);
    if (allPlayers.length > 0) {
      setContributions([
        ...allPlayers.map(({ gameName }) => ({
          playerName: gameName,
          value: 0,
        })),
      ]);
    }
  }, [allPlayers.length]);  // TODO maybe this should be JSON.stringify because there might be some replacement, not just adding and deleting

  // timer events
  // dependencies: roundType, endScreen, player?.data

  useEffect(() => {
    // only host controls timer
    // if (!player?.data) return;

    if (!gameRoomExists) return;

    const gameChannel = pusherClient.subscribe(
      `presence-ss-${params.username}`,
    );

    let timerDuration = 6;

    if (roundType != "selecting") {
      timerDuration = 15;
    }

    // start timer after new round
    if (isHost) {
      const timer = async () => {
        await axios.post(`/api/pusher/symphony/gameTimer`, {
          time: timerDuration,
          hostUsername: params.username,
        });
      };
      timer();
    }

    gameChannel.bind("updateData", async (data: { voted: boolean }) => {
      if (!host?.data) return;
      console.log("update data", roundType);

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

        if (
          gameRoomData.sentences &&
          roundType === "voted" &&
          gameRoomData.sentences.length > 0
        ) {
          const winner =
            gameRoomData.sentences[
              gameRoomData.sentences.length - 1
            ].creatorId.toString();
          const winnerName = allPlayers.find(
            ({ playerId }) => playerId === winner,
          )?.gameName!;

          setMostVoted(
            gameRoomData.sentences[gameRoomData.sentences.length - 1].sentence,
          );
          console.log("most voted", mostVoted);
          setVotedWinner(winnerName);

          const newContributions = contributions.map((player) => {
            if (player.playerName === winnerName) {
              return { ...player, value: player.value + 1 };
            }

            return { ...player };
          });

          setContributions(newContributions);
          console.log(
            gameRoomData.sentences[gameRoomData.sentences.length - 1],
            "sentencesss",
          );

          setCurrentStory(
            currentStory +
              " " +
              gameRoomData.sentences[
                gameRoomData.sentences.length - 1
              ].sentence.toString(),
          );
        }
      }

      if (roundType === "voting" && !data.voted) {
        console.log("forcing submissions", roundType);
        await forceSubmissions.mutateAsync({
          hostId: host?.data[0]._id.toString(),
        });
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
          // if (gameRoomData.sentences.length > 0) {
          //   setCurrentStory(
          //     currentStory + gameRoomData.sentences.at(-1)!.sentence,
          //   );
          // }
        }
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
          await handleSubmit(onSubmit)();
          resetField("response");
          setButtonPressed(false);
        }

        setSubmittedResponse(false);

        setRoundType(data.newRound);

        setRoundNumber(data.roundNumber);
      },
    );

    // gameChannel.bind("mostVoted",(data:{mostVotedPrompt:string,newPrompt}))

    gameChannel.bind("timer", (data: { time: number }) => {
      console.log(data.time);

      setTime(data.time);

      if (data.time === 0 && roundNumber < 15) {
        // only host controls stopTimer
        if (isHost) {
          const stopTimer = async () => {
            await axios.delete("/api/pusher/symphony/gameTimer");
          };
          stopTimer();
        }

        setTimesUp(true);
        setTimeout(() => {
          setTimesUp(false);
          setTime(10);
        }, 1000);

        if (roundType === "story") {
          // TO DO CHANGE LINK
          if (!player?.data) return;
          const deleteGame = async () => {
            if (!host?.data) return;
            await deleteSentenceSymphony.mutateAsync({
              hostId: host?.data[0]._id.toString(),
            });
          };
          deleteGame();

          router.push(`/home/${params.username}`);
        }

        // only host controls roundChangeFunc
        if (roundType === "voted") {
          console.log("starting the pie chart data", responses, roundType);

          // clears responses for new round and calculates the winning prompt
          if (isHost) {
            const startNewRoundFunc = async () => {
              if (!host?.data || !prevWinner) return;
              await startNewRound.mutateAsync({
                hostId: host.data[0]._id.toString(),
                prevWinner: prevWinner,
              });
            };
            startNewRoundFunc();
            console.log("2 pt 2", roundType);
            const updateData = async () => {
              await axios.post("/api/pusher/symphony/updateData", {
                hostUsername: params.username,
                voted: true,
              });
            };
            console.log("updating data");
            updateData();
            console.log("2 pt 3", roundType);
          }
        }
        if (isHost) {
          roundChangeFunc(roundType);
        }
      }
    });

    // clean up
    return () => {
      gameChannel.unbind("timer");
      gameChannel.unbind("roundChange");
    };
  }, [roundType, gameRoomExists]);

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
        voted: false,
      });
    };
    updateData();

    // clears text area
  };

  // generate new prompts
  function handleGenerate() {
    // check if user is the host
    setSubmissionLoading(true);

    const randomNumber = Math.round(
      Math.random() * (randomTestPrompts.length - 1),
    );
    const randomPrompt = "Prompt: " + randomTestPrompts[randomNumber];

    const generatePrompt = async () => {
      // server will trigger an event signalling a prompt change for all players to update
      await axios.post("/api/pusher/symphony/generatePrompt", {
        prompt: randomPrompt,
        hostUsername: params.username,
      });
    };
    generatePrompt();

    return randomPrompt;
  }

  // handles round changes, host makes postn requests and the server triggers changes for all players
  const roundChangeFunc = (roundTypeParam: string) => {
    const stopTimer = async () => {
      await axios.delete("/api/pusher/symphony/gameTimer");
    };
    stopTimer();

    // change from writing to voting
    if (roundTypeParam === "writing") {
      setTime(10);
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
    } else if (roundType === "leaderboard") {
      const roundChange = async () => {
        await axios.post("/api/pusher/symphony/roundChange", {
          newRound: "story",
          roundNumber: roundNumber + 1,
          hostUsername: params.username,
        });
      };
      roundChange();
    } else if (roundNumber === 12) {
      setTime(10);
      const roundChange = async () => {
        setTopContributor(
          contributions.reduce(
            (max, current) => (current.value > max.value ? current : max),
            contributions[0],
          ).playerName,
        );

        await axios.post("/api/pusher/symphony/roundChange", {
          newRound: "leaderboard",
          roundNumber: roundNumber + 1,
          hostUsername: params.username,
        });
      };
      roundChange();

      // changes from voted screen to pie chart scores
    } else if (roundTypeParam === "voted") {
      setTime(10);
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
      setTime(10);

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
      setTime(10);
      // triggers counting of votes

      const countVotes = async () => {
        await axios.put("/api/pusher/symphony/submittedResponse", {
          currentStory: currentStory,
          hostUsername: params.username,
        });

        // CALCULATE WINNER
        if (!host?.data) return;
        console.log("calculate winners");
        const winningResponse = await calculateWinner({
          hostId: host.data[0]._id.toString(),
        });
        setPrevWinner(winningResponse);
        setMostVoted(winningResponse.sentence);

        await axios.post("/api/pusher/symphony/updateData", {
          hostUsername: params.username,
          voted: true,
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
      setTime(10);
      const roundChange = async () => {
        await axios.post("/api/pusher/symphony/roundChange", {
          newRound: "writing",
          roundNumber: roundNumber + 1,
          hostUsername: params.username,
        });
      };
      roundChange();
    }
  };

  return (
    // TO DO: replace overflow-hidden and fix overflow
    <div className="h-screen w-full overflow-hidden bg-[url('/backgrounds/brownBg.png')] bg-cover bg-no-repeat">
      {/* header with timer, prompt, and round number */}
      <div className="flex w-full justify-center">
        <div className="absolute h-fit w-full flex-row items-center rounded-b-2xl bg-[url('/backgrounds/tanTransparentBg.png')] bg-cover bg-no-repeat">
          {/* timer */}
          <div className="ml-3 p-3 text-5xl text-white">
            {timesUp ? (
              <p>Time&apos;s Up!</p>
            ) : roundType === "story" ? (
              <p>Redirect in: {time}</p>
            ) : (
              <p>Time: {time}</p>
            )}
          </div>
          {/* round number */}
          <div className="absolute right-0 top-0 p-3 pr-5 text-5xl text-white">
            Round {Math.ceil(roundNumber / 4)}/8
            {/* get from size of array in database */}
          </div>
        </div>
        {/* prompt */}

        <div className="top-0 z-10 h-fit w-3/6 flex-row justify-center text-wrap rounded-b-3xl bg-[url('/backgrounds/whiteGrayBg.png')] bg-cover bg-no-repeat p-3 text-center text-4xl text-gray-600">
          {roundType === "voting" ? (
            <div>
              <p className="m-1 rounded-2xl bg-opacity-25 bg-[url('/backgrounds/redBg.png')] bg-cover p-1 text-4xl text-white">
                Vote for the Best Response!
              </p>
              <p>{prompt}</p>
            </div>
          ) : roundType === "scores" ? (
            <div>
              <p className="m-1 rounded-2xl bg-opacity-25 bg-[url('/backgrounds/redBg.png')] bg-cover p-1 text-4xl text-white">
                Current Contributions
              </p>{" "}
              <p>{prompt}</p>
            </div>
          ) : roundType === "voted" ? (
            <div>
              <p className="m-1 rounded-2xl bg-[url('/backgrounds/redBg.png')] bg-cover p-1 text-4xl text-white">
                Votes are in!
              </p>
              <p>{prompt}</p>
            </div>
          ) : roundType === "writing" ? (
            <div>
              <p className="m-1 rounded-2xl bg-[url('/backgrounds/redBg.png')] bg-cover p-1 text-4xl text-white">
                Write a Story Snippet!
              </p>
              <p>{prompt}</p>
            </div>
          ) : roundType === "selecting" ? (
            <div>
              <p className="m-1 rounded-2xl bg-[url('/backgrounds/redBg.png')] bg-cover p-1 text-4xl text-white">
                Select a Prompt for your Story!
              </p>
              <p>{prompt}</p>
            </div>
          ) : roundType === "leaderboard" ? (
            <div>
              <p className="m-1 rounded-2xl bg-[url('/backgrounds/redBg.png')] bg-cover p-1 text-5xl text-white">
                Overall Contributions
              </p>
              <p className="rounded-2xl p-1 text-4xl text-amber-950 underline">
                {topContributor} was the top Contributor!
              </p>
              <p>{prompt}</p>
            </div>
          ) : (
            <div>
              <p className="bg-coverp-1 m-1 rounded-2xl bg-[url('/backgrounds/redBg.png')] text-5xl text-white">
                Final Story!
              </p>
              <p>{prompt}</p>
            </div>
          )}

          <div
            className={`${
              roundType === "voting" ||
              roundType === "voted" ||
              roundType === "scores" ||
              roundType === "selecting" ||
              roundType === "leaderboard"
                ? "max-h-14"
                : roundType === "story"
                  ? "h-1/3 text-4xl"
                  : "max-h-72"
            } justify-center overflow-auto text-wrap break-words bg-cover bg-no-repeat p-7 pt-2`}
          >
            {currentStory}
          </div>
        </div>
      </div>

      {isBothFinishedLoading && (
        <div className="top-17 absolute bottom-0 right-0 z-50 ml-6 flex h-34% w-1/4 items-end p-1">
          <ChatLog
            username={player?.data ? player?.data?.username : "anonymous"}
            hostUsername={params.username}
          />
        </div>
      )}

      {/* selecting round */}
      {
        roundType === "selecting" ? (
          <div className="z-50 flex items-center justify-center">
            {/* TO DO: only host has access to these buttons */}
            <button
              className={`${isHost ? "cursor-pointer hover:bg-[url(/backgrounds/pinkBg.png)] hover:outline " : "cursor-not-allowed "} z-20 ml-10 mt-5 h-fit rounded-2xl bg-[url(/backgrounds/redBg.png)] p-4 text-3xl text-white outline outline-white`}
              disabled={submissionLoading && !isHost}
              onClick={handleGenerate}
            >
              {isHost
                ? "Generate New Prompt"
                : "Waiting for host to select a prompt..."}
            </button>
            {isHost && (
              <button
                className={`${isHost ? "cursor-pointer hover:bg-[url(/backgrounds/pinkBg.png)] hover:outline " : "cursor-not-allowed "} z-20 ml-10 mt-5 h-fit rounded-2xl bg-[url(/backgrounds/redBg.png)] p-4 text-3xl text-white outline outline-white`}
                disabled={submissionLoading && !isHost}
                onClick={() => {
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
              setButtonPressed(true);
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
                className={`z-20 h-40 w-1/3 rounded-xl p-3 text-2xl text-gray-700 ${
                  buttonPressed
                    ? " cursor-not-allowed bg-white opacity-60 outline"
                    : " opacity-90"
                }`}
                placeholder="Add your story snippet"
                maxLength={100}
                minLength={1}
                required
                pattern="[a-zA-Z0-9\s\.,!@#$%^&*()-_+=;:'\"
                disabled={buttonPressed}
                {...register("response")}
              ></textarea>
            </div>
            <div className="flex justify-center">
              <button
                className={`z-20 mt-5 h-fit rounded-2xl p-4 text-3xl text-white outline-white hover:bg-[url(/backgrounds/brightRedBg.png)] hover:outline ${
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
              <div className="mt-6 flex h-65% w-full flex-wrap items-start justify-center hover:z-20">
                {/* <div className="flex items-center justify-center flex-wrap z-10"> */}
                {/* TO DO: get responses from database */}

                {responses.map((response) => (
                  <ResponseCard
                    // responses.sessionId
                    key={response.creatorId}
                    creatorId={response.creatorId}
                    response={response.sentence}
                    creatorUsername={
                      allPlayers.find(
                        (player) => player.playerId === response.creatorId,
                      )?.gameName ?? "AI-wahhh"
                    }
                    voterId={session!.user.uid}
                    hostId={
                      host?.data
                        ? host?.data[0]._id.toString()
                        : "host-not-found"
                    }
                    hostUsername={params.username}
                    round={roundNumber}
                  />
                ))}
                {/* </div> */}
              </div>
            )}
          </div>
        ) : roundType === "voted" ? (
          <div className="z-40 h-full w-full">
            {responses && (
              <div className="z-50 mt-6 flex h-65% w-full flex-wrap items-start justify-center">
                {responses.map((response) => (
                  <VoteCount
                    key={response.creatorId}
                    creatorId={response.creatorId}
                    response={response.sentence}
                    // GET USERNAME OF CREATOR useGetPlayer("creatorId")
                    creatorUsername={
                      allPlayers.find(
                        (player) => player.playerId === response.creatorId,
                      )?.gameName ?? "AI-wahhh"
                    }
                    votes={
                      response.voteIds != undefined
                        ? response.voteIds.length
                        : 0
                    }
                    voterId={session!.user.uid}
                    hostId={
                      host?.data
                        ? host?.data[0]._id.toString()
                        : "host-not-found"
                    }
                    won={mostVoted === response.sentence}
                    winningResponse={mostVoted}
                  />
                ))}
              </div>
            )}
          </div>
        ) : roundType === "scores" ? (
          <div className="mt-2 flex h-3/4 w-full items-start justify-center">
            <PieChartWithoutSSR data={contributions} />
          </div>
        ) : roundType === "leaderboard" ? (
          <div className="mt-2 flex h-3/4 w-full items-start justify-center">
            <PieChartWithoutSSR data={contributions} />
          </div>
        ) : (
          <div></div>
        )
        // Most voted response screen
      }
      <div className="z-0">
        {isSubscribed && !waiting && gameRoomExists && (
          <div className="h-full w-full">
            {/* player 1 (host) */}
            {allPlayers.length > 0 && (
              <div className="h-full w-full">
                <div
                  className={`absolute bottom-0 left-0 h-1/5 w-10/12 bg-contain bg-no-repeat `}
                  style={{
                    backgroundImage: `url(/players/${allSprites[0]}Head.png)`,
                  }}
                ></div>
                <div className="absolute bottom-0 left-0 flex h-23% w-10% items-start justify-center">
                  <p className="w-fit rounded-xl bg-black bg-opacity-30 pl-2 pr-2 text-center text-2xl text-pink-200">
                    {params.username}
                  </p>
                </div>
              </div>
            )}

            {/* player 2 */}
            {allPlayers.length > 1 && (
              <div
                className={`absolute bottom-0 left-0 flex h-1/5 w-1/5 justify-end bg-contain bg-right bg-no-repeat`}
                style={{
                  backgroundImage: `url(/players/${allSprites[1]}Head.png)`,
                }}
              >
                <div className="absolute -top-15% bottom-0 flex h-full w-1/2 items-start justify-center">
                  <p className="w-fit rounded-xl bg-black bg-opacity-30 pl-2 pr-2 text-center text-2xl text-green-200">
                    {allPlayers[1].gameName}
                  </p>
                </div>
              </div>
            )}

            {/* player 3 */}
            {allPlayers.length > 2 && (
              <div
                className={`absolute bottom-0 left-0 flex h-1/5 w-30% items-end justify-end bg-contain bg-right bg-no-repeat `}
                style={{
                  backgroundImage: `url(/players/${allSprites[2]}Head.png)`,
                }}
              >
                <div className="absolute -top-15% bottom-0 flex h-full w-1/3 items-start justify-center">
                  <p className="w-fit rounded-xl bg-black bg-opacity-30 pl-2 pr-2 text-center text-2xl text-purple-200">
                    {allPlayers[2].gameName}
                  </p>
                </div>
              </div>
            )}

            {/* player 4 */}
            {allPlayers.length > 3 && (
              <div
                className={`absolute bottom-0 left-0 flex h-1/5 w-2/5 justify-end bg-[url('/players/${allSprites[3]}Head.png')] bg-contain bg-right bg-no-repeat `}
                style={{
                  backgroundImage: `url(/players/${allSprites[3]}Head.png)`,
                }}
              >
                <div className="absolute -top-15% bottom-0 flex h-full w-1/4 items-start  justify-center">
                  <p className="w-fit rounded-xl bg-black bg-opacity-30 pl-2 pr-2 text-center text-2xl text-red-300">
                    {allPlayers[3].gameName}
                  </p>
                </div>
              </div>
            )}

            {/* player 5 */}
            {allPlayers.length > 4 && (
              <div
                className={`w-48% absolute bottom-0 left-0 flex h-1/5 items-end justify-end bg-contain bg-right bg-no-repeat `}
                style={{
                  backgroundImage: `url(/players/${allSprites[4]}Head.png)`,
                }}
              >
                <div className="absolute -top-15% bottom-0 flex h-full w-1/5 items-start justify-center">
                  <p className="w-fit rounded-xl bg-black bg-opacity-30 pl-2 pr-2 text-center text-2xl text-blue-200">
                    {allPlayers[4].gameName}
                  </p>
                </div>
              </div>
            )}

            {/* player 6 */}
            {allPlayers.length > 5 && (
              <div
                className={`w-56% absolute bottom-0 left-0 flex h-1/5 justify-end bg-[url('/players/${allSprites[5]}Head.png')] bg-contain bg-right bg-no-repeat`}
                style={{
                  backgroundImage: `url(/players/${allSprites[5]}Head.png)`,
                }}
              >
                <div className="absolute -top-15% bottom-0 flex h-full w-12% items-start justify-center">
                  <p className="w-fit rounded-xl bg-black bg-opacity-30 pl-2 pr-2 text-center text-2xl text-yellow-200">
                    {allPlayers[5].gameName}
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
