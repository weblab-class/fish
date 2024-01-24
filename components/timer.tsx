import React from 'react';
import { useTimer } from 'react-timer-hook';

function Timer({ expiryTimestamp }) {
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

  if (isRunning && (totalSeconds%2)) {
    for(const image of document.getElementsByClassName("desk")) {
      image.src = "/objects/Desk2.png"
    }
  }
  else if (totalSeconds === 0) {
    console.log("time 0")
  }
  else {
    for(const image of document.getElementsByClassName("desk")) {
      image.src = "/objects/Desk.png"
    }
  }

  return (
    <div className = "flex left-0 bottom-0">
      <div className = "bottom-0 left-0 text-3xl font-sans text-red-600 p-5 select-none">
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <div className = "bottom-0 right-0 p-5">
        {
          !isRunning && (
            <div onClick={start} className = "w-20 h-10 z-31 bg-[url('/objects/play.png')] bg-no-repeat hover:bg-[url('/objects/play_hover.png')]"/>
          )
        }
        {
          isRunning && (
            <div>
              <div onClick={pause} className = "w-20 h-10 z-32 bg-[url('/objects/pause.png')] bg-no-repeat hover:bg-[url('/objects/pause_hover.png')]"/>
            </div>
          )
        }
        <div onClick={() => {
          const time = new Date();
          time.setSeconds(time.getSeconds() + expiryTimestamp);
          restart(time, false)
        }} className = "w-20 h-10 z-32 bg-[url('/objects/restart.png')] bg-no-repeat hover:bg-[url('/objects/restart_hover.png')]"/>
      </div>
    </div>
  );
}

export default Timer