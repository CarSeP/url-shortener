export const shortUrlSchema = (t: any) => {
  return {
    body: t.Object({
      url: t.String(),
    }),
  };
};
