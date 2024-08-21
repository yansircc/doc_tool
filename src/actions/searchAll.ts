"use server";

import { db } from "@/server/db";

export const searchAll = async () => {
  const data = await db.tutorial.findMany();
  if (!data) {
    throw new Error('Data not found')
  }
  return data
}
