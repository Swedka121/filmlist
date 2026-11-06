import { DALCallback } from "./dal.types";

export type MockDataFacory<T = unknown> = (count: number) => MockDataFun<T>;
export type MockDataFun<T = unknown> = () => T;

export function withMock<A extends unknown[] = unknown[], R = unknown>(
  callback: DALCallback<A, R>,
  mockData: MockDataFun<R>,
): DALCallback<A, R> {
  if (process.env.MOCK == "true") return async (...args: A) => mockData();
  return callback;
}
