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
    id: String!
    name: String!
    description: String!
    member_count: Int
    is_member: Boolean
    members: [Member]
    messages: [Message]
  }

  type Message {
    id: String!
    channel_id: String!
    user_id: String!
    name: String
    message: String!
    created_at: String!
  }

  type Errors {
    message: String!
  }

  union ChannelResult = Channel | Errors
`;
