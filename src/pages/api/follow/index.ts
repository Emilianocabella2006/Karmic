import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { followerId, followingId } = req.body;

  if (!followerId || !followingId || followerId === followingId) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  try {
    // Ver si ya existe la relación
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: Number(followerId),
          followingId: Number(followingId),
        },
      },
    });

    if (existing) {
      // Ya lo sigue → dejar de seguir
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: Number(followerId),
            followingId: Number(followingId),
          },
        },
      });
      return res.status(200).json({ followed: false });
    } else {
      // No lo sigue → empezar a seguir
      await prisma.follow.create({
        data: {
          followerId: Number(followerId),
          followingId: Number(followingId),
        },
      });
      return res.status(200).json({ followed: true });
    }
  } catch (error) {
    console.error("Error en follow:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
