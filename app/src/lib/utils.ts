export { cn } from "cn";

export const giveFallbackAvatar = (str: string) => {
  return str
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
