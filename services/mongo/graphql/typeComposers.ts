import { DiscriminatorTypeComposer, GenerateResolverType, composeWithMongoose, composeWithMongooseDiscriminators } from "graphql-compose-mongoose";
import { schemaComposer } from "graphql-compose";
import { Document, Model } from "mongoose";

import { GameRoomModel, PlayerModel, PlayerRoomModel, SentenceSymphonyGameRoomModel } from "../models";

function getOTC<T extends object>(modelName: string, model: Model<T>) {
  console.log("hello");

  try {
    return schemaComposer.getOTC(modelName);
  }
  catch {
    return composeWithMongoose(model);
  }
}

function getOTCDiscrim<T extends object>(modelName: string, model: Model<T>) {
  try {
    return schemaComposer.getOTC(modelName) as DiscriminatorTypeComposer<Document<any, any, any>, any>;
  }
  catch {
    return composeWithMongooseDiscriminators(model);
  }
}


const PlayerTC = getOTC("Player", PlayerModel);
const PlayerRoomTC = getOTC("PlayerRoom", PlayerRoomModel);

// https://snyk.io/advisor/npm-package/graphql-compose-mongoose/functions/graphql-compose-mongoose.composeWithMongooseDiscriminators
const GameRoomDTC = getOTCDiscrim("GameRoom", GameRoomModel);
const SentenceSymphonyGameRoomTC = GameRoomDTC.discriminator(SentenceSymphonyGameRoomModel); 


export { PlayerTC, PlayerRoomTC, GameRoomDTC, SentenceSymphonyGameRoomTC };