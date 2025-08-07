// pages/api/hashtag/[tag].ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tag = req.query.tag as string;

  if (!tag) {
    return res.status(400).json({ error: "Hashtag no especificado" });
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        content: {
          contains: `#${tag}`,
        },
      },
      include: {
        author: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error al buscar posts por hashtag:", error);
    res.status(500).json({ error: "Error al buscar posts" });
  } finally {
    // asegurate de que este await esté DENTRO de una función async (como aquí)
    await prisma.$disconnect();
  }
}
