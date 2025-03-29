import express, { Request, Response } from "express";
import { prisma } from "./prisma";
import { getID } from "./generateID";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/api/:id", async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  const urlShort = await prisma.shorteners.findUnique({ where: { id } });

  if (!urlShort) return res.status(404).json({ error: "Short url not found" });

  return res.redirect(302, urlShort.url);
});

app.post("/api", async (req: Request, res: Response): Promise<any> => {
  const { id, url } = req.body;

  if (!url) return res.status(400).json({ Error: "URL not provided" });

  const data = { id: id ? id : getID(), url };
  const urlShort = await prisma.shorteners.create({ data }).catch(() => {
    return res
      .status(500)
      .json({ Error: "An error occurred while creating the short url" });
  });

  return res.json(urlShort);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
