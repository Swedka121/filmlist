import { Container } from "@/components/layouts/Container";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import { HeaderLogin } from "@/components/blocks/HeaderLogin";
import Image from "next/image";

export default async function Header({}) {
  return (
    <header className={"w-screen h-20"}>
      <Container className={"flex flex-row h-full items-center gap-10"}>
        <h1 className={"font-black text-xl font-bebas uppercase"}>FilmList</h1>
        <div className={"flex flex-row gap-4 text-sm"}>
          <Link href={"/"}>Home</Link>
          <Link href={"https://github.com/Swedka121/filmlist"}>
            Project on github
          </Link>
        </div>

        <div className={"flex flex-1 justify-end"}>
          <HeaderLogin />
        </div>
      </Container>
    </header>
  );
}
