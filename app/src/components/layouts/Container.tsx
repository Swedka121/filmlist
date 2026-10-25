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
      className={cn("h-max max-w-[80%] w-full mx-auto", className)}
    >
      {children}
    </div>
  );
}
