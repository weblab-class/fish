import { pusherClient } from "@/services/pusher";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
// import { v4 as uuid } from 'uuid';

interface Message {
  username: string;
  message: string;
}

interface Input {
  message: string;
}
export default function ChatLog(props: {
  username: string;
  hostUsername: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const presenceChannel = pusherClient.subscribe(
    `presence-ss-chat-${props.hostUsername}`,
  );
  const chatLogRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [showChat, setShowChat] = useState<boolean>(false);
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
    console.log(data.message, props.username);

    await axios.post("/api/pusher/symphony/newMessage", {
      message: data.message,
      username: props.username,
    });
    resetField("message");
  };
  presenceChannel.bind(
    "newChat",
    (
      data: { username: string; message: string }, // +1 to the response in the data base if clicked
    ) =>
      setMessages([
        ...messages,
        { username: data.username, message: data.message },
      ]),
  );

  useEffect(() => {
    // Scroll to the bottom when messages change
    id += 1;

    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages, showChat]);

  useEffect(() => {
    // const handleClickOutside = (event: MouseEvent) => {
    //   if (
    //     chatBoxRef.current &&
    //     !chatBoxRef.current.contains(event.target as Node)
    //   ) {
    //     setShowChat(false);
    //   }
    // };
    // document.addEventListener("click", handleClickOutside);

    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (showChat) {
          setShowChat(false);
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
    <div className="z-50 h-full w-full p-1" key={id} ref={chatBoxRef}>
      {showChat ? (
        <div
          className="z-50 h-3/4 w-full overflow-x-hidden overflow-y-scroll rounded-t-2xl border-4 border-b-0 bg-white bg-opacity-20 p-1 pr-3 text-black"
          ref={chatLogRef}
          onClick={() => {
            setShowChat(false);
          }}
        >
          {messages.map((message) => (
            <div
              className="-mb-2 w-full rounded-2xl bg-opacity-10 bg-cover p-2 text-2xl "
              key={id}
            >
              {/* TO DO: change comparison statement to props.username and change colors */}
              <span
                className={`${
                  message.message == ""
                    ? "text-white "
                    : message.username == "user"
                      ? "text-green-200 "
                      : "text-pink-200"
                }`}
              >
                {message.username}:{" "}
              </span>
              <span className="break-words text-white">{message.message}</span>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="z-40 h-1/3 w-full overflow-hidden overflow-x-hidden rounded-t-3xl border-4 border-b-0 bg-white bg-opacity-20 p-2 text-black"
          ref={chatLogRef}
          onClick={() => {
            setShowChat(true);
          }}
        >
          {messages.map((message) => (
            <div className="m-2 w-full text-2xl" key={id}>
              <span
                className={`${
                  message.message == ""
                    ? "text-white "
                    : message.username == "user"
                      ? "text-green-200 "
                      : "text-pink-200"
                }`}
              >
                {message.username}:{" "}
              </span>
              <span className="break-words text-white">{message.message}</span>
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
            className="w-full rounded-br-xl border-4 border-t-0 bg-[url(/backgrounds/pinkBg.png)] bg-cover p-2 text-2xl text-white hover:bg-[url(/backgrounds/redBg.png)]"
            type="submit"
          >
            Send
          </button>
        </span>
      </form>
      <div
        className={`absolute inset-y-2 text-5xl ${
          showChat ? "right-5" : "right-2"
        } -z-10 h-fit w-fit`}
      >
        {showChat ? (
          <div className="animate__animated animate__rotateInUpRight text-white">
            <MdOutlineExpandLess />
          </div>
        ) : (
          <div className="animate__animated animate__rotateInUpLeft  text-white">
            <MdOutlineExpandMore />
          </div>
        )}
      </div>
    </div>
  );
}
