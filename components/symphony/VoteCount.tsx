export default function VoteCount(props: {
  response: string;
  creatorId: string;
  creatorUsername: string;
  votes: number;
  won: boolean;
  voterId: string;
  hostId: string;
}) {
  return (
    <div className="ml-2 mr-2 h-2/5 w-1/5">
      <div
        className={` ml-2 mr-2 bg-[url('/backgrounds/whiteGrayBg.png')] ${
          props.won && "animate__animated animate__tada"
        } justify-center" z-50 flex h-full w-full flex-col items-center break-words rounded-lg text-center text-3xl text-gray-700 outline-4`}
      >
        <p className="w-full break-words p-2 text-center">
          {props.creatorUsername}
        </p>

        <p className="w-full break-words p-2 text-center">{props.response}</p>

        <div className="absolute flex h-2/5 w-1/5 justify-end">
          <div className="flex h-1/6 w-1/6 items-center justify-center rounded-full bg-[url(/backgrounds/pinkBg.png)] text-4xl text-white">
            {props.votes}
          </div>
        </div>
      </div>
    </div>
  );
}
