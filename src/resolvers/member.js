import { dbAccess } from "../utils/dbAccess";
import { v4 as uuid } from "uuid";

export const memberResolver = {
  Query: {
    getAllMembers: async (root, args, context) => {
      const members = await dbAccess.findAll({ channel_id: args.channelID });
      return members;
    },
  },
  Mutation: {
    addMember: async (root, args, context) => {
      const isMember = await dbAccess.findOne("member", {
        user_id: context.req.session.qid,
        channel_id: args.channelID,
      });

      if (isMember) {
        return null;
      }

      const createdMember = {
        id: uuid(),
        channel_id: args.channelID,
        user_id: context.req.session.qid,
        is_creator: false,
      };

      return await dbAccess.insertOne("member", createdMember);
    },
  },
};
