import { ApolloServer, gql } from 'apollo-server-micro';
import withAuth from '../../lib/withAuth';
import withMongoose from '../../lib/withMongoose';
import typeDefs from '../../apollo/typeDefs';
import resolvers from '../../apollo/resolvers';
import { AuthDirective } from '../../apollo/directives';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: { auth: AuthDirective  },
  context: ({ req, res }) => ({ req, res }),
});

console.log('Spinning up serverless function');

const handler = server.createHandler({ path: '/api/graphql' });

export const config = {
  api: {
    bodyParser: false
  }
};

export default withMongoose(withAuth(handler));




