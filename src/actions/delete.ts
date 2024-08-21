"use server";

import { db } from "@/server/db";

export const deleteItemfromTable = async (id: number) => {
  const data = await db.tutorial.delete({
    where: {
      id: Number(id)
    }
  })
  if (!data) {
    throw new Error('Data not found')
  }
  return {
    title: data.title,
    url: data.url,
    content: data.content,
    images: data.images,
  };
}
