import { CustomErrorCode } from "@/types";

export default function ErrorPage() {
  return (
    <div className="h-screen w-screen bg-[url(/backgrounds/greenBg.png)] bg-cover p-5">
      <h1 className="w-fit rounded-3xl bg-[url(/backgrounds/lightBlueBg.png)] bg-cover p-2 text-5xl text-white">
        Something went wrong!
      </h1>
      <div className=" m-5 w-fit rounded-2xl bg-[url(/backgrounds/whiteGrayBg.png)] p-2">
        <h1 className="text-3xl text-gray-800">
          We have custom errors, but cannot display them to you at the moment.
          This will change in the upcoming release.
        </h1>
        <h2 className="mt-5 text-3xl underline">
          There can be multiple reasons for this, which includes but not limited
          to...
        </h2>
        <ul className="list-disc pl-5 text-3xl">
          {Object.values(CustomErrorCode).map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      </div>
      <div className="">
        <a
          href={`${process.env.NEXT_PUBLIC_DOMAIN}`}
          className="rounded-3xl bg-[url(/backgrounds/lightBlueBg.png)] bg-cover px-2 py-3 text-3xl text-white outline-white hover:outline"
        >
          Return home
        </a>
      </div>
    </div>
  );
}
