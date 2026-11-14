"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserListOnPage } from "@/dal/lists.dal";
import { FilmStatusEnum } from "@/db/schemas/schema";
import {
  ArrowUpRight,
  CheckIcon,
  CrossIcon,
  Eye,
  Menu,
  PenIcon,
  Plus,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "../SearchBar";
import React, { JSX, useMemo, useRef, useState } from "react";
import { cn } from "cn";

export interface EditListBaseProps {
  films: UserListOnPage["filmList"];
}
type ListModeBaseProps = EditListBaseProps & {
  setMode: Callback<[ModesE | ((prev: ModesE) => ModesE)]>;
};
type Callback<T extends unknown[] = never[]> = (...args: T) => void;
enum ModesE {
  View = "View",
  Change = "Change",
}

/* ---- HOOKS ---- */
const useSortedFilms = (films: UserListOnPage["filmList"]) => {
  return useMemo(
    () =>
      [...films]
        .sort(
          (a, b) =>
            Number(a.status === FilmStatusEnum.Viewed) -
              Number(b.status === FilmStatusEnum.Viewed) ||
            a.position - b.position,
        )
        .map((el, i) => ({ ...el, position: i })),
    [films],
  );
};

/* ----   CHANGE MODE ----  */

type ChangeModeElementProps = UserListOnPage["filmList"][0] & {
  onDragStart: Callback<[id: string]>;
  onDragEnter: Callback<[id: string]>;
  onDragEnd: Callback;
  deleteCallback: Callback<[id: string]>;
};

function ChangeModeElement({
  id,
  title,
  description,
  imageUrl,
  status,
  linkTo,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: ChangeModeElementProps) {
  const isViewed = useMemo(() => status == FilmStatusEnum.Viewed, [status]);
  return (
    <div
      className={cn(
        "w-full h-40 flex flex-row gap-2 p-2 pl-12 bg-card relative border-card border-t-2 border-b-2 rounded-md overflow-hidden",
        isViewed ? "contrast-50 opacity-75" : undefined,
      )}
      onDragEnter={(ev) => {
        ev.preventDefault();
        if (isViewed) return;
        onDragEnter(id);
      }}
      onDrop={(ev) => {
        if (isViewed) return;
        ev.preventDefault();
      }}
    >
      <div
        className="w-10 h-[120%] bg-secondary flex justify-center items-center absolute left-0 top-[-10%]"
        draggable={!isViewed}
        onDragStart={() => {
          if (isViewed) return;
          onDragStart(id);
        }}
        onDragEnd={() => {
          if (isViewed) return;
          onDragEnd();
        }}
      >
        <Menu />
      </div>
      <div className="absolute right-0 top-0 w-max h-max flex flex-row gap-2 p-2 items-center">
        {isViewed ? (
          <Badge>{status}</Badge>
        ) : (
          <>
            <Button
              disabled={isViewed}
              variant={"destructive"}
              className={"h-7 text-xs"}
            >
              <TrashIcon /> Delete
            </Button>
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

function ChangeModeList({ films, setMode }: ListModeBaseProps) {
  const [filmSt, setFilms] = useState(films);
  const sortedFilms = useSortedFilms(filmSt);

  const draggedIdRef = useRef<string | null>(null);
  const lastOverIdRef = useRef<string | null>(null);

  const handleDragStart = (id: string) => {
    draggedIdRef.current = id;
    lastOverIdRef.current = null;
  };

  const handleDragEnter = (targetId: string) => {
    const draggedId = draggedIdRef.current;
    if (
      !draggedId ||
      draggedId === targetId ||
      lastOverIdRef.current === targetId
    ) {
      return;
    }

    lastOverIdRef.current = targetId;
    setTimeout(() => {
      if (lastOverIdRef.current == targetId) lastOverIdRef.current = null;
    }, 300);

    setFilms((prev) => {
      const draggedIdx = prev.findIndex((film) => film.id === draggedId);
      const targetIdx = prev.findIndex((film) => film.id === targetId);
      if (draggedIdx < 0 || targetIdx < 0) return prev;

      const dragged = prev[draggedIdx];
      const reordered = prev.filter((film) => film.id !== draggedId);
      reordered.splice(targetIdx, 0, dragged);

      return reordered.map((film, index) => ({ ...film, position: index }));
    });
  };

  const handleDragEnd = () => {
    draggedIdRef.current = null;
    lastOverIdRef.current = null;
  };

  const confirmCallback = () => {
    setMode(ModesE.View);
  };

  return (
    <BaseList
      bodyElement={sortedFilms.map((el) => (
        <ChangeModeElement
          key={el.id}
          {...el}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
          deleteCallback={() => {}}
        />
      ))}
      headerElement={
        <>
          <Button onClick={confirmCallback}>
            <CheckIcon /> Confirm
          </Button>
          <Button onClick={() => setMode(ModesE.View)} variant={"destructive"}>
            <PlusIcon /> Cancel
          </Button>
        </>
      }
    />
  );
}

/* ---- VIEW MODE ---- */

type ViewModeElementProps = UserListOnPage["filmList"][0] & {
  onViewMarked: Callback;
};

export function ViewModeElement({
  id,
  linkTo,
  imageUrl,
  title,
  description,
  status,
  onViewMarked,
}: ViewModeElementProps) {
  const isViewed = useMemo(() => status == FilmStatusEnum.Viewed, [status]);
  return (
    <div
      className={cn(
        "w-full h-40 flex flex-row gap-2 p-2 bg-card relative border-card border-t-2 border-b-2 rounded-md",
        isViewed ? "contrast-50 opacity-75" : undefined,
      )}
    >
      <div className="absolute right-0 top-0 w-max h-max flex flex-row gap-2 p-2 items-center">
        {isViewed ? (
          <Badge>{status}</Badge>
        ) : (
          <>
            <Button className={"h-7 text-xs"} onClick={() => onViewMarked()}>
              <Eye /> Mark as viewed
            </Button>
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

export function ViewModeList({ films, setMode }: ListModeBaseProps) {
  const sortedFilms = useSortedFilms(films);
  return (
    <BaseList
      headerElement={
        <>
          <SearchBar />
          <Button className={"h-full"}>
            <Plus />
            Add new
          </Button>
          <Button
            className={"h-full"}
            variant={"secondary"}
            onClick={() => setMode(ModesE.Change)}
          >
            <PenIcon /> Change
          </Button>
        </>
      }
      bodyElement={sortedFilms.map((el) => (
        <ViewModeElement
          key={el.id}
          {...el}
          onViewMarked={(id: string) => {}}
        />
      ))}
    ></BaseList>
  );
}

/* ---- BASE ---- */

type BaseListProps = {
  headerElement: React.ReactNode;
  bodyElement: React.ReactNode | React.ReactNode[];
};
function BaseList({ headerElement, bodyElement }: BaseListProps) {
  return (
    <section className="w-full h-max flex flex-col gap-4">
      <div className="w-full h-8 flex flex-row gap-2">{headerElement}</div>
      <div className="w-full h-max flex flex-col gap-1">{bodyElement}</div>
    </section>
  );
}

export function FilmListEdit({ films }: { films: UserListOnPage["filmList"] }) {
  const [mode, setMode] = useState<ModesE>(ModesE.Change);
  switch (mode) {
    case ModesE.View:
      return <ViewModeList films={films} setMode={setMode} />;
    case ModesE.Change:
      return <ChangeModeList films={films} setMode={setMode} />;
  }
}
