import { useSortedFilms } from "@/hooks/useSortedList";
import { SearchBar } from "../SearchBar";
import { BaseFilmListElement, BaseList, ListBaseProps } from "./FilmListBase";

export function FilmListRead({ films }: ListBaseProps) {
  const sortedFilms = useSortedFilms(films);
  return (
    <BaseList
      headerElement={
        <>
          <SearchBar />
        </>
      }
      bodyElement={sortedFilms.map((el) => (
        <BaseFilmListElement key={el.id} {...el} />
      ))}
    />
  );
}
