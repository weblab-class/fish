"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { pusherClient } from "@/services/pusher";
import axios from "axios";
import { useRouter } from "next/navigation";
import ResponseCard from "@/components/symphony/ResponseCard";
import { PresenceChannel } from "pusher-js";
import ChatLog from "@/components/symphony/ChatLog";
import VoteCount from "@/components/symphony/VoteCount";
import { useHomeStore, useMultiplayerStore } from "@/phaser/stores";
import { useLuciaSession } from "@/services/lucia/LuciaSessionProvider";
import dynamic from "next/dynamic";
import { takeWhile as _takeWhile, random as _random } from "lodash";
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
  useUpdateVote,
  startNewRound,
  useStartNewRound,
  forceSubmissions,
  useForceSubmissions,
} from "@/services/react-query/mutations/sentence-symphony";
import { PlayerInfo } from "@/phaser/types";
import { AiFillSkype } from "react-icons/ai";
import { GamePlayerInfo } from "@/services/mongo/models";
import ChatLogPhaser from "@/components/ChatLogPhaser";
import { IoMdHelp } from "react-icons/io";
import HelpPopup from "@/components/HelpPopup";

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

  type Response = {
    creatorId: string;
    sentence: string;
    voterIds: string[];
  };
  // session data
  const { session } = useLuciaSession();
  const playerId = session!.user.uid;
  const [isHost, setIsHost] = useState(true);
  const [allPlayers, setAllPlayers] = useState<GamePlayerInfo[]>([]);
  const [allSprites, setAllSprites] = useState<AnimalSprite[]>([]);
  const [gameRoomExists, setGameRoomExists] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [responsesData, setResponsesData] = useState<Response[]>([]);

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

  type Winner = {
    creatorId: string;
    sentence: string;
  };
  // specific game stuff
  const [roundType, setRoundType] = useState<string>("selecting");
  const [prompt, setPrompt] = useState<string>("Prompt/Theme");
  const [endScreen, setEndScreen] = useState<boolean>(false);
  const [submittedResponse, setSubmittedResponse] = useState<boolean>(false);
  const [buttonPressed, setButtonPressed] = useState<boolean>(false);
  const [currentStory, setCurrentStory] = useState("");
  const [oldStory, setOldStory] = useState("");
  const [mostVoted, setMostVoted] = useState<string>("");
  const [votedWinner, setVotedWinner] = useState<string>("");
  const [votedWinners, setVotedWinners] = useState<string[]>([]);
  const [tie, setTie] = useState<boolean>(false);
  const [sentenceWinners, setSentenceWinners] = useState<Winner[]>([]);
  const [responses, setResponses] = useState<FullResponse[]>([]);
  const [roundNumber, setRoundNumber] = useState<number>(0);
  const [topContributor, setTopContributor] = useState<string>("");
  const [memberCount, setMemberCount] = useState<number>(0);
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [deadPlayers, setDeadPlayers] = useState<GamePlayerInfo[]>([]);

  const [
    game,
    showInvitePopup,
    showMailPopup,
    showEaselPopup,
    showHelpPopup,
    showPopup,
    setDefault,
  ] = useHomeStore((state) => [
    state.game,
    state.showInvitePopup,
    state.showMailPopup,
    state.showEaselPopup,
    state.showHelpPopup,
    state.showPopup,
    state.setDefault,
  ]);

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
    "An ant takes over the world.",
    "A cow teaches math.",
  ];

  const forceSubmit = async function () {
    if (!host?.data) return;
    if (isHost) {
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
    }
  };

  let intervalId: NodeJS.Timeout | undefined;
  const stopTimer = function () {};
  const timerControl = async function (startTime: number) {
    let time = startTime;

    intervalId = setInterval(async () => {
      time -= 1;
      if (time >= 0) {
        const triggerTimer = async () => {
          await axios.post("/api/pusher/symphony/timeChange", {
            time: time,
            hostUsername: params.username,
          });
          // await pusherServer.trigger(`presence-ss-${hostUsername}`, "timer", {
          //   time,
          // });
        };
        await triggerTimer();
      } else {
        clearInterval(intervalId);
      }
    }, 1000);
  };

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
    const gameChannel = pusherClient.subscribe(
      `presence-ss-${params.username}`,
    ) as PresenceChannel;

    gameChannel.bind("pusher:subscription_succeeded", () => {
      setIsSubscribed(true);
    });

    gameChannel.bind("pusher:subscription_error", (error: any) => {});

    gameChannel.bind(
      "pusher:member_added",
      (member: { id: any; info: any }) => {
        if (!gameRoomExists) {
          setMemberCount(memberCount + 1);
        }
      },
    );

    gameChannel.bind(
      "pusher:member_removed",
      async (member: { id: any; info: any }) => {
        setDeadPlayers([
          ...deadPlayers,
          { playerId: member.id, gameName: member.info.username },
        ]);

        if (member.info.username === params.username) {
          // router.push(`/home/${params.username}`);

          if (isHost) {
            await deleteSentenceSymphony.mutateAsync({
              hostId: member.id,
            });
          }

          window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN}`;
        }
      },
    );

    gameChannel.bind("gameRoomCreated", () => {
      setGameRoomExists(true);
    });

    // all players listen for new generated prompts (only host can control prompt generation)
    gameChannel.bind("generatePrompt", (data: { prompt: string }) => {
      setPrompt(data.prompt);
      setSubmissionLoading(false);
    });

    gameChannel.bind("topContributor", (data: { topContributor: string }) => {
      setTopContributor(data.topContributor);
    });

    return () => {
      gameChannel.unbind_all();
      gameChannel.unsubscribe();
    };
  }, []);

  useEffect(() => {}, [gameRoomExists]);

  // events after host and player data are loaded
  useEffect(() => {
    // makes sure timer is stopped before unloading
    if (isHost) {
      stopTimer();
    }

    // makes sure host data and player data are loaded
    if (!host?.data || !host.data[0] || !player?.data) return;

    const hostId = host?.data[0]._id;
    const playerId = player?.data?._id;

    if (hostId === playerId) {
      setIsHost(true);
    } else {
      setIsHost(false);
    }

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

      if (isHost) {
        handleGenerate();
      }

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
      ) as PresenceChannel;
      hostChannel.bind("pusher:subscription_succeeded", () => {
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

      hostChannel.bind(
        "mostVoted",
        async (data: { mostVotedResponse: string }) => {
          setCurrentStory(currentStory + data.mostVotedResponse);

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

        setAllPlayers(gameRoomPlayers);
        setPlayerCount(gameRoomPlayers.length);
        setAllSprites(gameRoomSprites);

        setWaiting(false);
      };
      gameRoomRecFunc();
    }
  }, [gameRoomExists, isSubscribed]);

  useEffect(() => {
    if (allPlayers.length > 0) {
      setContributions([
        ...allPlayers.map(({ gameName }) => ({
          playerName: gameName,
          value: 0,
        })),
      ]);
    }
  }, [allPlayers.length]);

  useEffect(() => {
    if (isHost) {
      const hostChannel = pusherClient.subscribe(
        `presence-ss-host-${params.username}`,
      );

      //each player triggers submit vote, the host controls the votte count
      hostChannel.bind(
        "submitVote",
        (data: {
          creatorId: string;
          sentence: string;
          voterId: string;
          responsesData: Response[];
        }) => {
          const voteOptions = responsesData;
          const creatorIndex = voteOptions.findIndex(
            (opt) => opt.creatorId === data.creatorId,
          );

          const creatorOptData = voteOptions.at(creatorIndex)!;
          voteOptions[creatorIndex] = {
            creatorId: voteOptions[creatorIndex].creatorId,
            sentence: creatorOptData.sentence,
            voterIds: [...creatorOptData.voterIds, data.voterId],
          };

          setResponsesData(voteOptions);

          const updateResponses = async () => {
            axios.post("/api/pusher/symphony/updateResponses", {
              responses: voteOptions,
              hostUsername: params.username,
            });
          };
          updateResponses();
        },
      );

      hostChannel.bind(
        "pusher:member_removed",
        async (member: { id: any; info: any }) => {
          // await axios.post("/api/pusher/symphony/newMessage", {
          //   hostUsername: params.username,
          //   message: "hiiiii",
          //   username: "left",
          // });
          if (member.info.username === params.username) {
            if (!host?.data) return;
            await deleteSentenceSymphony.mutateAsync({
              hostId: host?.data[0]._id.toString(),
            });
          }
        },
      );

      hostChannel.bind("deleteResponses", () => {
        const updateResponses = async () => {
          await axios.post("/api/pusher/symphony/updateResponses", {
            responses: [],
          });
        };
        updateResponses();
      });
      return () => {
        hostChannel.unbind_all();
        // hostChannel.unsubscribe;
      };
    }
  }, [responsesData, roundType]);

  useEffect(() => {
    if (true) {
      if (true) {
        gameChannel.bind("submitSentence", (data: { response: Response }) => {
          const newResponses = [...responsesData, data.response];
          if (responsesData.includes(data.response)) return;
          setResponsesData((prevSentences) => [
            ...prevSentences,
            data.response,
          ]);
        });
        return () => {
          gameChannel.unbind("submitSentence");
        };
      }
      return () => {
        gameChannel.unbind("submitSentence");
      };
    }
  });

  // timer events
  // dependencies: roundType, player?.data
  useEffect(() => {
    // only host controls timer
    // if (!player?.data) return;

    if (!gameRoomExists) return;

    const gameChannel = pusherClient.subscribe(
      `presence-ss-${params.username}`,
    ) as PresenceChannel;

    let timerDuration = 15;

    if (roundType == "selecting" || roundType == "voting") {
      timerDuration = 15;
    } else if (roundType == "writing") {
      timerDuration = 30;
    } else if (roundType == "voted" || roundType == "scores") {
      timerDuration = 10;
    }

    // start timer after new round
    if (isHost) {
      const timer = async () => {
        clearInterval(intervalId);

        await timerControl(timerDuration);
      };
      timer();
    }

    gameChannel.bind("updateResponses", (data: { responses: Response[] }) => {
      setResponsesData((prevSentences) => data.responses);
    });

    gameChannel.bind(
      "updateContributions",
      (data: {
        contributions: Contribution[];
        tie: boolean;
        winnerId: string;
      }) => {
        setContributions(data.contributions);

        setVotedWinner(data.winnerId);

        setTie(data.tie);
      },
    );

    gameChannel.bind("updateStory", (data: { story: string }) => {
      setCurrentStory(data.story);
    });

    // ALL PLAYERS the host makes a call to the server when the round should change. Then, all players listen for "roundChange" event to trigger. Then, every player updates their RoundType and RoundNumber
    // ROUND CHANGE BINDING
    gameChannel.bind(
      "roundChange",
      async (data: { newRound: string; roundNumber: number }) => {
        //submit all responses when time runs out

        if (data.newRound === "voting") {
          // COMMENT THIS BACK IN GO BACK
          await handleSubmit(onSubmit)();
          resetField("response");
          setButtonPressed(false);
        }
        if (data.newRound == "writing") {
          setTie(false);
        }

        setSubmittedResponse(false);
        setButtonPressed(false);

        setRoundType(data.newRound);

        setRoundNumber(data.roundNumber);
        if (data.roundNumber > 24) {
          setRoundNumber(24);
        }
      },
    );

    // gameChannel.bind("mostVoted",(data:{mostVotedPrompt:string,newPrompt}))

    gameChannel.bind("updateTime", (data: { time: number }) => {
      setTime(data.time);

      if (data.time === 0 && roundNumber < 30) {
        // only host controls stopTimer

        if (isHost) {
          stopTimer();
        }

        setTimesUp(true);

        setTimeout(() => {
          setTimesUp(false);
        }, 1000);

        if (roundType === "story") {
          if (!player?.data) return;
          const deleteGame = async () => {
            if (!host?.data) return;
            await deleteSentenceSymphony.mutateAsync({
              hostId: host?.data[0]._id.toString(),
            });
          };
          deleteGame();

          // router.push(`/home/${params.username}`);
          window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN}`;
        }

        // only host controls roundChangeFunc
        if (roundType === "voted") {
          // clears responses for new round and calculates the winning prompt
          if (isHost) {
            const startNewRoundFunc = async () => {
              const voteOptions = responsesData;

              voteOptions.sort((a, b) => b.voterIds.length - a.voterIds.length);

              const maxVoteOptions = _takeWhile(
                voteOptions,
                (v) => v.voterIds.length === voteOptions[0].voterIds.length,
              );
              const pickedOpt =
                maxVoteOptions[_random(0, maxVoteOptions.length - 1)];

              const newSentences = [
                ...sentenceWinners,
                {
                  sentence: pickedOpt.sentence,
                  creatorId: pickedOpt.creatorId,
                },
              ];

              setSentenceWinners(newSentences);

              const newStory = currentStory + " " + pickedOpt.sentence;
              await axios.post("/api/pusher/symphony/updateStory", {
                story: newStory,
                hostUsername: params.username,
              });

              const winnerName = allPlayers.find(
                ({ playerId }) => playerId === pickedOpt.creatorId,
              )?.gameName!;
              // const winnerName = allPlayers.find(
              //   (player: { playerId: string }) => player.playerId === winner,
              // ).gameName;
              setMostVoted(pickedOpt.sentence);
              setVotedWinner(winnerName);

              const newContributions = contributions.map((player) => {
                if (player.playerName === winnerName) {
                  return { ...player, value: player.value + 1 };
                }

                return { ...player };
              });

              setContributions(newContributions);

              const tie = maxVoteOptions.length > 1;

              await axios.post("/api/pusher/symphony/updateContributions", {
                contributions: contributions.map((player) => {
                  if (player.playerName === winnerName) {
                    return { ...player, value: player.value + 1 };
                  }

                  return { ...player };
                }),

                // ERROR: maxVoteOptions undefined ?
                hostUsername: params.username,
                winnerId: winnerName,
                // winnerId: maxVoteOptions.map((options) => {
                //   options.creatorId;
                // }),
                tie: tie,
              });

              await axios.post("/api/pusher/symphony/updateResponses", {
                hostUsername: params.username,
                responses: [],
              });
            };
            startNewRoundFunc();
          }
        }
        if (isHost) {
          roundChangeFunc(roundType);
        }
      }
    });
    gameChannel.bind("timer", (data: { time: number }) => {
      setTime(data.time);

      if (data.time === 0 && roundNumber < 30) {
        // only host controls stopTimer
        if (isHost) {
          stopTimer();
        }

        setTimesUp(true);

        setTimeout(() => {
          setTimesUp(false);
        }, 1000);

        if (roundType === "story") {
          if (!player?.data) return;
          const deleteGame = async () => {
            if (!host?.data) return;
            await deleteSentenceSymphony.mutateAsync({
              hostId: host?.data[0]._id.toString(),
            });
          };
          deleteGame();

          // router.push(`/home/${params.username}`);
          window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN}`;
        }

        // only host controls roundChangeFunc
        if (roundType === "voted") {
          // clears responses for new round and calculates the winning prompt
          if (isHost) {
            const startNewRoundFunc = async () => {
              const voteOptions = responsesData;

              voteOptions.sort((a, b) => b.voterIds.length - a.voterIds.length);

              const maxVoteOptions = _takeWhile(
                voteOptions,
                (v) => v.voterIds.length === voteOptions[0].voterIds.length,
              );
              const pickedOpt =
                maxVoteOptions[_random(0, maxVoteOptions.length - 1)];

              const newSentences = [
                ...sentenceWinners,
                {
                  sentence: pickedOpt.sentence,
                  creatorId: pickedOpt.creatorId,
                },
              ];

              setSentenceWinners(newSentences);

              const newStory = currentStory + " " + pickedOpt.sentence;
              await axios.post("/api/pusher/symphony/updateStory", {
                story: newStory,
                hostUsername: params.username,
              });

              const winnerName = allPlayers.find(
                ({ playerId }) => playerId === pickedOpt.creatorId,
              )?.gameName!;
              // const winnerName = allPlayers.find(
              //   (player: { playerId: string }) => player.playerId === winner,
              // ).gameName;
              setMostVoted(pickedOpt.sentence);
              setVotedWinner(winnerName);

              const newContributions = contributions.map((player) => {
                if (player.playerName === winnerName) {
                  return { ...player, value: player.value + 1 };
                }

                return { ...player };
              });

              setContributions(newContributions);

              const tie = maxVoteOptions.length > 1;

              await axios.post("/api/pusher/symphony/updateContributions", {
                contributions: contributions.map((player) => {
                  if (player.playerName === winnerName) {
                    return { ...player, value: player.value + 1 };
                  }

                  return { ...player };
                }),

                // ERROR: maxVoteOptions undefined ?
                hostUsername: params.username,
                winnerId: winnerName,
                // winnerId: maxVoteOptions.map((options) => {
                //   options.creatorId;
                // }),
                tie: tie,
              });

              await axios.post("/api/pusher/symphony/updateResponses", {
                hostUsername: params.username,
                responses: [],
              });
            };
            startNewRoundFunc();
          }
        }
        if (isHost) {
          roundChangeFunc(roundType);
        }
      }
    });

    // clean up
    return () => {
      gameChannel.unbind("updateTime");

      gameChannel.unbind("roundChange");
    };
  }, [roundType, gameRoomExists]);

  //   submitting responses
  const onSubmit: SubmitHandler<Input> = async (data) => {
    if (!submittedResponse) {
      let responseSubmitted = "";
      if (data.response == "") {
        responseSubmitted =
          "This player submitted nothing. This will be replaced by AI later :)";
      } else {
        await axios.post("/api/pusher/symphony/submitResponse", {
          response: {
            sentence: data.response,
            creatorId: session!.user.uid,
            voterIds: [],
          },
          hostUsername: params.username,
        });
      }
    }

    setSubmissionLoading(false);
    setButtonPressed(false);

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
    stopTimer();

    // change from writing to voting
    if (roundTypeParam === "writing") {
      setTime(30);
      const roundChange = async () => {
        await axios.post("/api/pusher/symphony/roundChange", {
          newRound: "voting",
          roundNumber: roundNumber + 1,
          hostUsername: params.username,
        });
      };
      roundChange();

      // stops the game
    } else if (roundType === "leaderboard") {
      const roundChange = async () => {
        await axios.post("/api/pusher/symphony/roundChange", {
          newRound: "story",
          roundNumber: roundNumber + 1,
          hostUsername: params.username,
        });
      };
      roundChange();
    } else if (roundNumber === 24) {
      setTime(15);

      const roundChange = async () => {
        const topContribution = contributions.reduce(
          (max, current) => (current.value > max.value ? current : max),
          contributions[0],
        ).playerName;

        await axios.post("/api/pusher/symphony/topContributor", {
          topContributor: topContribution,
          hostUsername: params.username,
        });

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
      setTime(30);

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

        await axios.post("/api/pusher/symphony/roundChange", {
          hostUsername: params.username,
          newRound: "voted",
          roundNumber: roundNumber + 1,
        });
      };
      countVotes();

      // changes from selecting a prompt to writing the first sentence
    } else if (roundTypeParam === "selecting") {
      setTime(30);
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
    <div className="h-screen w-full overflow-hidden bg-[url('/backgrounds/brownBg.png')] bg-cover bg-no-repeat">
      {/* music */}
      <audio
        src="/music/game1-the-gaming-of-the-shrew-zac-tiessen.mp3"
        autoPlay
        loop
      ></audio>
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
            Round {Math.ceil(roundNumber / 4)}/6
            {/* get from size of array in database */}
          </div>
        </div>
        {/* prompt */}

        <div className="top-0 z-10 h-fit w-3/6 flex-row justify-center text-wrap rounded-b-3xl bg-[url('/backgrounds/whiteGrayBg.png')] bg-cover bg-no-repeat p-3 text-center text-4xl text-gray-600">
          {roundType === "voting" ? (
            <div>
              <p className="m-1 rounded-2xl bg-opacity-25 bg-[url('/backgrounds/redBg.png')] bg-cover p-1 text-4xl text-white">
                Vote for the best response!
              </p>
              <p className="text-3xl">{prompt}</p>
            </div>
          ) : roundType === "scores" ? (
            <div>
              <p className="m-1 rounded-2xl bg-opacity-25 bg-[url('/backgrounds/redBg.png')] bg-cover p-1 text-4xl text-white">
                Current Contributions
              </p>{" "}
              {tie ? (
                <p className="rounded-2xl p-1 text-3xl text-amber-950 underline">
                  There was a tie! So... we picked our favorite: {votedWinner}{" "}
                  won this round!
                </p>
              ) : (
                <p className="rounded-2xl p-1 text-3xl text-amber-950 underline">
                  {votedWinner} won this round!
                </p>
              )}
              <p className="text-3xl">{prompt}</p>
            </div>
          ) : roundType === "voted" ? (
            <div>
              <p className="m-1 rounded-2xl bg-[url('/backgrounds/redBg.png')] bg-cover p-1 text-4xl text-white">
                {tie
                  ? "Votes are in! There was a tie! We picked our favorite :)"
                  : "Votes are in!"}
              </p>
              <p className="text-3xl">{prompt}</p>
            </div>
          ) : roundType === "writing" ? (
            <div>
              <p className="m-1 rounded-2xl bg-[url('/backgrounds/redBg.png')] bg-cover p-1 text-4xl text-white">
                Write a Story Snippet!
              </p>
              <p className="text-3xl">{prompt}</p>
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
              <p className="m-1 rounded-2xl bg-[url('/backgrounds/redBg.png')] bg-cover p-1 text-4xl text-white">
                Overall Contributions
              </p>
              <p className="rounded-2xl p-1 text-3xl text-amber-950 underline">
                {topContributor} was the top Contributor!
              </p>
              <p className="text-3xl">{prompt}</p>
            </div>
          ) : (
            <div>
              <p className="bg-coverp-1 m-1 rounded-2xl bg-[url('/backgrounds/redBg.png')] text-4xl text-white">
                Final Story!
              </p>
              <p className="text-3xl">{prompt}</p>
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
        <div className="z-50">
          {showHelpPopup && (
            <div className="overflow-hiddenh-fit absolute inset-0 z-50 flex w-fit items-center justify-center">
              <HelpPopup defaultTab="Game" />
            </div>
          )}
          <div className="top-17 absolute bottom-0 right-0 z-50 ml-6 flex h-34% w-1/4 items-end p-1">
            <ChatLog
              username={player?.data ? player?.data?.username : "anonymous"}
              hostUsername={params.username}
            />
          </div>
          <div
            className="absolute bottom-0 right-1/4 z-40 mb-4 h-fit w-fit cursor-pointer rounded-full bg-[url(/backgrounds/whiteGrayBg.png)] bg-contain p-3 pl-4 pr-4 text-center text-4xl text-red-400 outline-red-400 hover:text-red-500 hover:outline"
            onClick={() => {
              showPopup("help");
            }}
          >
            <IoMdHelp />
          </div>
        </div>
      )}

      {/* selecting round */}
      {
        roundType === "selecting" ? (
          <div className="z-50 flex items-center justify-center">
            <button
              className={`${isHost ? "cursor-pointer hover:bg-[url(/backgrounds/pinkBg.png)] hover:outline " : "cursor-not-allowed "} z-20 ml-10 mt-5 h-fit rounded-2xl bg-[url(/backgrounds/redBg.png)] p-4 text-3xl text-white outline outline-white`}
              disabled={submissionLoading && !isHost}
              onClick={handleGenerate}
            >
              {isHost
                ? "Generate New Prompt"
                : "Waiting for host to select a prompt..."}
            </button>
          </div>
        ) : roundType === "writing" ? (
          <form
            id="responseInput"
            className="mt-5 h-1/3"
            onSubmit={async (e) => {
              e.preventDefault();
              setButtonPressed(true);

              setSubmissionLoading(true);
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
          <div className="w-fullz-10 h-full">
            {responses && (
              <div className="z-10 mt-6 flex h-65% w-full flex-wrap items-start justify-center hover:z-20">
                {responsesData.map((response) => (
                  <ResponseCard
                    // responses.sessionId
                    key={response.creatorId}
                    creatorId={response.creatorId}
                    response={response.sentence}
                    creatorUsername={
                      allPlayers.find(
                        (player) => player.playerId === response.creatorId,
                      )?.gameName ?? "Anonymous"
                    }
                    voterId={session!.user.uid}
                    hostId={
                      host?.data
                        ? host?.data[0]._id.toString()
                        : "host-not-found"
                    }
                    hostUsername={params.username}
                    round={roundNumber}
                    responsesData={responsesData}
                  />
                ))}
                {/* </div> */}
              </div>
            )}
          </div>
        ) : roundType === "voted" ? (
          <div className="z-20 h-full w-full">
            {responses && (
              <div className="z-20 mt-6 flex h-65% w-full flex-wrap items-start justify-center">
                {responsesData.map((response) => (
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
                      response.voterIds != undefined
                        ? response.voterIds.length
                        : 0
                    }
                    voterId={session!.user.uid}
                    hostId={
                      host?.data
                        ? host?.data[0]._id.toString()
                        : "host-not-found"
                    }
                    won={false}
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
                className={`absolute bottom-0 left-0 flex h-1/5 w-48% items-end justify-end bg-contain bg-right bg-no-repeat `}
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
                className={`absolute bottom-0 left-0 flex h-1/5 w-56% justify-end bg-[url('/players/${allSprites[5]}Head.png')] bg-contain bg-right bg-no-repeat`}
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
