import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { HTMLProps } from "@base-ui/react";

export function Container({
  children,
  className,
  ...props
}: PropsWithChildren & HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "h-max w-full max-w-[calc(100%-2rem)] mx-auto sm:max-w-[90%] lg:max-w-[80%]",
        className,
      )}
    >
      {children}
    </div>
  );
}
