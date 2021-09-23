import { WebApp } from 'meteor/webapp';

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import express from 'express';
import http from 'http';

import schema from './schema';

// const app = express();
// app.use(express.json());
// const httpServer = http.createServer(app);

const app = WebApp.connectHandlers;

const startApolloServer = async() => {
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            }
          };
        }
      },
    ],
  });

  await server.start();
  server.applyMiddleware({ app });

  const subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
 }, {
    server: WebApp.httpServer,
    path: server.graphqlPath,
 });

  // await new Promise(resolve => httpServer.listen({ port: 3000 }, resolve));
  // console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
}

startApolloServer().then(console.log).catch(console.error);
