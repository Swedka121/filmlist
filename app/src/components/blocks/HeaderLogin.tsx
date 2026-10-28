"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toast";
import { LayoutDashboardIcon } from "lucide-react";

export function HeaderLogin() {
  const { isPending, data } = authClient.useSession();
  if (isPending) return <Skeleton className="w-20 h-5" />;
  if (!data)
    return (
      <Button
        onClick={() =>
          authClient.signIn.social({ provider: "google" }).catch((err) =>
            toast.add({
              data: "Something went wrong",
              description: (err as Error).message,
            }),
          )
        }
      >
        Continue with Google <SiGoogle />
      </Button>
    );
  return (
    <div className={"flex flex-row gap-4 items-center w-max h-full"}>
      <Avatar>
        <AvatarImage src={data.user.image!}></AvatarImage>
        <AvatarFallback>
          {data?.user?.name
            ?.split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <h2 className={"text-sm font-medium max-w-30"}>{data.user.name}</h2>
    </div>
  );
}
