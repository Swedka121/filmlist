import { UserListItem } from "@/dal/lists.dal";
import Image from "next/image";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

function ListItem() {}
function List() {}
function EmptyList() {
  return (
    <section className="w-full h-full flex flex-row-reverse gap-30 items-center justify-center">
      <Image
        src={"/emptyStatePhoto.jpg"}
        width={1344}
        height={768}
        alt="emptyStatePhoto"
        className="w-120 h-150 object-cover blur-out-xs border-2 border-primary"
      ></Image>
      <div className="flex flex-col items-start justify-center gap-2">
        <h2 className="font-bold text-3xl">Your movie lists are empty</h2>
        <p className="text-muted-foreground max-w-100">
          Start building your collection by creating a list of your favorite
          movies, movies you want to watch, or recommendations to share.
        </p>
        <div className="flex flex-row gap-2 mt-5">
          <Button size={"lg"}>
            <Plus />
            Create a new one
          </Button>
          <Button size={"lg"} variant={"secondary"}>
            Add by code
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function FilmList({ filmList }: { filmList: UserListItem[] }) {
  if (filmList.length == 0) return <EmptyList />;
}
