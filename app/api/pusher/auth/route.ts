// import { NextRequest, NextResponse } from "next/server";
// import { PresenceChannelData } from "pusher";

// import { type PlayerRoomUserInfo, PusherError, pusherServer } from "@/services/pusher";
// import { authorizeApiRoute } from "@/services/lucia/functions";

// export async function POST(req: NextRequest) {
//   return await authorizeApiRoute(req, async (session) => {
//     const data = await req.text();  // contains socket id and channel name
//     const socketId = data.split("&")[0].split("=")[1];
//     const uid = session.user.uid!;

//     const presenceData = {
//       user_id: uid,
//       user_info: { uid, socket_id: socketId } as PlayerRoomUserInfo,  // TODO add data from mongodb
//     } as PresenceChannelData;

//     // make sure the user isn't opening more than one tab (see pusher:subscription_error in the Game component for the rest of the implementation)
//     // NOTE: dev mode breaks this, so it's only available in prod
//     if (process.env.NODE_ENV === "production") {
//       const usersRes = await pusherServer.get({
//         path: `/channels/presence-host-${uid}/users`,
//       });
//       const usersBody = await usersRes.json();
//       const userIds = (usersBody.users as { id: string }[]).map(
//         ({ id }) => id,
//       );
//       if (userIds.includes(uid)) {  // this might be a signal that the user created another tab
//         return NextResponse.json(socketId, { status: 403, statusText: PusherError.DUPLICATE_TABS});
//       }
//     }

//     const auth = pusherServer.authorizeChannel(
//       socketId,
//       `presence-host-${uid}`,
//       presenceData,
//     );

//     return new NextResponse(JSON.stringify(auth));
//   });
// }

// TODO adapt this later
import { pusherServer } from '@/services/pusher';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.text()
  const [socketId, channelName] = data
    .split('&')
    .map((str) => str.split('=')[1])

  const presenceData = {
    user_id: socketId,  // replace with auth
    user_data: { user_id: socketId },
  }

  const auth = pusherServer.authorizeChannel(
    socketId,
    channelName,
    presenceData
  )
console.log(auth)
  return new NextResponse(JSON.stringify(auth))
}
