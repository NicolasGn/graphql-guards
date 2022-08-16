import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import {
  defaultFieldResolver,
  GraphQLFieldConfig,
  GraphQLFieldResolver,
  GraphQLSchema,
} from 'graphql';

export interface Guard<TContext = any, TDirectiveArgs = any> {
  name: string;
  apply: (
    directiveArgs: TDirectiveArgs
  ) => GraphQLFieldResolver<any, TContext, any, void>;
}

type Directive = Record<string, any>;

const setupGuardResolver = (
  fieldConfig: GraphQLFieldConfig<any, any>,
  guard: Guard,
  directive: Directive
) => {
  const { resolve = defaultFieldResolver } = fieldConfig;
  const guardResolver = guard.apply(directive);

  fieldConfig.resolve = async (...args) => {
    await guardResolver(...args);
    return resolve(...args);
  };
};

export const addGuards = (
  schema: GraphQLSchema,
  guards: Guard[]
): GraphQLSchema => {
  const typeDirectives: Record<string, Record<string, Directive>> = {};

  return mapSchema(schema, {
    [MapperKind.OBJECT_TYPE]: (type) => {
      guards.forEach((guard) => {
        const typeDirective = getDirective(schema, type, guard.name)?.[0];

        if (typeDirective !== undefined) {
          if (!typeDirectives[type.name]) {
            typeDirectives[type.name] = {};
          }
          typeDirectives[type.name][guard.name] = typeDirective;
        }
      });

      return type;
    },

    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
      guards.forEach((guard) => {
        const typeDirective = typeDirectives[typeName]?.[guard.name];

        if (typeDirective !== undefined) {
          setupGuardResolver(fieldConfig, guard, typeDirective);
        }

        const fieldDirective = getDirective(
          schema,
          fieldConfig,
          guard.name
        )?.[0];

        if (fieldDirective !== undefined) {
          setupGuardResolver(fieldConfig, guard, fieldDirective);
        }
      });

      return fieldConfig;
    },
  });
};
