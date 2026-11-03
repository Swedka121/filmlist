import "server-only";
import { withSession } from "./session.dal";
import { db } from "@/lib/db";
import * as schema from "@/db/schemas/schema";
import * as authSchema from "@/db/schemas/auth-schema";
import { eq, sql } from "drizzle-orm";
import { cache } from "react";

interface _UserListItem {
  owner: {
    avatarUrl: string | null;
    username: string;
  };
  myRole: schema.FilmListUserEnum;
  countOfUsers: number;
}

export type UserListItem = typeof schema.filmList.$inferSelect & _UserListItem;

export const getUserListsDAL = withSession(
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
