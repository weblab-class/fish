import PusherClient from "pusher-js";

// user authorization vs channel autorizaion
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  {
    cluster: "us2",
    authEndpoint: `${process.env.NEXT_PUBLIC_DOMAIN}/api/pusher/auth`,
    authTransport: "ajax",
    auth: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  }
);
