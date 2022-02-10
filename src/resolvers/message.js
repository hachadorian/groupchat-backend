import { dbAccess } from "../utils/dbAccess";
import { v4 as uuid } from "uuid";
import { db } from "../db/connection";

export const messageResolver = {
  Query: {
    getAllMessages: async (root, args, context) => {
      return await dbAccess.findAll("message", { channel_id: args.channelID });
    },
    getSomeMessages: async (root, args, context) => {
      return await db
        .from("message")
        .leftJoin("user", "message.user_id", "user.id")
        .select(
          "message.id",
          "message.user_id",
          "user.name",
          "user.image",
          "message.message",
          "message.created_at",
          "message.channel_id"
        )
        .where({ channel_id: args.channelID })
        .orderBy("created_at", "asc")
        .limit(args.limit)
        .offset(args.offset);
    },
  },
  Mutation: {
    createMessage: async (root, args, context) => {
      const user = await dbAccess.findOne("user", {
        id: context.req.session.qid,
      });

      const createdMessage = {
        id: uuid(),
        channel_id: args.channelID,
        user_id: context.req.session.qid,
        message: args.message,
      };

      const insert = await dbAccess.insertOne("message", createdMessage);
      if (insert && insert.__typename !== "Errors") {
        const ret = {
          ...createdMessage,
          user_id: user.id,
          name: user.name,
          image: user.image,
          created_at: Date.now(),
        };

        context.pubsub.publish("MESSAGE_ADDED", {
          messageAdded: ret,
        });

        return {
          __typename: "Message",
          ...ret,
        };
      }

      return insert;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: (root, args, context) =>
        context.pubsub.asyncIterator(["MESSAGE_ADDED"]),
    },
  },
};
