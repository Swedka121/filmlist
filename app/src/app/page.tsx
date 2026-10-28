import { HomeScene } from "@/components/scenes/HomeScene";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="w-full h-250 grid grid-cols-[1fr_3fr] grid-rows-1 relative">
      <div className="h-full flex justify-center flex-col gap-2">
        <h1 className="text-9xl font-bebas font-bold uppercase">Filmlist</h1>
        <p>- your place to keep your watch streak tracked</p>
        <div className="flex flex-row gap-4 items-center mt-10">
          <Link href={"/app"}>
            <Button className={"w-max"} size={"lg"}>
              Go to Dashboard
            </Button>
          </Link>
          <Link href={"https://github.com/Swedka121/filmlist"}>
            <Button size={"lg"} variant={"secondary"}>
              Star project on Github
            </Button>
          </Link>
        </div>
      </div>
      <div className="w-full h-full"></div>
      <div className="absolute -top-20 left-100 w-full h-full -z-10">
        <HomeScene />
      </div>
    </section>
  );
}
