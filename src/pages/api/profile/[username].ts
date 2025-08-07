// src/pages/api/profile/[username].ts
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.query;

  if (typeof username !== "string") {
    return res.status(400).json({ error: "Username inválido" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { posts: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Contar seguidores y seguidos
    const followersCount = await prisma.follow.count({
      where: { followingId: user.id },
    });
    const followingCount = await prisma.follow.count({
      where: { followerId: user.id },
    });

    return res.status(200).json({
      ...user,
      followersCount,
      followingCount,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message || "Error interno" });
  }
}