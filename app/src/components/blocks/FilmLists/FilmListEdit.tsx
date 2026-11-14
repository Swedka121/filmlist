"use client";

import { Button } from "@/components/ui/button";
import { UserListOnPage } from "@/dal/lists.dal";
import { FilmStatusEnum } from "@/db/schemas/schema";
import {
  CheckIcon,
  Eye,
  Menu,
  PenIcon,
  Plus,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { SearchBar } from "../SearchBar";
import { useMemo, useRef, useState } from "react";
import {
  BaseFilmListElement,
  BaseList,
  Callback,
  ListBaseProps,
} from "./FilmListBase";
import { useSortedFilms } from "@/hooks/useSortedList";

export type ListModeBaseProps = ListBaseProps & {
  setMode: Callback<[ModesE | ((prev: ModesE) => ModesE)]>;
};

enum ModesE {
  View = "View",
  Change = "Change",
}

/* ----   CHANGE MODE ----  */

type ChangeModeElementProps = UserListOnPage["filmList"][0] & {
  onDragStart: Callback<[id: string]>;
  onDragEnter: Callback<[id: string]>;
  onDragEnd: Callback;
  deleteCallback: Callback<[id: string]>;
};

function ChangeModeElement({
  onDragStart,
  onDragEnter,
  onDragEnd,
  id,
  status,
  ...args
}: ChangeModeElementProps) {
  const isViewed = useMemo(() => status == FilmStatusEnum.Viewed, [status]);
  return (
    <BaseFilmListElement
      additionalElements={
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
      }
      additionalButtons={
        <Button
          disabled={isViewed}
          variant={"destructive"}
          className={"h-7 text-xs"}
        >
          <TrashIcon /> Delete
        </Button>
      }
      otherOnBase={{
        onDragEnter: (ev: Event) => {
          ev.preventDefault();
          if (isViewed) return;
          onDragEnter(id);
        },
        onDrop: (ev: Event) => {
          if (isViewed) return;
          ev.preventDefault();
        },
      }}
      addedClassname="pl-12"
      id={id}
      status={status}
      {...args}
    />
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
  onViewMarked,
  ...args
}: ViewModeElementProps) {
  return (
    <BaseFilmListElement
      {...args}
      additionalButtons={
        <Button className={"h-7 text-xs"} onClick={() => onViewMarked()}>
          <Eye /> Mark as viewed
        </Button>
      }
    />
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

export function FilmListEdit({ films }: { films: UserListOnPage["filmList"] }) {
  const [mode, setMode] = useState<ModesE>(ModesE.View);
  switch (mode) {
    case ModesE.View:
      return <ViewModeList films={films} setMode={setMode} />;
    case ModesE.Change:
      return <ChangeModeList films={films} setMode={setMode} />;
  }
}
