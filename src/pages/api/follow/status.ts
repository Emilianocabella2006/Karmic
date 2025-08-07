import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { followerId, followingId } = req.query;

  if (!followerId || !followingId) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }

  try {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: Number(followerId),
          followingId: Number(followingId),
        },
      },
    });

    res.status(200).json({ isFollowing: !!follow });
  } catch (error) {
    console.error("Error al verificar seguimiento:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
