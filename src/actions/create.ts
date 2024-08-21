"use server";

import { db } from "@/server/db";
import { replaceImageUrl } from '@/utils/replaceImageUrl';
type ImageDictionary = Record<string, string>;
type mdResData = {
  code: number;
  status: number;
  data: {
    title: string;
    url: string;
    content: string;
    images: ImageDictionary;
  }
}
export const fetchMDfromJina = async (tutorialUrl: string) => {
  const res = await fetch(`https://r.jina.ai/${tutorialUrl}`, {
    method: 'GET',
    headers: {
      "X-With-Images-Summary": "true",
      "Accept": "application/json"
    },
  })
  const { data } = await res.json() as mdResData;
  //****此段代码为处理格式不同的数据，既过滤掉created on之前的数据 */
  const targetString = 'Created on'
  const index = data.content.indexOf(targetString)
  if (index !== -1) {
    data.content = data.content.substring(index);
  }
  //***************************************************** */
  const newResData = await replaceImageUrl(data.content)
  await db.tutorial.create({
    data: {
      title: data.title,
      url: data.url,
      content: newResData,
      images: JSON.stringify(data.images)
    }
  })
}
