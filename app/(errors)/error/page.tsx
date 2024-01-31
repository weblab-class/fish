"use client";

import { useSignOut } from "@/services/react-query/auth";
import { CustomErrorCode } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ErrorPage() {
  const signOutMutation = useSignOut();
  const router = useRouter();

  const [logoutClicked, setLogoutClicked] = useState(false);

  return (
    <div className="h-screen w-screen bg-[url(/backgrounds/greenBg.png)] bg-cover p-5">
      <h1 className="w-fit rounded-3xl bg-[url(/backgrounds/lightBlueBg.png)] bg-cover p-2 text-5xl text-white">
        Something went wrong!
      </h1>
      <div className=" m-5 w-fit rounded-2xl bg-[url(/backgrounds/whiteGrayBg.png)] p-2">
        <h1 className="text-3xl text-gray-800">
          You have encountered an error. Please look at the list of errors that
          could&apos;ve occured.
        </h1>
        <h2 className="mt-5 text-3xl underline">
          The most common errors are duplicate tabs and not whitelisted.
        </h2>
        <ul className="list-disc pl-5 text-3xl">
          {Object.values(CustomErrorCode).map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      </div>
      <div className="flex flex-row gap-3">
        <a
          href={`${process.env.NEXT_PUBLIC_DOMAIN}`}
          className="rounded-3xl bg-[url(/backgrounds/lightBlueBg.png)] bg-cover px-2 py-3 text-3xl text-white outline-white hover:outline"
        >
          Return home
        </a>
        <a
          className={`${logoutClicked && "pointer-events-none"} rounded-3xl bg-[url(/backgrounds/lightBlueBg.png)] bg-cover px-2 py-3 text-3xl text-white outline-white hover:outline`}
          onClick={async () => {
            setLogoutClicked(true);
            await signOutMutation.mutateAsync();
            router.push(`${process.env.NEXT_PUBLIC_DOMAIN}`);
            setLogoutClicked(false);
          }}
        >
          Logout
        </a>
      </div>
    </div>
  );
}
