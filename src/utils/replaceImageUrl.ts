export const  replaceImageUrl = async (content:string) => {
  const regex = /!\[Image.*?\]\((.*?)\)/g;
  let imageUrls = []
  let match
  while ((match = regex.exec(content)) !== null) {
    imageUrls.push(match[1])
  }
  // 异步处理所有图片地址替换
  const promises = imageUrls.map(url => fetchNewImageUrl(url as string))
  const newUrls = await Promise.all(promises);
  imageUrls.forEach((url, index) => {
    content = content.replace(url as string, newUrls[index] as string)
  })
  return content

}
function fetchNewImageUrl(oldUrl: string) {
  const urlPattern = /^https:\/\/gptfiles\.imiker\.com\/doc_img\/.+/
  return new Promise(async (resolve) => {
    if (urlPattern.test(oldUrl)) {
      resolve(oldUrl)
    } else {
      const data = {
        img_url: oldUrl
      }
     const res = await fetch('http://8.218.240.171:8000/v1/upload/doc_image', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer api-xL2yG9kK0xQ4bD2nW0gB0oH5',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const resData = await res.json()
      resolve(resData.data.url)
    }
  })
}