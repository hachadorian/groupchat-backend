import { gql } from "apollo-server-core";

export const memberTypeDefs = gql`
  type Query {
    getAllMembers(channelID: String!): [Member]!
  }

  type Mutation {
    addMember(channelID: String!): Boolean!
  }

  type Member {
    id: String!
    channel_id: String!
    user_id: String!
    name: String
    image: String
    is_creator: Boolean
  }
`;
