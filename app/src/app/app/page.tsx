import FilmList from "@/components/blocks/FilmList";
import { SearchBar } from "@/components/blocks/SearchBar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Page() {
  return (
    <section className="flex flex-col gap-20">
      <div className="flex flex-row items-center h-10 w-full gap-2">
        <SearchBar />
        <Button className="h-10 w-10">
          <Plus />
        </Button>
      </div>
      <FilmList filmList={[]} />
    </section>
  );
}
