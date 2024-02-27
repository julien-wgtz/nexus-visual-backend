import { User } from '@prisma/client';

function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key as Key)),
  ) as Omit<User, Key>;
}

export function filterUserClean(user: User) {
  const userClean = exclude(user, ['password', 'notionToken', 'confirmed']);
  return userClean;
}
