import express, { Request, Response } from "express";
import { prisma } from "../libs/prisma";
import { getID } from "../libs/idServices";

const router = express.Router();

router.get("/:id", async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  const urlShort = await prisma.shorteners.findUnique({ where: { id } });

  if (!urlShort) return res.status(404).json({ error: "Short url not found" });

  return res.redirect(302, urlShort.url);
});

router.post("/", async (req: Request, res: Response): Promise<any> => {
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

export default router;
