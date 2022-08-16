import { makeExecutableSchema } from '@graphql-tools/schema';
import { addGuards } from '../../src';
import { blockGuard, privateGuard } from './guards';
import resolvers from './resolvers';
import typeDefs from './typeDefs';

let schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

schema = addGuards(schema, [blockGuard, privateGuard]);

export default schema;
