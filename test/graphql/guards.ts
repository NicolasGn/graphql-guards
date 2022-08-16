import { Guard } from '../../src';
import Context from './context';

export const blockGuard: Guard<Context> = {
  name: 'block',
  execute: () => (_parent, _args, _context) => {
    throw new Error();
  },
};

export const privateGuard: Guard<Context> = {
  name: 'private',
  execute:
    () =>
    (parent, args, { canAccessPrivate }) => {
      if (!canAccessPrivate) {
        throw new Error();
      }
    },
};
