import { dbAccess } from "../utils/dbAccess";
import { db } from "../db/connection";
import { v4 as uuid } from "uuid";

export const messageResolver = {
  Query: {
    getAllMessages: async (root, args, context) => {
      return await dbAccess.findAll("message", { channel_id: args.channelID });
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
        return {
          __typename: "Message",
          ...createdMessage,
          user_id: user.id,
          name: user.name,
          image: user.image,
          created_at: Date.now(),
        };
      }
      return insert;
    },
  },
};
