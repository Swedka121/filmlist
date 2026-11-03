"use server";

import { createUserListDAL, getUserListsDAL } from "@/dal/lists.dal";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export async function getUserLists() {
  return await getUserListsDAL();
}

export async function createUserList({
  name,
  image,
}: {
  name: string;
  image: FormData;
}) {
  const file = image.get("file") as unknown as File;

  if (!file) throw new Error("No image uploaded!");

  const fileName = randomUUID() + file.name.split(".").at(-1);
  const folderPath = join(process.cwd(), "/public/uploads");
  const filePath = join(folderPath, fileName);

  await mkdir(folderPath, { recursive: true });
  await writeFile(filePath, await file.bytes());

  const imageUrl = process.env.BASE_URL! + "/uploads/" + fileName;

  await createUserListDAL({ name, imageUrl });
  revalidatePath("/app/");
}
