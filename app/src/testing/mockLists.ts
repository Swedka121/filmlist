import "server-only";
import { faker } from "@faker-js/faker";
import { FilmListUserEnum } from "@/db/schemas/schema";
import type { UserListItem } from "@/dal/lists.dal";
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

export const createMockUserLists: MockDataFacory<UserListItem[]> = (
  count: number,
) => {
  return () => faker.helpers.multiple(createMockUserList, { count });
};
