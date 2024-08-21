export function isValidURL(url:string) {
  const regex = /^(https?:\/\/)?(([a-zA-Z0-9$_.+!*'(),;:&=-]+)@)?((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(\[[0-9a-fA-F:]+\]))(:\d+)?(\/[-a-zA-Z0-9$_.+!*'(),;:@&=%]*)*(\?[-a-zA-Z0-9$_.+!*'(),;:@&=%]*)?(#[a-zA-Z0-9$_.+!*'(),;:@&=%]*)?$/;
  return regex.test(url);
}