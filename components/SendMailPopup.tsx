import React, { ChangeEvent, FormEvent, useState } from "react";

interface FormData {
  recipient: string;
  message: string;
}

export default function SendMailPopup() {
  const [recipient, setRecipient] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    try {
      console.log("send data to database", recipient, message);
      setSuccess(true);
    } catch (error) {
      alert("Submission is invalid");
    }
  }

  return (
    <div className="absolute z-30 flex h-full w-full items-center justify-center rounded-t-full bg-gray-400 bg-[url('/backgrounds/brownBg.png')] bg-cover shadow-xl shadow-stone-600 outline-8 outline-amber-900">
      {success ? (
        <div className="absolute z-50 flex h-full w-full items-center justify-center rounded-t-full bg-[url('/backgrounds/brownBg.png')]">
          <div className="absolute z-40 flex h-5/6 w-11/12 justify-center rounded-t-full bg-[url('/backgrounds/lighterBrownBg.png')] bg-cover shadow-2xl shadow-stone-600 outline-8 outline-amber-900" />
          <p className="absolute z-50 text-5xl text-white">Message Sent!</p>
        </div>
      ) : (
        <div className="absolute z-30 flex h-full w-full items-center justify-center rounded-t-full bg-gray-400 bg-[url('/backgrounds/brownBg.png')] bg-cover shadow-xl shadow-stone-600 outline-8 outline-amber-900">
          <div className="absolute z-40 flex h-5/6 w-11/12 justify-center rounded-t-full bg-[url('/backgrounds/lighterBrownBg.png')] bg-cover shadow-2xl shadow-stone-600 outline-8 outline-amber-900" />
          <div className="absolute z-40 mt-5 h-full w-7/12 bg-[url('/backgrounds/whiteGrayBg.png')]"></div>
          <div className="absolute z-40 mt-5 h-full w-7/12 bg-[url('/backgrounds/whiteGrayBg.png')]"></div>
          <form
            className="absolute z-40 mt-5 h-full w-7/12 flex-col justify-center bg-[url('/backgrounds/whiteGrayBg.png')] p-4 shadow-2xl shadow-zinc-800"
            onSubmit={handleSubmit}
          >
            {/* Recipient Input Field */}
            <div className="mt-5 flex justify-center">
              <p className="text-3xl text-zinc-700">Send to:</p>
              <input
                className="ml-5 h-fit rounded-2xl p-2 text-2xl text-zinc-700"
                placeholder="Username of recepient"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setRecipient(e.target.value);
                }}
              ></input>
            </div>
            {/* Message Input Field */}
            <div className="flex h-4/6 justify-center">
              <textarea
                className="text wrap mt-8 w-11/12 rounded-2xl p-2 text-3xl text-zinc-700"
                placeholder="Message"
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  setMessage(e.target.value);
                }}
              ></textarea>
            </div>
            {/* Send Mail Button */}
            <div className="flex items-center justify-center">
              <button className="bottom-0 z-50 m-6 h-fit w-fit rounded-xl bg-[url('/backgrounds/redBg.png')] p-3 text-3xl hover:cursor-pointer">
                Send
              </button>
            </div>
          </form>
          <div className="z-30 flex h-5/6 w-11/12 justify-center rounded-t-full shadow-2xl shadow-stone-600 outline-8 outline-amber-900">
            <div className="absolute mt-28 flex h-1/4 w-3/5 items-end justify-center rounded-t-full bg-[url('/backgrounds/blackBg.png')] p-5 hover:cursor-pointer">
              <p className="text-4xl"></p>
            </div>
            <div className="items-bottom shad inset-y-0 m-2 flex h-16 w-4/12 justify-center rounded-t-full bg-[url('/backgrounds/brownBg.png')] text-3xl">
              <div className="items-bottom inset-y-0 m-2 flex h-full w-full justify-center rounded-t-full bg-[url('/backgrounds/blackBg.png')] p-2 text-3xl shadow-xl shadow-stone-800 hover:cursor-pointer"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
