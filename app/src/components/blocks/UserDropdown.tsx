"use client";

import { PropsWithChildren } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LayoutDashboardIcon, Lock, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";

export function UserDropdown({ children }: PropsWithChildren) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href={"/app/"}>
          <DropdownMenuItem>
            <LayoutDashboardIcon />
            Dashboard
          </DropdownMenuItem>
        </Link>
        <Link href={"/app/user"}>
          <DropdownMenuItem>
            <Lock /> Privacy settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            authClient.signOut({ disableRedirect: true }).then(() => {
              router.push("/");
            });
          }}
        >
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
