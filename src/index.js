import "regenerator-runtime/runtime";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import express from "express";
import { schema } from "./schema";
import dotenv from "dotenv";
import http from "http";
import session from "express-session";
import redis from "redis";
import connectRedis from "connect-redis";
import cors from "cors";
import { graphqlUploadExpress } from "graphql-upload";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { PubSub } from "graphql-subscriptions";
// import { Server as SocketIOServer } from "socket.io";

const main = async () => {
  dotenv.config();
  const app = express();
  const httpServer = http.createServer(app);
  const pubsub = new PubSub();
  // const io = new SocketIOServer(httpServer, {
  //   transports: ["websocket"],
  //   cors: {
  //     origin: [process.env.ORIGIN],
  //   },
  // });

  app.use(
    cors({
      origin: process.env.ORIGIN,
      credentials: true,
    })
  );

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient(process.env.REDIS_URL);

  redisClient.on("connect", () => {
    console.log("connected to redis...");
  });

  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 1000 * 60 * 10,
      },
    })
  );

  const middleware = (args) =>
    new Promise((resolve, reject) => {
      const [schema, document, root, context, variables, operation] = args;
      context.pubsub = pubsub;
      resolve(args);
    });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: (connectionParams, webSocket) => {
        return {
          pubsub: pubsub,
        };
      },
    },
    { server: httpServer, path: "/graphql" }
  );

  const apolloServer = new ApolloServer({
    schema: schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground(),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
    context: ({ req, res }) => ({ req, res, redisClient, pubsub }),
    uploads: false,
    introspection: true,
  });

  app.use(graphqlUploadExpress({ maxFileSize: 10000, maxFiles: 10 }));

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
    path: "/",
  });

  io.on("connection", (socket) => {
    socket.on("join", async (data) => {
      await socket.join("room:" + data);
    });
    socket.on("typing", (data) => {
      socket.to("room:" + data.roomId).emit("someoneTyping", {
        user: data.user,
        roomId: data.roomId,
      });
    });
    socket.on("leave", (data) => {
      socket.leave("room:" + data.roomId);
    });
    socket.on("not-typing", (data) => {
      socket.to("room:" + data.roomId).emit("nooneTyping");
    });
  });

  const port = process.env.PORT || 4000;

  httpServer.listen(port, () => {
    console.log(`server started on http://localhost:${port}/graphql`);
  });
};

main().catch((err) => {
  console.error(err);
});
