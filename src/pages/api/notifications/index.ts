// GET /api/notifications
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId || isNaN(Number(userId))) return res.status(400).json({ error: "Falta userId válido" });

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: Number(userId) },
      include: {
        fromUser: true,
        post: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({ error: "Error al obtener notificaciones" });
  }
}
