import "server-only";
import { faker } from "@faker-js/faker";
import { FilmListUserEnum, FilmStatusEnum } from "@/db/schemas/schema";
import type { UserListItem, UserListOnPage } from "@/dal/lists.dal";
import type { MockDataFacory } from "@/dal/mock.dal";

const mockNow = new Date("2026-01-01T00:00:00.000Z");

export function createMockUserList(): UserListItem {
  const createdAt = faker.date.past({ years: 1, refDate: mockNow });

  return {
    id: faker.string.uuid(),
    name: faker.music.songName(),
    imageUrl: "/emptyStatePhoto.jpg",
    isPublic: faker.datatype.boolean(),
    createdAt,
    updatedAt: faker.date.between({ from: createdAt, to: mockNow }),
    owner: {
      username: faker.internet.username(),
      avatarUrl: faker.datatype.boolean() ? faker.image.avatar() : null,
    },
    myRole: faker.helpers.arrayElement(Object.values(FilmListUserEnum)),
    countOfUsers: faker.number.int({ min: 1, max: 10 }),
  };
}

export const createMockUserLists: MockDataFacory<
  UserListItem[] | UserListItem
> = (count: number) => {
  if (count == 1) return () => createMockUserList();
  return () => faker.helpers.multiple(createMockUserList, { count });
};

function createMockUserListOnPage(): UserListOnPage {
  const createdAt = faker.date.past({ years: 1, refDate: mockNow });
  const listId = faker.string.uuid();

  return {
    id: listId,
    name: faker.music.songName(),
    imageUrl: "/emptyStatePhoto.jpg",
    isPublic: faker.datatype.boolean(),
    createdAt,
    updatedAt: faker.date.between({ from: createdAt, to: mockNow }),

    myRole: faker.helpers.arrayElement(Object.values(FilmListUserEnum)),

    owner: {
      username: faker.internet.username(),
      avatarUrl: faker.datatype.boolean() ? faker.image.avatar() : null,
    },

    userList: faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        username: faker.internet.username(),
        avatarUrl: faker.datatype.boolean() ? faker.image.avatar() : null,
        role: faker.helpers.arrayElement(Object.values(FilmListUserEnum)),
      }),
      { count: { min: 1, max: 5 } },
    ),

    filmList: faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        filmListId: listId,
        position: faker.number.int({ min: 1, max: 20 }),
        title: faker.music.songName(),
        description: faker.lorem.paragraph(),
        imageUrl: "/test_film_poster.jpg",
        linkTo: faker.internet.url(),
        status: faker.helpers.arrayElement(Object.values(FilmStatusEnum)),
        createdAt,
        updatedAt: faker.date.between({ from: createdAt, to: mockNow }),
      }),
      { count: { min: 0, max: 10 } },
    ),
  };
}

export const createMockUserListsOnPage: MockDataFacory<
  UserListOnPage[] | UserListOnPage
> = (count: number) => {
  if (count === 1) return () => createMockUserListOnPage();
  return () => faker.helpers.multiple(createMockUserListOnPage, { count });
};
