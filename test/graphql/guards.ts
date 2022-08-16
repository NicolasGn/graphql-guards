import { Guard } from '../../src';
import Context from './context';

export const blockGuard: Guard<Context> = {
  name: 'block',
  apply: () => (_parent, _args, _context) => {
    throw new Error();
  },
};

export const privateGuard: Guard<Context> = {
  name: 'private',
  apply:
    () =>
    (parent, args, { canAccessPrivate }) => {
      if (!canAccessPrivate) {
        throw new Error();
      }
    },
};
