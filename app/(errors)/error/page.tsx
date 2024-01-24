import { CustomErrorCode } from "@/types";

export default function ErrorPage() {
  return (
    <div className="p-5">
      <h1 className="text-2xl">
        Something went wrong! We have custom errors, but cannot display them to
        you at the moment. This will change in the upcoming release.
      </h1>
      <h2 className="text-xl">
        There can be multiple reasons for this, which includes but not limited
        to...
      </h2>
      <ul className="list-disc pl-5">
        {Object.values(CustomErrorCode).map((err) => (
          <li key={err}>{err}</li>
        ))}
      </ul>
      <div className="mt-3">
          <a href={`${process.env.NEXT_PUBLIC_DOMAIN}`} className="py-3 px-2 bg-orange-200 rounded-md">
            Return home
          </a>
      </div>
    </div>
  );
}
