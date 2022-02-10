import { gql } from "apollo-server-core";

export const messageTypeDefs = gql`
  type Query {
    getAllMessages(channel_id: String!): [Message]!
    getSomeMessages(channelID: String!, limit: Int, offset: Int): [Message]!
  }

  type Mutation {
    createMessage(channelID: String!, message: String!): MessageResult
  }

  type Message {
    id: String!
    channel_id: String!
    user_id: String!
    message: String!
    image: String
    name: String
    created_at: String!
  }

  type Errors {
    message: String!
  }

  type Subscription {
    messageAdded: Message!
  }

  union MessageResult = Message | Errors
`;
