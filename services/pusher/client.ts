import PusherClient from "pusher-js";

// user authorization vs channel autorizaion
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  {
    cluster: "us2",
    userAuthentication: {
      endpoint: `${process.env.NEXT_PUBLIC_DOMAIN}/api/pusher/user-auth`,
      transport: "ajax",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    channelAuthorization: {
      endpoint: `${process.env.NEXT_PUBLIC_DOMAIN}/api/pusher/channel-auth`,
      transport: "ajax",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
  },
);
