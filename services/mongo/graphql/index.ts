// https://javascript.plainenglish.io/using-apollo-server-with-nextjs-13-app-dir-part-1-google-auth-with-nextauth-prisma-ca242c92599e
// https://www.youtube.com/watch?v=uPxo9NQLVMI
// https://getstream.io/blog/tutorial-create-a-graphql-api-with-node-mongoose-and-express/
import { schemaComposer } from "graphql-compose";

import {
  PlayerQuery,
  PlayerMutation,
  PlayerRoomQuery,
  PlayerRoomMutation,
  GameRoomQuery,
  GameRoomMutation,
  SentenceSymphonyGameRoomQuery,
  SentenceSymphonyGameRoomMutation,
} from "./resolvers";

schemaComposer.Query.addFields({
  ...PlayerQuery,
  ...PlayerRoomQuery,
  ...GameRoomQuery,
  ...SentenceSymphonyGameRoomQuery,
});

schemaComposer.Mutation.addFields({
  ...PlayerMutation,
  ...PlayerRoomMutation,
  ...GameRoomMutation,
  ...SentenceSymphonyGameRoomMutation
});

export const resolvers = {
  Query: schemaComposer.Query.getFields(),
  Mutation: schemaComposer.Mutation.getFields(),
}

const graphqlSchema = schemaComposer.buildSchema();

export default graphqlSchema;
