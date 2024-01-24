import React from "react";
import Mail from "./Mail";

export default function ReadMailPopup() {
  return (
    <div className="absolute z-30 flex h-full w-full items-center justify-center rounded-t-full bg-[url(/backgrounds/brownBg.png)] bg-cover text-white shadow-xl shadow-stone-600 outline-8 outline-amber-900">
      <p className="absolute inset-y-0 mt-2 text-5xl text-white">Your Mail</p>
      {/* TO DO: get messages from database and map to mail component */}
      {/* <div className='flex justify-center flex-wrap'>
      {messages.map((messages) => (
            <Mail key={message.id} id={message.id} message={message.message} sender={message.sender}/>
          ))}

    </div> */}

      <div className="z-20 flex h-5/6 w-11/12 items-end justify-center rounded-t-full bg-[url(/backgrounds/blackBg.png)] bg-cover outline-8 outline-amber-900">
        <div className="h-1/12 max-full bottom-0 flex w-fit flex-wrap justify-center">
          <Mail sender={"useasdfjkhakaj"} message={"ji there"} />
          <Mail sender={"uskdlfjlaksser"} message={"ji there"} />
          <Mail sender={"uasdkfjadser"} message={"ji there"} />
          <Mail sender={"uasdklflksdfjser"} message={"ji there"} />
          <Mail sender={"user"} message={"ji there"} />
          <Mail sender={"uasdfsser"} message={"ji there"} />
          <Mail sender={"usasdfer"} message={"ji there"} />
          <Mail sender={"usfsder"} message={"ji there"} />
          <Mail sender={"ussdfer"} message={"ji there"} />
        </div>
      </div>
    </div>
  );
}
