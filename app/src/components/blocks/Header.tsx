import { Container } from "@/components/layouts/Container";
import Link from "next/link";

interface HeaderProps {}

export default async function Header({}: HeaderProps) {
  return (
    <header className={"w-screen h-16 bg-secondary"}>
      <Container className={"flex flex-row h-full items-center gap-10"}>
        <h1 className={"font-black text-xl font-bebas uppercase"}>FilmList</h1>
        <div className={"flex flex-row gap-4 text-sm"}>
          <Link href={"/"}>Home</Link>
          <Link href={"https://github.com/Swedka121"}>Project on github</Link>
        </div>
      </Container>
    </header>
  );
}
