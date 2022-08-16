import { publicData } from '../data';

const resolvers = {
  Query: {
    publicQuery: async () => publicData,
    blockedQuery: async () => 'I will be blocked',
    privateQuery: async () => 'I am a private query',
  },
};

export default resolvers;
