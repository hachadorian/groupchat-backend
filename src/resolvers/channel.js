import { dbAccess } from "../utils/dbAccess";
import bcrypt from "bcrypt";
import { validate } from "../utils/validate";
import { v4 as uuid } from "uuid";
import { uploadFile } from "../utils/awsS3Uploader";
import { sendEmail } from "../utils/sendEmail";
import dotenv from "dotenv";

export const channelResolver = {
  Query: {
    getChannel: async (root, args, context) => {
      const channel = await dbAccess.findOne("channel", {
        field: "id",
        value: args.id,
      });
      return channel;
    },
    getAllChannels: async () => {
      const channels = await dbAccess.findAll("channel");
      return channels;
    },
  },
};
