import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Método no permitido");

  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ error: "Falta token" });

  try {
    const token = authorization.split(" ")[1];
    const decoded = verify(token, SECRET) as { userId: number };

    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Contenido vacío" });

    const post = await prisma.post.create({
      data: {
        content,
        authorId: decoded.userId,
      },
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
}
