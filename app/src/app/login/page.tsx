import { HeaderLogin } from "@/components/blocks/HeaderLogin";
import { Spinner } from "@/components/ui/spinner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";

function Loader() {
  return (
    <section className="w-screen h-screen bg-background absolute left-0 top-0 z-20 flex justify-center items-center">
      <Spinner />
    </section>
  );
}

async function LoginButton({ searchParams }: PageProps<"/login">) {
  const callbackUrl: string =
    ((await searchParams).callbackUrl as string) || process.env.BASE_URL!;
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) return redirect(callbackUrl);

  return <HeaderLogin callbackUrl={callbackUrl} />;
}

export default async function Page(props: PageProps<"/login">) {
  return (
    <Suspense fallback={<Loader />}>
      <section className="w-screen h-screen bg-background absolute left-0 top-0 z-20 flex justify-center items-center">
        <div className="w-max h-max grid grid-cols-2 grid-rows-1 gap-20">
          <div className="flex flex-col gap-10 justify-center">
            <div className="flex flex-col">
              <h1 className="text-4xl font-bebas font-bold uppercase">
                Welcome to the, <span className="text-6xl">FilmList</span>
              </h1>
              <p className="font-medium text-xs">Login to continue</p>
            </div>
            <LoginButton {...props} />
          </div>
          <div>
            <Image
              src={"/loginPageImage.jpg"}
              alt="image"
              width={832}
              height={1248}
              className="w-100"
              quality={75}
              loading="eager"
            />
          </div>
        </div>
      </section>
    </Suspense>
  );
}
