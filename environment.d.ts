namespace NodeJS {
  interface ProcessEnv {
    PUSHER_APP_ID: string;
    NEXT_PUBLIC_PUSHER_APP_KEY: string;
    PUSHER_APP_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    MONGODB_SECRET: string;

    NODE_ENV: "development" | "production";
    TZ?: string;
  }
}
