const typeDefs = /* GraphQL */ `
  directive @block on FIELD_DEFINITION | OBJECT
  directive @private on FIELD_DEFINITION | OBJECT

  type PrivateData @private {
    secret: String!
  }

  type PublicData {
    publicField: String!
    privateField: String @private
    privateData: PrivateData
  }

  type Query {
    blockedQuery: String @block
    privateQuery: String @private
    publicQuery: PublicData!
  }
`;

export default typeDefs;
