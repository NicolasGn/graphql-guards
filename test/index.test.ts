import { graphql } from 'graphql';
import { publicData } from './data';
import schema from './graphql';
import { blockedQuery, privateQuery, publicQuery } from './graphql/queries';

describe('blocked query', () => {
  it('should always be blocked', async () => {
    const result = await graphql({
      schema,
      source: blockedQuery,
    });

    expect(result.data?.blockedQuery).toBeNull();
    expect(result.errors?.length).toEqual(1);
  });
});

describe('private query', () => {
  it('should not be blocked if guard condition is filled', async () => {
    const result = await graphql({
      schema,
      source: privateQuery,
      contextValue: {
        canAccessPrivate: true,
      },
    });

    expect(result.data?.privateQuery).toEqual('I am a private query');
    expect(result.errors).toBeUndefined();
  });

  it('should be blocked if guard condition is not filled', async () => {
    const result = await graphql({
      schema,
      source: privateQuery,
    });

    expect(result.data?.privateQuery).toBeNull();
    expect(result.errors?.length).toEqual(1);
  });
});

describe('public query', () => {
  it('should return private fields if guard condition is filled', async () => {
    const result = await graphql({
      schema,
      source: publicQuery,
      contextValue: {
        canAccessPrivate: true,
      },
    });

    expect(result.data?.publicQuery).toEqual(publicData);
    expect(result.errors).toBeUndefined();
  });

  it('should not return private fields if guard condition is not filled', async () => {
    const result = await graphql({
      schema,
      source: publicQuery,
    });

    expect(result.data?.publicQuery).toEqual({
      publicField: publicData.publicField,
      privateField: null,
      privateData: null,
    });
    expect(result.errors?.length).toEqual(2);
  });
});
