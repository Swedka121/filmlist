import { auth } from "@/lib/auth";
import { Session, User } from "better-auth";
import { unauthorized } from "next/navigation";
import { cache } from "react";
import "server-only";

interface BASession {
  session: Session;
  user: User;
}

const getCachedSession = cache(async () => {
  const session = await auth.api.getSession();
  if (!session) {
    unauthorized();
  }
  return session;
});

export function withSession<TArgs extends unknown[], TReturn>(
  callback: (session: BASession, ...args: TArgs) => Promise<TReturn> | TReturn,
) {
  return async (...args: TArgs): Promise<TReturn> => {
    const session = await getCachedSession();
    return await callback(session, ...args);
  };
}
