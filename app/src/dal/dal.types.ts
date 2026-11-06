export type DALCallback<A extends unknown[] = unknown[], R = unknown> = (
  ...args: A
) => Promise<R> | R;
