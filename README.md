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

## Usage

A guard is basically a [directive](#) that can be applied on locations `FIELD_DEFINITION` and `OBJECT`. It means you can then use this directive on a query, a mutation, an object field, or a type definition.

The directive can take arguments that can be used in your guard execution logic.

**Example**

```GraphQL
directive @simpleGuard on FIELD_DEFINITION | OBJECT

directive @guardWithArgs(
  myArg: Int!,
  argWithDefaultValue: String = "Default value"
) on FIELD_DEFINITION | OBJECT

directive @fieldOnlyGuard on FIELD_DEFINITION

directive @typeOnlyGuard on OBJECT
```

To protect your GraphQL API with guards, you have to transform your executable schema with the `addGuards` function exposed by the module. Here is the prototype of the function :

```TypeScript
addGuards(schema: GraphQLSchema, guards: Guard[]): GraphQLSchema
```

The `Guard` interface is exposed by the module. Here is how it looks :

```TypeScript
interface Guard<TContext = any, TDirectiveArgs = any> {
  // This must be the name of the directive declared in your schema
  name: string;

  // You will write the guard's logic in this method
  execute: (directiveArgs: TDirectiveArgs) => GraphQLFieldResolver<any, TContext, any, void>;
}
```

The `execute` method of a Guard must return a GraphQL resolver. It's role will be to perform checks, and to throw an error when one of them fails to avoid the execution of the _real_ resolver.

**Example**

```TypeScript
interface Context {
  auth?: {
    isAdmin: boolean;
  }
}

const Guard: Guard<Context, { requiresAdmin: boolean }> {
  name: 'auth',
  execute: ({ requiresAdmin }) => async (_parent, _args, { auth }) => {
    if (!auth) {
      throw new MyGraphQLServerError('Unauthorized');
    }

    if (requiresAdmin && !auth.isAdmin) {
      throw new MyGraphQLServerError('Forbidden');
    }
  }
}
```
