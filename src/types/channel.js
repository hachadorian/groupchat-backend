import { gql } from "apollo-server-core";

export const channelTypeDefs = gql`
  type Query {
    getChannel(id: String!): Channel!
    getAllChannels: [Channel]!
  }

  type Channel {
    id: String
    name: String
    description: String
  }
`;
