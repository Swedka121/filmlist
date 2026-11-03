import {
  pgTable,
  pgEnum,
  text,
  integer,
  timestamp,
  primaryKey,
  index,
  unique,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";
import { user } from "./auth-schema";
import { randomUUID } from "node:crypto";

const idRow = uuid("id").primaryKey().$defaultFn(randomUUID);

export enum FilmListUserEnum {
  Owner = "Owner",
  Edit = "Edit",
  Read = "Read",
}
export const filmListUserRoleEnum = pgEnum("film_user_role", FilmListUserEnum);
export enum FilmStatusEnum {
  Viewed = "Viewed",
  InQueue = "InQueue",
}
export const filmStatusEnum = pgEnum("film_status", FilmStatusEnum);

export const filmList = pgTable(
  "film_list",
  {
    id: idRow,
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    isPublic: boolean().default(false).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("idx_film_list_name").on(t.name),
    index("film_list_name_trgm_idx").using("gin", t.name.op("gin_trgm_ops")),
  ],
);

export const filmListUser = pgTable(
  "film_list_user",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    filmListId: uuid("film_list_id")
      .notNull()
      .references(() => filmList.id, { onDelete: "cascade" }),
    role: filmListUserRoleEnum("role").default(FilmListUserEnum.Read).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.filmListId] })],
);

export const film = pgTable(
  "film",
  {
    id: idRow,
    filmListId: uuid("film_list_id").references(() => filmList.id, {
      onDelete: "cascade",
    }),
    position: integer("position").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    imageUrl: text("image_url").notNull(),
    linkTo: text("link_to").notNull(),
    status: filmStatusEnum("status").default(FilmStatusEnum.InQueue),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("idx_film_status").on(t.status),
    unique("film_title_list_idx").on(t.title, t.filmListId),
    index("film_title_trgm_idx").using("gin", t.title.op("gin_trgm_ops")),
    index("film_desc_idx").using("gin", t.description.op("gin_trgm_ops")),
  ],
);

export const customRelations = defineRelations(
  { user, filmList, filmListUser, film },
  (r) => ({
    filmList: {
      films: r.many.film(),
      users: r.many.user({
        from: r.filmList.id.through(r.filmListUser.filmListId),
        to: r.user.id.through(r.filmListUser.userId),
      }),
    },
    film: {
      filmList: r.one.filmList({
        from: r.film.filmListId,
        to: r.filmList.id,
      }),
    },
    user: {
      filmLists: r.many.filmList({
        from: r.user.id.through(r.filmListUser.userId),
        to: r.filmList.id.through(r.filmListUser.filmListId),
      }),
    },
  }),
);
