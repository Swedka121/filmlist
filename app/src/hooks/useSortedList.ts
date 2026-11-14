import { UserListOnPage } from "@/dal/lists.dal";
import { FilmStatusEnum } from "@/db/schemas/schema";
import { useMemo } from "react";

export const useSortedFilms = (films: UserListOnPage["filmList"]) => {
  return useMemo(
    () =>
      [...films]
        .sort(
          (a, b) =>
            Number(a.status === FilmStatusEnum.Viewed) -
              Number(b.status === FilmStatusEnum.Viewed) ||
            a.position - b.position,
        )
        .map((el, i) => ({ ...el, position: i })),
    [films],
  );
};
