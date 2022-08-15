import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import {
  defaultFieldResolver,
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

export const applyGuardsToSchema = (
  schema: GraphQLSchema,
  guards: Guard[]
): GraphQLSchema => {
  const typeDirectives: Record<string, Record<string, Directive>> = {};

  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
      guards.forEach((guard) => {
        let { resolve = defaultFieldResolver } = fieldConfig;

        const typeDirective = typeDirectives[typeName]?.[guard.name];

        if (typeDirective !== undefined) {
          const typeGuardResolver = guard.apply(typeDirective);

          fieldConfig.resolve = async (...args) => {
            await typeGuardResolver(...args);
            return resolve(...args);
          };

          resolve = fieldConfig.resolve;
        }

        const fieldDirective = getDirective(
          schema,
          fieldConfig,
          guard.name
        )?.[0];

        if (fieldDirective !== undefined) {
          const fieldGuardResolver = guard.apply(fieldDirective);

          fieldConfig.resolve = async (...args) => {
            await fieldGuardResolver(...args);
            return resolve(...args);
          };
        }
      });

      return fieldConfig;
    },
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
  });
};
