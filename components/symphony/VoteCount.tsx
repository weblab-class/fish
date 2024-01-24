export default function VoteCount(props: {
  response: string;
  creatorId: string;
  creatorUsername: string;
  votes: number;
  won: boolean;
  voterId: string;
  hostId: string;
  winningResponse: string;
}) {
  console.log(props.response, props.won, props.winningResponse);
  return (
    <div className="z-50 ml-2 mr-2 h-2/5 w-1/5">
      <div
        className={` ml-2 mr-2 bg-[url('/backgrounds/whiteGrayBg.png')] ${
          props.won &&
          "animate__animated animate__tada outline outline-yellow-300 "
        } justify-center" z-50 flex h-full w-full flex-col items-center break-words rounded-lg text-center text-2xl text-gray-700 outline-4`}
      >
        <p className="w-full break-words rounded-2xl bg-[url[/backgrounds/brownBg.png]] p-1 text-center text-amber-950">
          -- Written by {props.creatorUsername} --
        </p>

        <p className="w-full overflow-y-scroll break-words p-1 text-center">
          {props.response}
        </p>

        <div className="h-17%% absolute flex w-1/5 justify-end">
          <div className="flex h-1/2 w-1/5 items-center justify-center rounded-full bg-[url(/backgrounds/pinkBg.png)] text-3xl text-white">
            {props.votes}
          </div>
        </div>
      </div>
    </div>
  );
}
