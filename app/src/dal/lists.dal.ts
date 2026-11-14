import "server-only";
import { withSession } from "./session.dal";
import { db } from "@/lib/db";
import * as schema from "@/db/schemas/schema";
import * as authSchema from "@/db/schemas/auth-schema";
import { and, eq, sql } from "drizzle-orm";
import { cache } from "react";
import { withMock } from "./mock.dal";
import {
  createMockUserLists,
  createMockUserListsOnPage,
} from "@/testing/mockLists";

interface _UserListItem {
  owner: {
    avatarUrl: string | null;
    username: string;
  };
  myRole: schema.FilmListUserEnum;
  countOfUsers: number;
}

export type UserListItem = typeof schema.filmList.$inferSelect & _UserListItem;

export const getUserListsDAL = withMock(
  withSession(
    cache(async ({ session, user }): Promise<UserListItem[]> => {
      const lists = await db
        .select({
          id: schema.filmList.id,
          name: schema.filmList.name,
          imageUrl: schema.filmList.imageUrl,
          isPublic: schema.filmList.isPublic,
          createdAt: schema.filmList.createdAt,
          updatedAt: schema.filmList.updatedAt,
          countOfUsers: sql<number>`(
      SELECT count(*) 
      FROM ${schema.filmListUser} 
      WHERE ${schema.filmListUser.filmListId} = ${schema.filmList.id}
    )`,

          myRole: sql<schema.FilmListUserEnum>`(
      SELECT ${schema.filmListUser.role} 
      FROM ${schema.filmListUser} 
      WHERE ${schema.filmListUser.filmListId} = ${schema.filmList.id} 
        AND ${schema.filmListUser.userId} = ${user.id}
    )`,
          owner: sql<{ username: string; avatarUrl: string | null }>`(
      SELECT json_build_object('username', ${authSchema.user.name}, 'avatarUrl', ${authSchema.user.image})
      FROM ${schema.filmListUser}
      LEFT JOIN ${authSchema.user} ON ${authSchema.user.id} = ${schema.filmListUser.userId}
      WHERE ${schema.filmListUser.filmListId} = ${schema.filmList.id} 
        AND ${schema.filmListUser.role} = ${schema.FilmListUserEnum.Owner}
      LIMIT 1
    )`,
        } satisfies Record<keyof UserListItem, unknown>)
        .from(schema.filmList)
        .innerJoin(
          schema.filmListUser,
          eq(schema.filmListUser.filmListId, schema.filmList.id),
        )
        .where(eq(schema.filmListUser.userId, user.id));

      return lists;
    }),
  ),
  createMockUserLists(10),
);

export const createUserListDAL = withSession(
  async (
    { session, user },
    { name, imageUrl }: { name: string; imageUrl: string },
  ) => {
    await db.transaction(async (tx) => {
      const createdList = await tx
        .insert(schema.filmList)
        .values({
          name,
          imageUrl,
        })
        .returning();
      await tx.insert(schema.filmListUser).values({
        userId: user.id,
        filmListId: createdList[0].id,
        role: schema.FilmListUserEnum.Owner,
      });
    });
  },
);

interface _UserListOnPage {
  myRole: schema.FilmListUserEnum;
  owner: {
    avatarUrl: string | null;
    username: string;
  };
  userList: {
    id: string;
    avatarUrl: string | null;
    username: string;
    role: schema.FilmListUserEnum;
  }[];
  filmList: (typeof schema.film.$inferSelect)[];
}

export type UserListOnPage = _UserListOnPage &
  typeof schema.filmList.$inferSelect;

export const getListByIdDAL = withMock(
  withSession(async ({ session, user }, listId: string) => {
    return await db.transaction(async (tx) => {
      const allowed = await tx
        .select({
          userId: schema.filmListUser.userId,
          isPublic: schema.filmList.isPublic,
        })
        .from(schema.filmList)
        .innerJoin(
          schema.filmListUser,
          and(
            eq(schema.filmList.id, schema.filmListUser.filmListId),
            eq(schema.filmListUser.userId, user.id),
          ),
        )
        .then((data) => data[0].isPublic || data[0].userId == user.id)
        .catch(() => false);

      if (!allowed) return null;

      const _filmList = await tx
        .select({
          id: schema.filmList.id,
          name: schema.filmList.name,
          imageUrl: schema.filmList.imageUrl,
          isPublic: schema.filmList.isPublic,
          createdAt: schema.filmList.createdAt,
          updatedAt: schema.filmList.updatedAt,
          myRole: sql<schema.FilmListUserEnum>`(
      SELECT ${schema.filmListUser.role} 
      FROM ${schema.filmListUser} 
      WHERE ${schema.filmListUser.filmListId} = ${schema.filmList.id} 
        AND ${schema.filmListUser.userId} = ${user.id}
    )`,
          owner: sql<{ username: string; avatarUrl: string | null }>`(
      SELECT json_build_object('username', ${authSchema.user.name}, 'avatarUrl', ${authSchema.user.image})
      FROM ${schema.filmListUser}
      LEFT JOIN ${authSchema.user} ON ${authSchema.user.id} = ${schema.filmListUser.userId}
      WHERE ${schema.filmListUser.filmListId} = ${schema.filmList.id} 
        AND ${schema.filmListUser.role} = ${schema.FilmListUserEnum.Owner}
      LIMIT 1
    )`,
          filmList: sql<(typeof schema.film.$inferSelect)[]>`
        SELECT * FROM ${schema.film} WHERE ${schema.film.filmListId}==${listId}`,
        } satisfies Record<keyof Omit<UserListOnPage, "userList">, unknown>)
        .from(schema.filmList)
        .where(eq(schema.filmList.id, listId));

      if (!_filmList[0]) return null;
      const filmList: UserListOnPage = { ..._filmList[0], userList: [] };
      if (filmList.myRole == schema.FilmListUserEnum.Owner)
        filmList.userList = await tx
          .select({
            id: schema.filmListUser.userId,
            avatarUrl: sql<string>`SELECT ${authSchema.user.image} FROM ${authSchema.user} WHERE ${authSchema.user.id} = ${schema.filmListUser.userId}`,
            username: sql<string>`SELECT ${authSchema.user.name} FROM ${authSchema.user} WHERE ${authSchema.user.id} = ${schema.filmListUser.userId}`,
            role: schema.filmListUser.role,
          })
          .from(schema.filmListUser)
          .where(eq(schema.filmListUser.filmListId, listId));

      return filmList;
    });
  }),
  createMockUserListsOnPage(1),
);
