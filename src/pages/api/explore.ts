import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1. Últimos posts
    const posts = await prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { username: true, avatarUrl: true },
        },
      },
    });

    // 2. Hashtags más usados
    const allPosts = await prisma.post.findMany({ select: { content: true } });

    const hashtagCounts: Record<string, number> = {};

    for (const post of allPosts) {
      const tags = (post.content.match(/#[\wáéíóúñ]+/gi) || []).map(t => t.toLowerCase());
      for (const tag of tags) {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
      }
    }

    const hashtags = Object.entries(hashtagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // 3. Sugerencias de usuarios
    const users = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        username: true,
        avatarUrl: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ posts, hashtags, users });
  } catch (error) {
    console.error("Error en /api/explore:", error);
    res.status(500).json({ error: "Error cargando explorar" });
  }
}
