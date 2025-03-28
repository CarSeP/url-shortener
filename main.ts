import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
