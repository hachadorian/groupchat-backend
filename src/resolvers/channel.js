import { dbAccess } from "../utils/dbAccess";
import { v4 as uuid } from "uuid";
import { db } from "../db/connection";

export const channelResolver = {
  Query: {
    getChannel: async (root, args, context) => {
      const channel = await dbAccess.findOne("channel", {
        id: args.id,
      });
      return channel;
    },
    getAllChannels: async () => {
      const channels = await dbAccess.findAll("channel");
      return channels;
    },
    getAllJoinedChannels: async (root, args, context) => {
      const channels = await db
        .from("channel")
        .innerJoin("member", "member.channel_id", "channel.id")
        .where({ user_id: context.req.session.qid })
        .select("channel_id as id", "name", "description");
      return channels;
    },
  },
  Mutation: {
    createChannel: async (root, args, context) => {
      // grab user from context and add and set as creator in members
      const createdChannel = {
        id: uuid(),
        name: args.name,
        description: args.description,
      };

      const insert = await dbAccess.insertOne("channel", createdChannel);
      if (insert && insert.__typename !== "Errors") {
        return {
          __typename: "Channel",
          ...createdChannel,
        };
      }
      return insert;
    },
  },
};
