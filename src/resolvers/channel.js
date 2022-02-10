import { dbAccess } from "../utils/dbAccess";
import { v4 as uuid } from "uuid";
import { db } from "../db/connection";

function hydrateChannel(channel, members) {
  return {
    ...channel,
    members: members,
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
        .select("user_id", "user.name", "user.image", "member.is_creator")
        .where({ channel_id: args.id });

      return hydrateChannel(channel, members);
    },
    getChannels: async (root, args, context) => {
      const channels =
        await db.raw(`select channel.id, channel.name, channel.description, count(member.channel_id) as member_count,
	      case 
		      when member.channel_id = channel.id or member.user_id = '${
            context.req.session.qid
          }' then true
		      else false
	      end is_member
        from channel
        left join member on member.channel_id = channel.id
        where channel.name like '%${args.search ? args.search : ""}%'
        group by channel.id,
	      case 
		      when member.channel_id = channel.id or member.user_id = '${
            context.req.session.qid
          }' then true
		      else false
	      end
        order by member_count desc
        `);
      return channels.rows;
    },
    getAllJoinedChannels: async (root, args, context) => {
      const channels = await db
        .from("channel")
        .innerJoin("member", "member.channel_id", "channel.id")
        .where({ user_id: context.req.session.qid })
        .select("channel_id as id", "name", "description");
      return channels;
    },
    getTopChannels: async (root, args, context) => {
      const channels =
        await db.raw(`select channel.id, channel.name, channel.description, count(member.channel_id) as member_count,
	      case 
		      when member.channel_id = channel.id or member.user_id = '${context.req.session.qid}' then true
		      else false
	      end is_member
        from channel
        left join member on member.channel_id = channel.id
        group by channel.id,
	      case 
		      when member.channel_id = channel.id or member.user_id = '${context.req.session.qid}' then true
		      else false
	      end
        order by member_count desc
		    limit 6
        `);
      return channels.rows;
    },
  },
  Mutation: {
    createChannel: async (root, args, context) => {
      const user = await dbAccess.findOne("user", {
        id: context.req.session.qid,
      });

      let createdChannel = {
        id: uuid(),
        name: args.name,
        description: args.description,
      };

      const insert = await dbAccess.insertOne("channel", createdChannel);
      if (insert && insert.__typename !== "Errors") {
        const creator = {
          id: uuid(),
          channel_id: createdChannel.id,
          user_id: context.req.session.qid,
          is_creator: true,
        };

        await dbAccess.insertOne("member", creator);

        createdChannel = {
          ...createdChannel,
          members: [user],
          is_member: true,
          member_count: 1,
          messages: [],
        };

        return {
          __typename: "Channel",
          ...createdChannel,
        };
      }
      return insert;
    },
  },
};
