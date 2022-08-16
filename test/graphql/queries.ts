export const blockedQuery = /* GraphQL */ `
  query blockedQuery {
    blockedQuery
  }
`;

export const privateQuery = /* GraphQL */ `
  query privateQuery {
    privateQuery
  }
`;

export const publicQuery = /* GraphQL */ `
  query publicQuery {
    publicQuery {
      publicField
      privateField
      privateData {
        secret
      }
    }
  }
`;
