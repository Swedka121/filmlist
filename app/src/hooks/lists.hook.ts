"use client";

import { createUserList } from "@/actions/lists.actions";
import { useMutation } from "@tanstack/react-query";

export function useCreateList() {
  return useMutation({
    mutationFn: async ({ name, image }: { name: string; image: File }) => {
      const formData = new FormData();
      formData.set("file", image);
      await createUserList({ name, image: formData });
    },
  });
}
