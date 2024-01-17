import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";

import graphqlSchema, { resolvers } from "@/services/mongo/graphql";
import { schemaComposer } from "graphql-compose";

// https://github.com/apollo-server-integrations/apollo-server-integration-next/issues/94

console.log("=================")
console.log(resolvers.Query["playerById"]);
console.log("======================")

const server = new ApolloServer({
  schema: graphqlSchema,
  // resolvers: schemaComposer
//   typeDefs: `#graphql
//   type User {
//     id: ID!
//     first_name: String!
//     last_name: String!
//     email: String!
//     age: Int!
//     active: Boolean
// }
  
//   input NewUserInput {
//     first_name: String!
//     last_name: String!
//     email: String!
//     age: Int!
//   }
//   type Query {
//     users: [User]
//   }
//   type Mutation {
//     createUser(input: NewUserInput!): User
//   }
// `,
  // resolvers: {
  //   Query: {
  //     users: () => {
  //       return [{ id: "hello user" }];
  //     },
  //   },
  //   Mutation: {
  //     createUser: () => {
  //       return "new user created";
  //     },
  //   },
  // },
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => {
    return { req };
  },
});

export { handler as GET, handler as POST };
