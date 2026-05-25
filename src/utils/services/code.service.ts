export const getCode = () => {
  const characters =
    "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
  let code = "";

  for (let i = 0; i < 7; i++) {
    const random = Math.floor(Math.random() * characters.length);
    code += characters[random];
  }

  return code;
};
