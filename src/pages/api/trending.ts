// src/pages/api/trending.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const posts = await prisma.post.findMany({
      select: { content: true },
    });

    const hashtagCounts: Record<string, number> = {};

    for (const post of posts) {
      const hashtags = (post.content.match(/#[\wáéíóúñ]+/gi) || []).map(tag =>
        tag.toLowerCase()
      );

      for (const tag of hashtags) {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
      }
    }

    const trending = Object.entries(hashtagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    res.status(200).json(trending);
  } catch (error) {
    console.error("Error cargando hashtags:", error);
    res.status(500).json({ error: "Error al obtener tendencias" });
  } finally {
    await prisma.$disconnect();
  }
}

