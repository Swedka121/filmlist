"use client";

import { Search } from "lucide-react";
import { cn } from "cn";

export function SearchBar() {
  return (
    <div
      className={cn(
        "flex h-8 flex-1 flex-row items-center gap-2 rounded-lg border-2 border-input bg-input pl-2",
        "focus-within:outline-2",
      )}
    >
      <Search className="h-4 w-4" aria-hidden="true" />

      <input
        className="h-10 flex-1 border-none bg-transparent text-sm outline-none"
        placeholder="Search for list..."
        aria-label="Search for list"
      />
    </div>
  );
}
