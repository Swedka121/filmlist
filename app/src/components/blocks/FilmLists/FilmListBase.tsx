/* ---- BASE ---- */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserListOnPage } from "@/dal/lists.dal";
import { FilmStatusEnum } from "@/db/schemas/schema";
import { cn } from "cn";
import { ArrowUpRight, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";

type BaseListProps = {
  headerElement: React.ReactNode;
  bodyElement: React.ReactNode | React.ReactNode[];
};
export function BaseList({ headerElement, bodyElement }: BaseListProps) {
  return (
    <section className="w-full h-max flex flex-col gap-4">
      <div className="w-full h-8 flex flex-row gap-2">{headerElement}</div>
      <div className="w-full h-max flex flex-col gap-1">{bodyElement}</div>
    </section>
  );
}

export interface ListBaseProps {
  films: UserListOnPage["filmList"];
}
export type Callback<T extends unknown[] = never[]> = (...args: T) => void;

type BaseFilmListElementProps = UserListOnPage["filmList"][0] & {
  additionalButtons?: React.ReactNode;
  additionalElements?: React.ReactNode;
  addedClassname?: string;
  otherOnBase?: Record<string, unknown>;
};

export function BaseFilmListElement({
  linkTo,
  imageUrl,
  title,
  description,
  status,
  additionalElements,
  additionalButtons,
  addedClassname,
  otherOnBase,
}: BaseFilmListElementProps) {
  const isViewed = useMemo(() => status == FilmStatusEnum.Viewed, [status]);
  return (
    <div
      className={cn(
        "w-full h-40 flex flex-row gap-2 p-2 bg-card relative border-card border-t-2 border-b-2 rounded-md overflow-hidden",
        isViewed ? "contrast-50 opacity-75" : undefined,
        addedClassname,
      )}
      {...otherOnBase}
    >
      {additionalElements}
      <div className="absolute right-0 top-0 w-max h-max flex flex-row gap-2 p-2 items-center">
        {isViewed ? (
          <Badge>{status}</Badge>
        ) : (
          <>
            {additionalButtons}
            <Link href={linkTo}>
              <Button
                variant={"secondary"}
                className={"w-7 h-7"}
                disabled={isViewed}
              >
                <ArrowUpRight />
              </Button>
            </Link>
          </>
        )}
      </div>
      <Image
        src={imageUrl}
        alt="filmAd"
        width={800}
        height={1200}
        className="h-full w-auto max-w-40 aspect-3/4 rounded-md"
      ></Image>
      <div className="flex flex-col w-100 h-full">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm font-light">{description}</p>
      </div>
    </div>
  );
}
