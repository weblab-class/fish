"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import TextTransition, { presets } from "react-text-transition";

export default function TitlePageLogin() {
  const TEXTS = [
    "friendly interactive social hub",
    "flourishing interactions in social habitats",
    "friendly interspecies social hub",
    "fascinating interactions, social haven",
    "fantastic interspecies socializing hub",
    "friendly invitations, social habitat",
    "flourish in social havens",
    "fellow creatures in social harmony",
    "fun inhabitants sharing harmony",
    "friendly interspecies social hangouts",
    "friendly invites for social happiness",
    "furry invitations to social hangouts",
    "friendly interactions and social harmony",
    "friendly individuals' social habitat",
    "find incredibly special hangouts",
  ];
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [index, setIndex] = useState(0);
  const [helpContent, setHelpContent] = useState("About");

  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      3000, // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);

  return (
    <div className="h-screen w-screen bg-[url('/backgrounds/titleScreenBg.png')] bg-cover">
      <div className="flex items-center justify-center">
        {/* title of game */}
        <div className="absolute top-0 flex h-3/4 w-2/3 items-center justify-center bg-[url('/backgrounds/fishPinkText.png')] bg-cover"></div>
        <div className="absolute top-0 flex h-3/4 w-2/3 items-center justify-center bg-[url('/backgrounds/fishPinkText.png')] bg-cover">
          <h1 className="pt-14 text-center text-4xl text-gray-700">
            <TextTransition springConfig={presets.gentle}>
              {TEXTS[index % TEXTS.length]}
            </TextTransition>
          </h1>
        </div>

        {/* login cloud */}
        <a
          href="/api/auth/login/google"
          className="absolute bottom-32 h-270 w-500 bg-[url('/objects/loginCloud.png')] bg-cover hover:bg-[url('/objects/loginCloudHover.png')]"
        ></a>
        {/* help cloud */}
        <div
          className="absolute right-8 top-8 h-170 w-300 bg-[url('/objects/helpCloud.png')] bg-cover hover:bg-[url('/objects/helpCloudHover.png')]"
          onClick={() => {
            setShowHelpPopup(true);
          }}
        ></div>

        {/* how to play pop up */}
        {showHelpPopup && (
          <div className="z-30 flex h-screen w-screen items-center justify-center overscroll-none text-5xl text-white">
            <div className="z-10 h-5/6 w-3/4 rounded-3xl bg-[url('/backgrounds/blueBg.png')] bg-cover outline outline-8 outline-white">
              {/* nav bar */}
              <div className="hover:pointer mt-3  flex justify-evenly bg-[url('/backgrounds/lightBlueBg.png')] p-2">
                <span
                  className={`${helpContent === "About" ? "underline " : "text-gray-300 no-underline "} hover:cursor-pointer`}
                  onClick={() => {
                    setHelpContent("About");
                  }}
                >
                  About
                </span>
                <span
                  className={`${helpContent === "Multiplayer" ? "underline " : "text-gray-300 no-underline "} hover:cursor-pointer`}
                  onClick={() => {
                    setHelpContent("Multiplayer");
                  }}
                >
                  Multiplayer
                </span>
                <span
                  className={`${helpContent === "Game" ? "underline " : "text-gray-300 no-underline "} hover:cursor-pointer`}
                  onClick={() => {
                    setHelpContent("Game");
                  }}
                >
                  Game
                </span>
                <span
                  className={`${helpContent === "Study" ? "underline " : "text-gray-300 no-underline "} hover:cursor-pointer`}
                  onClick={() => {
                    setHelpContent("Study");
                  }}
                >
                  Study Room
                </span>

                {/* close button */}
                <div className=" top-5% absolute flex items-end justify-end">
                  <div
                    className="hover:bg-[url('/backgrounds/pinkBg.png' outline-pink-300)] z-40 flex h-16 w-16 items-center justify-center rounded-2xl bg-[url('/backgrounds/redBg.png')] text-3xl text-white hover:cursor-pointer hover:outline"
                    onClick={() => {
                      setShowHelpPopup(false);
                    }}
                  >
                    X
                  </div>
                </div>
              </div>
              {/* content */}
              <div className="p-3">
                {/* About content */}
                {helpContent === "About" && (
                  <div>
                    <h1 className="text-center text-gray-200">
                      What is f.i.s.h.?
                    </h1>
                    <p className="m-3 flex items-center text-center text-4xl">
                      f.i.s.h. is an interactive social game that blends gaming,
                      studying and socializing through cute animal characters.
                      On f.i.s.h. you can hangout, play games, and study with
                      your friends.
                    </p>
                    <h1 className="rounded-xl bg-white bg-opacity-25 p-2 text-center text-gray-700">
                      What does f.i.s.h. stand for?
                    </h1>
                    <p className="m-3 flex items-center text-center text-4xl"></p>
                  </div>
                )}
                {/* multiplayer content */}
                {helpContent === "Multiplayer" && (
                  <div>
                    <h1 className="mb-5 text-center text-5xl text-gray-200">
                      You can chat, play games, or study with your friends!
                    </h1>
                    <p className="m-3 flex items-center text-center text-4xl underline">
                      How to invite friends to your Habitat:
                    </p>
                    <p className="m-3 flex items-center text-center text-4xl">
                      1. Navigate to the Multiplayer Cloud or the Swan
                    </p>
                    <p className="m-3 flex items-center text-center text-4xl">
                      2. Add your friends&apos; usernames to your Guest List
                    </p>
                    <p className="m-3 mb-8 flex items-center text-center text-4xl">
                      3. Have your friends follow the instructions below
                    </p>
                    <p className="m-3 flex items-center text-center text-4xl underline">
                      How to visit a friend&apos;s Habitat:
                    </p>
                    <p className="m-3 flex items-center text-center text-4xl">
                      1. Make sure your friend has you on their Guest List
                    </p>
                    <p className="m-3 flex items-center text-center text-4xl">
                      2. Navigate to the Multiplayer Cloud Tab or the Swan
                    </p>
                    <p className="m-3 flex items-center text-center text-4xl">
                      3. Enter your friend&apos;s username and visit!
                    </p>
                  </div>
                )}
                {/* Game content */}
                {helpContent === "Game" && (
                  <div className="">
                    <h1 className="text-center text-4xl text-gray-200">
                      Play Sentence Symphony with friends!
                    </h1>
                    <p className="m-2 text-center text-4xl text-white">
                      Collaboratively (or competitively) blend together a story
                      one sentence at a time. Each round, every player will
                      propose a sentence to add to the story. The most voted
                      response will be added to the story. Scroll down for more
                      details!
                    </p>
                    <div className="">
                      <p className="m-3 flex items-center text-center text-4xl">
                        How to start a game:
                      </p>
                      <p className="m-3 flex items-center text-4xl">
                        1. To host a game, have all your friends visit your
                        Habitat &#40;maximum of 5 visitors&#41;
                      </p>
                      <p className="m-3 flex items-center text-center text-4xl text-gray-300">
                        IMPORTANT: Make sure all your friends are on your
                        Habitat before you start the game!
                      </p>
                      <p className="m-3 flex items-center text-center text-4xl">
                        2. Navigate to your house and start the game on your
                        T.V. --OR-- click on the Multiplayer Cloud Tab and start
                        the game from the popup
                      </p>
                      <p className="m-3 flex items-center text-center text-4xl text-gray-300">
                        NOTE: While you can play with just 1-2 players, it is
                        much more fun with 3+ players!
                      </p>

                      <p className="m-3 flex items-center text-center text-3xl">
                        How to play Sentence Symphony:
                      </p>
                      <p className="m-3 flex items-center text-3xl">
                        1. You and your friends will be collaboratively writing
                        a story given a prompt or theme.
                      </p>
                      <p className="m-3 flex items-center text-3xl">
                        2. During each round, everyone will be given 30 seconds
                        to write a sentence to add to the story.
                      </p>
                      <p className="m-3 flex items-center text-3xl">
                        3. After each round, everyone will vote on their
                        favorite response and the most voted response will be
                        added to the story. You cannot vote for yourself!
                      </p>
                      <p className="m-3 flex items-center text-3xl">
                        4. After 6 rounds, you will have your full story, and
                        you will be able to see who contributed the most!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -z-10 h-5/6 w-3/4 rounded-3xl"></div>
          </div>
        )}
      </div>
    </div>
  );
}
