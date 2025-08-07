import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const { postId, content } = req.body;

    if (!content || !postId) return res.status(400).json({ error: "Datos incompletos" });

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: id,
      },
      include: {
        author: true,
      },
    });

    res.status(200).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al comentar" });
  } finally {
    await prisma.$disconnect();
  }
}
