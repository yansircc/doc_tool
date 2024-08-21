export const replaceImageUrl = async (content: string) => {
  const regex = /!\[Image.*?\]\((.*?)\)/g;
  const imageUrls: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (match[1]) {
      imageUrls.push(match[1]);
    } else {
      console.log(`${match[0]} 没有匹配到图片地址`);
    }
  }
  // 异步处理所有图片地址替换
  const promises = imageUrls.map((url) => fetchNewImageUrl(url));
  const newUrls = await Promise.all(promises);
  imageUrls.forEach((url, index) => {
    content = content.replace(url, newUrls[index] ?? url);
  });
  return content;
};

async function fetchNewImageUrl(oldUrl: string): Promise<string> {
  const urlPattern = /^https:\/\/gptfiles\.imiker\.com\/doc_img\/.+/;
  if (urlPattern.test(oldUrl)) {
    return oldUrl;
  } else {
    const data = {
      img_url: oldUrl,
    };
    const res = await fetch("http://8.218.240.171:8000/v1/upload/doc_image", {
      method: "POST",
      headers: {
        Authorization: "Bearer api-xL2yG9kK0xQ4bD2nW0gB0oH5",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resData = (await res.json()) as { data: { url: string } };
    return resData.data.url;
  }
}
