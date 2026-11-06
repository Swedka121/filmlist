"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toast";
import { giveFallbackAvatar } from "@/lib/utils";
import { UserDropdown } from "./UserDropdown";
import { ChevronDown } from "lucide-react";

export function HeaderLogin({ callbackUrl }: { callbackUrl?: string }) {
  const { isPending, data } = authClient.useSession();
  if (isPending) return <Skeleton className="w-20 h-5" />;
  if (!data)
    return (
      <Button
        onClick={() =>
          authClient.signIn
            .social({ provider: "google", callbackURL: callbackUrl })
            .catch((err) =>
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
    <UserDropdown>
      <div className={"flex flex-row gap-2 items-center w-max h-full p-2 px-5"}>
        <Avatar>
          <AvatarImage src={data.user.image!}></AvatarImage>
          <AvatarFallback>{giveFallbackAvatar(data.user.name)}</AvatarFallback>
        </Avatar>
        <h2 className={"text-sm font-medium max-w-30 mr-2"}>
          {data.user.name}
        </h2>
        <ChevronDown className="w-5 h-5 opacity-40" />
      </div>
    </UserDropdown>
  );
}
