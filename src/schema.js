import { makeExecutableSchema } from "@graphql-tools/schema";
import { userTypeDefs } from "./types/user";
import { userResolver } from "./resolvers/user";
import { channelTypeDefs } from "./types/channel";
import { channelResolver } from "./resolvers/channel";
import { merge } from "lodash";
import { GraphQLUpload } from "graphql-upload";

export const schema = makeExecutableSchema({
  typeDefs: [userTypeDefs, channelTypeDefs],
  resolvers: merge(userResolver, channelResolver, { Upload: GraphQLUpload }),
});
