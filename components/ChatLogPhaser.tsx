import { pusherClient } from "@/services/pusher";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsChat } from "react-icons/bs";
import { BsChatDotsFill } from "react-icons/bs";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import { RiChatOffFill } from "react-icons/ri";
// import { v4 as uuid } from 'uuid';

interface Message {
  username: string;
  message: string;
}

interface Input {
  message: string;
}
export default function ChatLogPhaser(props: {
  username: string;
  hostUsername: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const presenceChannel = pusherClient.subscribe(
    `presence-home-chat-${props.hostUsername}`,
  );

  const chatLogRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [showIcon, setShowIcon] = useState<boolean>(true);
  let id: number = 0;

  const {
    register,
    handleSubmit,
    resetField,
    formState: { isSubmitting },
  } = useForm<Input>();
  useEffect(() => {
    setMessages([{ username: ":------Chat begins here------", message: "" }]);
  }, []);

  const onSubmit: SubmitHandler<Input> = async (data) => {
    await axios.post("/api/pusher/home/chatLog", {
      message: data.message,
      username: props.username,
      hostUsername: props.hostUsername,
    });
    resetField("message");
  };
  presenceChannel.bind(
    "newChat",
    (
      data: { username: string; message: string }, // +1 to the response in the data base if clicked
    ) => {
      setMessages([
        ...messages,
        { username: data.username, message: data.message },
      ]);
      setShowIcon(false);
    },
  );

  useEffect(() => {
    // Scroll to the bottom when messages change
    id += 1;

    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages, showChat]);

  useEffect(() => {
    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (showChat) {
          setShowIcon(true);
        }
      }
    };

    document.addEventListener("keydown", handleEscapePress);

    return () => {
      //   document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscapePress);
    };
  });

  return (
    // className="w-full h-full flex justify-end flex-col p-1 z-50" for bottom corner
    //z-50 h-full w-full p-1 for top corner
    <div className="h-full w-full">
      <div
        className="z-50 flex h-full w-full flex-col justify-end p-1"
        key={id}
        ref={chatBoxRef}
      >
        {showIcon ? (
          <div></div>
        ) : (
          <div
            className="z-50 flex h-full w-full flex-col justify-end p-1"
            key={id}
            ref={chatBoxRef}
          >
            {showChat ? (
              <div
                className="z-50 h-full  w-full overflow-x-hidden overflow-y-scroll rounded-t-2xl border-4 border-b-0 bg-amber-950 bg-opacity-10 p-1 pr-3 text-black scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-sky-800 scrollbar-corner-sky-800 scrollbar-track-rounded-3xl"
                ref={chatLogRef}
                onClick={() => {
                  setShowChat(false);
                }}
              >
                {messages.map((message) => (
                  <div
                    className="-mb-2 w-full rounded-2xl bg-opacity-10 bg-cover p-2 text-left text-2xl "
                    key={id}
                  >
                    {/* TO DO: change comparison statement to props.username and change colors */}
                    <span
                      className={`${
                        message.message == ""
                          ? "text-white "
                          : message.username === props.username
                            ? "text-sky-600 "
                            : "text-pink-600"
                      }`}
                    >
                      {message.username}:{" "}
                    </span>
                    <span className="break-words text-white">
                      {message.message}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="z-40 h-1/3 w-full overflow-x-hidden overflow-y-scroll rounded-t-3xl border-4 border-b-0 bg-amber-950 bg-opacity-10 p-2 text-black"
                ref={chatLogRef}
                onClick={() => {
                  setShowChat(true);
                }}
              >
                {messages.map((message) => (
                  <div className="m-2 w-full text-left text-2xl" key={id}>
                    <span
                      className={`${
                        message.message == ""
                          ? "text-white "
                          : message.username == props.username
                            ? "text-sky-600 "
                            : "text-pink-600"
                      }`}
                    >
                      {message.username}:{" "}
                    </span>
                    <span className="break-words text-white">
                      {message.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <form
              className="putline bottom-0 flex h-fit w-full items-center rounded-b-2xl bg-white"
              onSubmit={handleSubmit(onSubmit)}
            >
              <span className="w-3/4">
                <input
                  className="w-full rounded-bl-xl bg-[url(/backgrounds/whiteBg.png)] p-2 text-2xl text-black focus:cursor-text focus:border-white"
                  placeholder="Send a message in chat"
                  maxLength={50}
                  minLength={1}
                  required
                  autoComplete="off"
                  {...register("message", { min: 1 })}
                ></input>
              </span>
              <span className="w-1/4">
                <button
                  className="w-full rounded-br-xl border-4 border-t-0 bg-[url(/backgrounds/blueBg.png)] bg-cover p-2 text-2xl text-white hover:bg-[url(/backgrounds/lightBlueBg.png)]"
                  type="submit"
                >
                  Send
                </button>
              </span>
            </form>
          </div>
        )}

        <div className="m-2 flex h-1/4 w-full items-end justify-end rounded-full">
          <div
            className=" mr-4 flex h-full w-17% cursor-pointer items-center justify-center rounded-full bg-[url(/backgrounds/whiteGrayBg.png)] bg-contain text-3xl text-sky-700 outline-sky-800 hover:text-sky-800 hover:outline"
            onClick={() => {
              setShowIcon(!showIcon);
            }}
          >
            <RiChatOffFill />
          </div>
        </div>
      </div>
    </div>
  );
}
