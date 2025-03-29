export const getID = (length: number = 7): string => {
  const alphanumericChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";

  for (let i = 0; i < length; i++) {
    const random = Math.floor(Math.random() * alphanumericChars.length);
    id += alphanumericChars[random];
  }

  return id;
};
