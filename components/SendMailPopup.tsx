import { useLuciaSession } from "@/services/lucia/LuciaSessionProvider";
import { useSendInvite } from "@/services/react-query/mutations/player-room";
import { useSendMail } from "@/services/react-query/mutations/player/sendMail";
import { getPlayerByUsername } from "@/services/react-query/queries/player";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Mail from "@/components/Mail";
import { errors } from "@typegoose/typegoose";

interface FormData {
  recipient: string;
  message: string;
}

export default function SendMailPopup() {
  const [recipient, setRecipient] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const sendMail = useSendMail();
  const { session } = useLuciaSession();
  const [notFound, setNotFound] = useState<boolean>();

  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, resetField, setError } = useForm<FormData>();

  // sends the mail
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const username = data.recipient;
    setLoading(true);
    const { data: receiver } = await getPlayerByUsername(username);
    if (!receiver) throw new Error("Invalid user!"); // TODO add error message to form

    if (!receiver[0]) {
      setNotFound(true);
      setTimeout(() => setNotFound(false), 1000);
    } else {
      await sendMail.mutateAsync({
        senderId: session!.user.uid,
        receiverId: receiver[0]._id.toString(),
        content: data.message,
      });
      resetField("message");
      setSuccess(true);
      resetField("recipient");
    }
  };

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
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Recipient Input Field */}
            <div className="mt-5 flex justify-center">
              <p className="text-3xl text-zinc-700"> To:</p>
              <input
                className="ml-5 h-fit rounded-2xl p-2 text-2xl text-zinc-700"
                placeholder="Username of recepient"
                required
                autoComplete="off"
                minLength={3}
                maxLength={12}
                {...register("recipient")}
              ></input>
            </div>
            {notFound && (
              <p className="absolute w-full text-center text-xl text-red-500">
                User does not exist
              </p>
            )}

            {/* Message Input Field */}
            <div className="flex h-4/6 justify-center">
              <textarea
                className="text wrap mt-8 w-11/12 rounded-2xl p-2 text-3xl text-zinc-700"
                placeholder="Write a Message"
                required
                minLength={1}
                maxLength={125}
                {...register("message")}
              ></textarea>
            </div>
            {/* Send Mail Button */}
            <div className="flex items-center justify-center">
              <button
                disabled={loading}
                className="bottom-0 z-50 m-6 h-fit w-fit rounded-xl bg-[url('/backgrounds/redBg.png')] p-3 text-3xl text-white outline-white hover:cursor-pointer hover:bg-[url(/backgrounds/pinkBg.png)] hover:outline"
              >
                {loading ? "Sending..." : "Send"}
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
