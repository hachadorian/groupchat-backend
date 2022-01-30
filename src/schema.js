import { makeExecutableSchema } from "@graphql-tools/schema";
import { userTypeDefs } from "./types/user";
import { userResolver } from "./resolvers/user";
import { channelTypeDefs } from "./types/channel";
import { channelResolver } from "./resolvers/channel";
import { memberTypeDefs } from "./types/member";
import { memberResolver } from "./resolvers/member";
import { merge } from "lodash";
import { GraphQLUpload } from "graphql-upload";

export const schema = makeExecutableSchema({
  typeDefs: [userTypeDefs, channelTypeDefs, memberTypeDefs],
  resolvers: merge(userResolver, channelResolver, memberResolver, {
    Upload: GraphQLUpload,
  }),
});
