import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface Players {
    playerSocketId: number,
    members: []
    hostUsername:string

}

// each player calls this after submitting a response (story snippet)
export async function POST(req: NextRequest) {
    let { playerSocketId, members } = (await req.json()) as Players;

    // player who sent POST request sends their username and current number of players (by doing presenceChannel.members.count)
    // server sends username who sent request to the database
    // server gets usernames who submitted

    let players= {}; //get from database

    let allSubmitted=true;

    // compare number of users who submitted in the database and current number of players in the channel
    // members.forEach((member:number) => {
    //     if (!(member in players)){
    //         allSubmitted=false
    //     } else{
    //         const submitAll = async () => {
    //             await pusherServer.trigger('presence-host-channel', 'submitResponses',{})
    //           };
    //           submitAll();

    //     }

    // });



  return NextResponse.json({ status: 200 });
}

interface Story{
    currentStory:string,
    hostUsername:string
}
// called after voting is finished
export async function PUT(req: NextRequest) {
    let { currentStory,hostUsername } = (await req.json()) as Story;
    let responseVotes=[] //somethings from db containing responses voted for

    // response card component will send the response to db is they are clicked
    await pusherServer.trigger(`presence-ss-vote-${hostUsername}`,'countVotes',{})

    // get voted responses from db
    responseVotes=[]//somethings from db containing responses voted for

    // calculate the most voted response
    const mostVotedResponse="this is :)";

    // send mostVoted to host and host will combine it with the story and display the most voted response
    await pusherServer.trigger(`presence-ss-${hostUsername}`,'mostVoted',{mostVotedResponse:mostVotedResponse})



  return NextResponse.json({ status: 200 });
}
