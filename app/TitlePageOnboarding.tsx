"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLuciaSession } from "@/services/lucia/LuciaSessionProvider";
import { useCreatePlayer } from "@/services/react-query/mutations/player";
import { useRouter } from "next/navigation";
import { AnimalSprite } from "@/types";

/**
 * MongoServerError: E11000 duplicate key error collection: main.players index:
 * username_1 dup key: { username: "sdjfs" }
 */

type Input = {
  username: string;
};
export default function TitlePageOnboarding() {
  const [sprite, setSprite] = useState("select");
  const { register, handleSubmit, setError } = useForm<Input>();
  const [spriteSelected, setSpriteSelected] = useState(true);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const createPlayerMutation = useCreatePlayer();
  const { session } = useLuciaSession();
  if (!session) router.refresh();

  // we need to make sure that the user session is up to date (b/c server-side page is cached)
  // BUG FIXED: user that logs out after creating account for first time goes to onboarding
  useEffect(() => {
    if (session) router.refresh();
  }, []);

  const onSubmit: SubmitHandler<Input> = async (data) => {
    if (sprite === "select") {
      setSpriteSelected(false);
      setTimeout(() => {
        setSpriteSelected(true);
      }, 2000);
    }

    setLoading(true);

    try {
      await createPlayerMutation.mutateAsync({
        _id: session!.user.uid,
        username: data.username,
        animalSprite: sprite as AnimalSprite,
      });

      router.push(`/home/${data.username}`);
    } catch (error) {
      setIsError(true);
      setLoading(false);
      setTimeout(() => {
        setIsError(false);
      }, 2000);
    }
  };
  return (
    <div>
      {/* music */}
      <audio
        id="music"
        src="/music/exterior-pixel-playground-color-parade.mp3"
        autoPlay
        loop
      ></audio>
      {/* if player if new */}

      <div
        className="flex h-screen w-screen items-center justify-evenly bg-[url('/backgrounds/brownBg.png')]
        bg-cover"
      >
        <div className="absolute inset-y-0 mb-2 h-fit w-full rounded-b-xl bg-[url('/backgrounds/tanTransparentBg.png')] bg-cover p-2 text-center text-5xl text-white underline">
          Create your Character!
        </div>
        {/* preview of sprite */}
        <div className="mt-10 h-5/6 w-4/12 flex-row items-center justify-center rounded-3xl bg-[url('/backgrounds/lighterBrownBg.png')] bg-cover">
          <div className="m-4 flex h-1/2 items-center justify-center rounded-full bg-[url('/backgrounds/tanTransparentBg.png')]">
            {sprite === "select" ? (
              <p className="text-5xl text-white">Choose a character!</p>
            ) : (
              <div
                className={` h-3/4 w-4/12 bg-contain bg-center bg-no-repeat`}
                style={{ backgroundImage: `url("/players/${sprite}One.png")` }}
              ></div>
            )}
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-full justify-center">
              {/* username input */}
              <input
                className="m-5 rounded-lg p-2 text-4xl"
                placeholder="Enter a Username"
                minLength={3}
                required
                disabled={loading}
                maxLength={12}
                pattern="^[a-zA-Z0-9]*$"
                title="Only letters and numbers are allowed."
                autoComplete="off"
                {...register("username")}
              ></input>
            </div>

            <div className="h-full w-full">
              <div className="flex items-center justify-center">
                <button
                  disabled={loading}
                  className="m-5 rounded-lg bg-[url('/backgrounds/redBg.png')] p-2 text-4xl text-white outline hover:bg-[url('/backgrounds/pinkBg.png')] "
                >
                  {loading ? "Loading..." : "Confirm"}
                </button>
              </div>
              {!spriteSelected && (
                <p className="bg-[url('/backgrounds/whiteGrayBg.png')] text-center text-5xl text-red-500">
                  Please select an animal!
                </p>
              )}
              {isError && (
                <p className="bg-[url('/backgrounds/whiteGrayBg.png')] text-center text-5xl text-red-500">
                  Username is taken!
                </p>
              )}
            </div>
          </form>
        </div>
        {/* character selection display */}

        <div className="mt-10 flex h-5/6 w-6/12 flex-wrap items-center justify-center space-x-4 rounded-3xl bg-[url('/backgrounds/lighterBrownBg.png')] bg-cover">
          {/* bear */}
          {sprite === "bear" ? (
            <div className="h-1/4 w-1/5 rounded-3xl bg-[url('/backgrounds/tanTransparentBg.png')] bg-cover bg-center bg-no-repeat outline-white">
              <div className="h-full w-full cursor-pointer rounded-3xl bg-[url('/players/bearOne.png')] bg-contain bg-center bg-no-repeat outline outline-white"></div>
            </div>
          ) : (
            <div
              className="h-1/4 w-1/5 cursor-pointer rounded-3xl bg-[url('/players/bearOne.png')] bg-contain bg-center bg-no-repeat outline-white hover:bg-[url('/players/bearHover.png')]  hover:outline"
              onClick={() => {
                setSprite("bear");
                setSpriteSelected(true);
              }}
            ></div>
          )}

          {/* beaver */}
          {sprite === "beaver" ? (
            <div className="h-1/4 w-1/5 rounded-3xl bg-[url('/backgrounds/tanTransparentBg.png')] bg-cover bg-center bg-no-repeat outline-white">
              <div className="h-full w-full cursor-pointer rounded-3xl bg-[url('/players/beaverOne.png')] bg-contain bg-center bg-no-repeat outline outline-white"></div>
            </div>
          ) : (
            <div
              className="h-1/4 w-1/5 cursor-pointer rounded-3xl bg-[url('/players/beaverOne.png')] bg-contain bg-center bg-no-repeat outline-white hover:bg-[url('/players/beaverHover.png')]  hover:outline"
              onClick={() => {
                setSprite("beaver");
                setSpriteSelected(true);
              }}
            ></div>
          )}

          {/* bunny */}
          {sprite === "bunny" ? (
            <div className="h-1/4 w-1/5 rounded-3xl bg-[url('/backgrounds/tanTransparentBg.png')] bg-cover bg-center bg-no-repeat outline-white">
              <div className="h-full w-full cursor-pointer rounded-3xl bg-[url('/players/bunnyOne.png')] bg-contain bg-center bg-no-repeat outline outline-white"></div>
            </div>
          ) : (
            <div
              className="h-1/4 w-1/5 cursor-pointer rounded-3xl bg-[url('/players/bunnyOne.png')] bg-contain bg-center bg-no-repeat outline-white hover:bg-[url('/players/bunnyHover.png')]  hover:outline"
              onClick={() => {
                setSprite("bunny");
                setSpriteSelected(true);
              }}
            ></div>
          )}

          {/* cat */}
          {sprite === "cat" ? (
            <div className="h-1/4 w-1/5 rounded-3xl bg-[url('/backgrounds/tanTransparentBg.png')] bg-cover bg-center bg-no-repeat outline-white">
              <div className="h-full w-full cursor-pointer rounded-3xl bg-[url('/players/catOne.png')] bg-contain bg-center bg-no-repeat outline outline-white"></div>
            </div>
          ) : (
            <div
              className="h-1/4 w-1/5 cursor-pointer rounded-3xl bg-[url('/players/catOne.png')] bg-contain bg-center bg-no-repeat outline-white hover:bg-[url('/players/catHover.png')]  hover:outline"
              onClick={() => {
                setSprite("cat");
                setSpriteSelected(true);
              }}
            ></div>
          )}

          {/* cow */}
          {sprite === "cow" ? (
            <div className="h-1/4 w-1/5 rounded-3xl bg-[url('/backgrounds/tanTransparentBg.png')] bg-cover bg-center bg-no-repeat outline-white">
              <div className="h-full w-full cursor-pointer rounded-3xl bg-[url('/players/cowOne.png')] bg-contain bg-center bg-no-repeat outline outline-white"></div>
            </div>
          ) : (
            <div
              className="h-1/4 w-1/5 cursor-pointer rounded-3xl bg-[url('/players/cowOne.png')] bg-contain bg-center bg-no-repeat outline-white hover:bg-[url('/players/cowHover.png')]  hover:outline"
              onClick={() => {
                setSprite("cow");
                setSpriteSelected(true);
              }}
            ></div>
          )}

          {/* duck */}
          {sprite === "duck" ? (
            <div className="h-1/4 w-1/5 rounded-3xl bg-[url('/backgrounds/tanTransparentBg.png')] bg-cover bg-center bg-no-repeat outline-white">
              <div className="h-full w-full cursor-pointer rounded-3xl bg-[url('/players/duckOne.png')] bg-contain bg-center bg-no-repeat outline outline-white"></div>
            </div>
          ) : (
            <div
              className="h-1/4 w-1/5 cursor-pointer rounded-3xl bg-[url('/players/duckOne.png')] bg-contain bg-center bg-no-repeat outline-white hover:bg-[url('/players/duckHover.png')]  hover:outline"
              onClick={() => {
                setSprite("duck");
                setSpriteSelected(true);
              }}
            ></div>
          )}

          {/* hedgehog */}
          {sprite === "hedgehog" ? (
            <div className="h-1/4 w-1/5 rounded-3xl bg-[url('/backgrounds/tanTransparentBg.png')] bg-cover bg-center bg-no-repeat outline-white">
              <div className="h-full w-full cursor-pointer rounded-3xl bg-[url('/players/hedgehogOne.png')] bg-contain bg-center bg-no-repeat outline outline-white"></div>
            </div>
          ) : (
            <div
              className="h-1/4 w-1/5 cursor-pointer rounded-3xl bg-[url('/players/hedgehogOne.png')] bg-contain bg-center bg-no-repeat outline-white hover:bg-[url('/players/hedgehogHover.png')]  hover:outline"
              onClick={() => {
                setSprite("hedgehog");
              }}
            ></div>
          )}

          {/* panda */}
          {sprite === "panda" ? (
            <div className="h-1/4 w-1/5 rounded-3xl bg-[url('/backgrounds/tanTransparentBg.png')] bg-cover bg-center bg-no-repeat outline-white">
              <div className="h-full w-full cursor-pointer rounded-3xl bg-[url('/players/pandaOne.png')] bg-contain bg-center bg-no-repeat outline outline-white"></div>
            </div>
          ) : (
            <div
              className="h-1/4 w-1/5 cursor-pointer rounded-3xl bg-[url('/players/pandaOne.png')] bg-contain bg-center bg-no-repeat outline-white hover:bg-[url('/players/pandaHover.png')]  hover:outline"
              onClick={() => {
                setSprite("panda");
              }}
            ></div>
          )}

          {/* penguin */}
          {sprite === "penguin" ? (
            <div className="h-1/4 w-1/5 rounded-3xl bg-[url('/backgrounds/tanTransparentBg.png')] bg-cover bg-center bg-no-repeat outline-white">
              <div className="h-full w-full cursor-pointer rounded-3xl bg-[url('/players/penguinOne.png')] bg-contain bg-center bg-no-repeat outline outline-white"></div>
            </div>
          ) : (
            <div
              className="h-1/4 w-1/5 cursor-pointer rounded-3xl bg-[url('/players/penguinOne.png')] bg-contain bg-center bg-no-repeat outline-white hover:bg-[url('/players/penguinHover.png')]  hover:outline"
              onClick={() => {
                setSprite("penguin");
              }}
            ></div>
          )}

          {/* pig */}
          {sprite === "pig" ? (
            <div className="h-1/4 w-1/5 rounded-3xl bg-[url('/backgrounds/tanTransparentBg.png')] bg-cover bg-center bg-no-repeat outline-white">
              <div className="h-full w-full cursor-pointer rounded-3xl bg-[url('/players/pigOne.png')] bg-contain bg-center bg-no-repeat outline outline-white"></div>
            </div>
          ) : (
            <div
              className="h-1/4 w-1/5 cursor-pointer rounded-3xl bg-[url('/players/pigOne.png')] bg-contain bg-center bg-no-repeat outline-white hover:bg-[url('/players/pigHover.png')]  hover:outline"
              onClick={() => {
                setSprite("pig");
              }}
            ></div>
          )}

          {/* sheep */}
          {sprite === "sheep" ? (
            <div className="h-1/4 w-1/5 rounded-3xl bg-[url('/backgrounds/tanTransparentBg.png')] bg-cover bg-center bg-no-repeat outline-white">
              <div className="h-full w-full cursor-pointer rounded-3xl bg-[url('/players/sheepOne.png')] bg-contain bg-center bg-no-repeat outline outline-white"></div>
            </div>
          ) : (
            <div
              className="h-1/4 w-1/5 cursor-pointer rounded-3xl bg-[url('/players/sheepOne.png')] bg-contain bg-center bg-no-repeat outline-white hover:bg-[url('/players/sheepHover.png')]  hover:outline"
              onClick={() => {
                setSprite("sheep");
              }}
            ></div>
          )}

          {/* shiba */}
          {sprite === "shiba" ? (
            <div className="h-1/4 w-1/5 rounded-3xl bg-[url('/backgrounds/tanTransparentBg.png')] bg-cover bg-center bg-no-repeat outline-white">
              <div className="h-full w-full cursor-pointer rounded-3xl bg-[url('/players/shibaOne.png')] bg-contain bg-center bg-no-repeat outline outline-white"></div>
            </div>
          ) : (
            <div
              className="h-1/4 w-1/5 cursor-pointer rounded-3xl bg-[url('/players/shibaOne.png')] bg-contain bg-center bg-no-repeat outline-white hover:bg-[url('/players/shibaHover.png')]  hover:outline"
              onClick={() => {
                setSprite("shiba");
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
}
