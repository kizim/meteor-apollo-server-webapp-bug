import { gql } from 'apollo-server-express';
import { PubSub } from 'graphql-subscriptions';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { LinksCollection } from './main';

const pubsub = new PubSub();

const typeDefs = gql`
  type Link {
    title: String
    url: String
  }

  type Query {
    links: [Link]
  }

  type Mutation {
    test: Float
  }

  type Subscription {
    demo: Float
  }
`;

const resolvers = {
  Query: {
    links: async () => LinksCollection.find().fetch(),
  },
  Mutation: {
    test: () => {
      const num = Math.random();
      pubsub.publish('demo', {
        demo: num,
      });

      return num;
    }
  },
  Subscription: {
    demo: {
      subscribe: () => pubsub.asyncIterator(['demo']),
    },
  },
};

export default makeExecutableSchema({ typeDefs, resolvers });
