import { gql } from "apollo-server-core";

export const channelTypeDefs = gql`
  type Query {
    getChannel(id: String!): Channel!
    getAllChannels: [Channel]!
    getAllJoinedChannels: [Channel]!
  }

  type Mutation {
    createChannel(name: String!, description: String!): ChannelResult
  }

  type Channel {
    id: String
    name: String
    description: String
  }

  type Errors {
    message: String!
  }

  union ChannelResult = Channel | Errors
`;
