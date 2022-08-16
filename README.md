# graphql-guards

[![CI](https://github.com/NicolasGn/graphql-guards/actions/workflows/ci.yml/badge.svg)](https://github.com/NicolasGn/graphql-guards/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/NicolasGn/graphql-guards/branch/master/graph/badge.svg?token=YNZJ837ZHF)](https://codecov.io/gh/NicolasGn/graphql-guards)

Simple authorization layer for your GraphQL server powered by directives.

## Features

- Inspired by [NestJS guards](https://docs.nestjs.com/guards)
- GraphQL server agnostic
- Typeable context and directive arguments
- Written in TypeScript
- Fully tested

## Installation

```
yarn add graphql-guards
```

## Quickstart

```TypeScript
import { makeExecutableSchema } from '@graphql-tools/schema';
import { addGuards, Guard } from 'graphql-guards';
import resolvers from './resolvers';

const typeDefs = /* GraphQL */ `
  directive @block on FIELD_DEFINITION | OBJECT

  type BlockedData @block {
    secret: String!
  }

  type PublicData {
    publicField: String!
    blockedField: String @block
  }

  type Query {
    publicData: PublicData!
    blockedData: BlockedData!
    blockedQuery: String @block
  }
`;

const blockGuard: Guard = {
  name: 'block',
  execute: (_directiveArgs) => async (_parent, _args, _context) => {
    throw new Error('You will never access this field or type.');
  },
}

let schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Here is your protected schema
schema = addGuards(schema, [blockGuard]);
```
