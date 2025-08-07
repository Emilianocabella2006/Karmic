// POST /api/notifications/create
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, fromUserId, postId, type } = req.body;

  if (!userId || !fromUserId || !type) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        fromUserId,
        postId,
        type
      },
    });

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error al crear notificación:", error);
    res.status(500).json({ error: "Error al crear la notificación" });
  }
}
