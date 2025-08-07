import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  let userId: number;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    userId = decoded.id;
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }

  const { content } = req.body;

  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "Contenido inválido" });
  }

  try {
    // Crear el post
    const post = await prisma.post.create({
      data: {
        content,
        author: { connect: { id: userId } },
      },
    });

    // Extraer hashtags
    const hashtags = content.match(/#\w+/g)?.map(tag => tag.slice(1).toLowerCase()) || [];

    for (const tag of hashtags) {
      const existingTag = await prisma.hashtag.upsert({
        where: { name: tag },
        update: {},
        create: { name: tag },
      });

      await prisma.post.update({
        where: { id: post.id },
        data: {
          hashtags: {
            connect: { id: existingTag.id },
          },
        },
      });
    }

    return res.status(201).json(post);
  } catch (error) {
    console.error("Error al crear post:", error);
    return res.status(500).json({ error: "Error al crear post" });
  } finally {
    await prisma.$disconnect();
  }
}
