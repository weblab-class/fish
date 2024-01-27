import { useHomeStore } from "@/phaser/stores";
import React, { useEffect } from "react";
import DrawingCanvas from "./DrawingCanvas";

export default function EaselPopup() {
  const [setDefault] = useHomeStore((state) => [state.setDefault]);
  useEffect(() => {
    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDefault();
      }
    };

    document.addEventListener("keydown", handleEscapePress);

    return () => {
      document.removeEventListener("keydown", handleEscapePress);
    };
  });

  return (
    <div className="absolute z-50 mb-2 flex h-full w-3/6 items-end justify-center">
      <div className="botton-0 absolute z-20 mb-2 flex h-90% w-full gap-10 rounded-3xl bg-[url(/backgrounds/brownBg.png)] bg-cover pt-1 shadow-xl shadow-stone-600 outline-8 outline-amber-900">
        <div className="h-90% w-full rounded-md bg-[url(/backgrounds/whiteGrayBg.png)] shadow-xl shadow-gray-800">
          <DrawingCanvas />
        </div>
      </div>
      <div className="absolute top-0 z-10 mt-2 h-1/4 w-2/12 rounded-t-3xl bg-[url('/backgrounds/brownBg.png')]"></div>
    </div>
  );
}
