import React from "react";
import { useTimer } from "react-timer-hook";

function Timer({ expiryTimestamp }: { expiryTimestamp: Date }) {
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

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
      <div className="bottom-0 left-0 select-none p-5 font-sans text-3xl text-red-600">
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <div className="bottom-0 right-0 p-5">
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
            const time = new Date();
            time.setSeconds(time.getSeconds() + expiryTimestamp.getSeconds());
            restart(time, false);
          }}
          className="z-32 h-10 w-20 bg-[url('/objects/restart.png')] bg-no-repeat hover:bg-[url('/objects/restart_hover.png')]"
        />
      </div>
    </div>
  );
}

export default Timer;
