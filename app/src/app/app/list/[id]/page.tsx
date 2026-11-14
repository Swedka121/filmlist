import { getUserListById } from "@/actions/lists.actions";
import { FilmListEdit } from "@/components/blocks/FilmLists/FilmListEdit";
import { FilmListRead } from "@/components/blocks/FilmLists/FilmListRead";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserListOnPage } from "@/dal/lists.dal";
import { FilmListUserEnum } from "@/db/schemas/schema";
import { giveFallbackAvatar } from "@/lib/utils";
import { Globe, User, Lock, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface Props {
  list: UserListOnPage;
}
function OwnerLook({ list }: Props) {
  return (
    <Tabs>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value={"overview"} className={"mt-2"}>
        <FilmListEdit films={list.filmList} />
      </TabsContent>
      <TabsContent value={"users"}></TabsContent>
      <TabsContent value={"settings"}></TabsContent>
    </Tabs>
  );
}
function EditLook({ list }: Props) {
  return <FilmListEdit films={list.filmList} />;
}
function ReadLook({ list }: Props) {
  return <FilmListRead films={list.filmList} />;
}

export default async function Page({ params }: PageProps<"/app/list/[id]">) {
  const { id } = await params;
  const list = (await getUserListById(id)) as UserListOnPage;
  return (
    <div className="flex flex-col w-full h-max gap-5 pb-20">
      <Button className={"w-max h-7"} variant={"ghost"}>
        <ArrowLeft />
        Back
      </Button>
      <section className="flex flex-col">
        <div className="w-full h-200 overflow-hidden rounded-md relative">
          <Image
            src={list.imageUrl}
            alt="image"
            width={1200}
            height={800}
            className="absolute left-0 top-0 w-full h-[95%] blur-sm"
          ></Image>
          <h1 className="text-6xl font-bebas relative z-20 p-10">
            {list.name}
          </h1>
        </div>
        <div className="w-full h-10 flex justify-between">
          <div className="w-max h-full flex flex-row items-center gap-2">
            <Avatar className={"w-10 h-10"}>
              <AvatarImage src={list.owner.avatarUrl!}></AvatarImage>
              <AvatarFallback>
                {giveFallbackAvatar(list.owner.username)}
              </AvatarFallback>
            </Avatar>
            <h2 className={"text-xl"}>{list.owner.username}</h2>
          </div>
          <div className="w-max h-full flex flex-row gap-2">
            {list.isPublic ? (
              <Badge>
                <Globe /> Public
              </Badge>
            ) : (
              <Badge>
                <Lock />
                Private
              </Badge>
            )}
            <Badge>
              <User />
              {list.myRole}
            </Badge>
          </div>
        </div>
      </section>
      {list.myRole == FilmListUserEnum.Owner && <OwnerLook list={list} />}
      {list.myRole == FilmListUserEnum.Edit && <EditLook list={list} />}
      {list.myRole == FilmListUserEnum.Read && <ReadLook list={list} />}
    </div>
  );
}
