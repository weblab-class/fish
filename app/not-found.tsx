import React from "react";

export default function NotFoundPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[url(/backgrounds/whiteGrayBg.png)] bg-cover bg-no-repeat">
      <div className="flex h-fit w-fit items-center rounded-full bg-[url(/backgrounds/redBg.png)] outline-dashed outline-4 outline-white">
        <p className=" p-16  pl-20 pr-20 text-8xl text-white">Not Found :(</p>
      </div>
    </div>
  );
}
