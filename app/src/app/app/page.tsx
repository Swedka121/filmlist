import { getUserLists } from "@/actions/lists.actions";
import FilmList from "@/components/blocks/FilmListList";
import { SearchBar } from "@/components/blocks/SearchBar";
import { Button } from "@/components/ui/button";
import { UserListItem } from "@/dal/lists.dal";
import { Plus } from "lucide-react";

export default async function Page() {
  const userLists = await getUserLists();
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-row items-center h-10 w-full gap-2">
        <SearchBar />
        <Button className="h-10 w-10">
          <Plus />
        </Button>
      </div>
      <FilmList filmList={userLists as UserListItem[]} />
    </section>
  );
}
