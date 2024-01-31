import React from "react";
import { useStopwatch } from "react-timer-hook";

function Stopwatch() {
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch();

  if (isRunning && totalSeconds % 2) {
    // @ts-ignore
    for (const image of document.getElementsByClassName("desk")) {
      image.src = "/objects/Desk2.png";
    }
  } else if (totalSeconds === 0) {
    console.log("time 0");
  } else {
    // @ts-ignore
    for (const image of document.getElementsByClassName("desk")) {
      image.src = "/objects/Desk.png";
    }
  }

  return (
    <div className="bottom-0 left-0 flex">
      <div className="left-0 p-5 font-sans text-3xl text-black">
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <div className="relative -top-3 right-0 p-5">
        {!isRunning && (
          <div
            onClick={start}
            className="z-31 h-10 w-20 bg-[url('/objects/play.png')] bg-no-repeat hover:bg-[url('/objects/play_hover.png')]"
          />
        )}
        {isRunning && (
          <div>
            <div
              onClick={pause}
              className="z-32 h-10 w-20 bg-[url('/objects/pause.png')] bg-no-repeat hover:bg-[url('/objects/pause_hover.png')]"
            />
          </div>
        )}
        <div
          onClick={() => {
            reset(undefined, false);
          }}
          className="z-32 h-10 w-20 bg-[url('/objects/restart.png')] bg-no-repeat hover:bg-[url('/objects/restart_hover.png')]"
        />
      </div>
    </div>
  );
}

export default Stopwatch;
