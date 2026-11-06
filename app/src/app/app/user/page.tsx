"use client";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/authClient";
import { giveFallbackAvatar } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { da } from "@faker-js/faker";

function Empty() {
  return (
    <div className="w-full h-[70vh] flex items-center justify-center">
      <Spinner />
    </div>
  );
}

export default function Page() {
  const { isPending, data } = authClient.useSession();
  if (isPending || !data) return <Empty />;
  return (
    <section className="w-full h-max flex flex-col gap-5">
      <div className="w-full h-20">
        <div
          className={"flex flex-row gap-5 items-center w-max h-full p-2 px-5"}
        >
          <Avatar className={"w-15 h-15"}>
            <AvatarImage src={data.user.image!}></AvatarImage>
            <AvatarFallback>
              {giveFallbackAvatar(data.user.name)}
            </AvatarFallback>
          </Avatar>
          <h2 className={"text-4xl   font-bold"}>{data.user.name}</h2>
        </div>
      </div>
      <span className="border-1 border-primary/10"></span>
    </section>
  );
}
