import express, { Request, Response } from "express";
import { prisma } from "./prisma";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/:id", async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  const urlShort = await prisma.shorteners.findUnique({ where: { id } });

  if (!urlShort) return res.status(404).json({ error: "Short url not found" });

  return res.redirect(302, urlShort.url);
});

app.post("/", async (req: Request, res: Response): Promise<any> => {
  const { id, url } = req.body;

  if (!id || !url) res.status(400).json({ Error: "ID or URL not provided" });

  const data = { id, url };
  const urlShort = await prisma.shorteners.create({ data }).catch(() => {
    return res.status(500).json({ Error: "An error occurred while creating the short url" });
  });

  return res.json(urlShort);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
