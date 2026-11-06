import { UserListItem } from "@/dal/lists.dal";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowUpRight, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { giveFallbackAvatar } from "@/lib/utils";
import { Badge } from "../ui/badge";

function ListItem(item: UserListItem) {
  return (
    <div className="w-full h-100 bg-secondary rounded-md border-2 border-secondary relative overflow-hidden flex flex-row hover:border-accent/20 hover:border-4 transition-all">
      <div className="w-full h-20 flex flex-row gap-2 justify-between absolute bottom-0 p-5 left-0 z-20 bg-background/60">
        <div className="w-max h-full flex flex-row gap-2 items-center">
          <Avatar>
            <AvatarImage src={item.owner.avatarUrl!}></AvatarImage>
            <AvatarFallback>
              {giveFallbackAvatar(item.owner.username)}
            </AvatarFallback>
          </Avatar>
          <p>{item.owner.username}</p>
        </div>
        <div className="w-max h-full flex flex-row gap-2 items-center justify-center">
          {item.isPublic ? <Badge>Public</Badge> : <Badge>Private</Badge>}
          <Badge>{item.myRole}</Badge>
          <Badge>Viewers: {item.countOfUsers}</Badge>
        </div>
      </div>
      <Image
        src={item.imageUrl}
        alt="image"
        width={1200}
        height={900}
        className="w-full aspect-[4/3] object-cover object-center blur-md absolute z-0 top-0 left-0"
      />
      <h2 className="relative z-20 text-6xl font-black font-bebas p-10">
        {item.name}
      </h2>
      <Button
        variant={"outline"}
        className="relative h-10 w-10 ml-auto mt-5 mr-5"
      >
        <ArrowUpRight />
      </Button>
    </div>
  );
}
function List({ filmList }: { filmList: UserListItem[] }) {
  return (
    <div className="flex flex-col w-full h-max pb-20 gap-5">
      {filmList.map((item) => (
        <ListItem key={item.id} {...item} />
      ))}
    </div>
  );
}
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
  return <List filmList={filmList} />;
}
