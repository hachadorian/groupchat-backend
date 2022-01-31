import { dbAccess } from "../utils/dbAccess";
import { v4 as uuid } from "uuid";
import { db } from "../db/connection";

function hydrateChannel(channel, members, messages) {
  return {
    ...channel,
    members: members,
    messages: messages,
  };
}

export const channelResolver = {
  Query: {
    getChannel: async (root, args, context) => {
      const channel = await dbAccess.findOne("channel", {
        id: args.id,
      });

      const members = await db
        .from("member")
        .leftJoin("user", "member.user_id", "user.id")
        .select(
          "member.user_id",
          "user.name",
          "user.image",
          "member.is_creator"
        );

      const messages = await db
        .from("message")
        .leftJoin("user", "message.user_id", "user.id")
        .select("message.user_id", "user.name", "message.created_at");

      return hydrateChannel(channel, members, messages);
    },
    getAllChannels: async (root, args, context) => {
      const channels = await db
        .from("channel")
        .leftJoin("member", "member.channel_id", "channel.id")
        .select(
          "channel.id",
          "channel.name",
          "channel.description",
          db.raw(
            `case when member.user_id = '${context.req.session.qid}' then true else false end is_member`
          )
        )
        .count("member.channel_id as member_count")
        .groupBy("channel.id")
        .groupBy("member.user_id")
        .orderBy("member_count", "desc");
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
