// src/pages/api/update.ts
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

  const { bio, location, displayName, website, avatarUrl } = req.body;

  if (!displayName && !bio && !location && !website && !avatarUrl) { // 
    return res.status(400).json({ error: "Nada para actualizar" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        bio: bio ?? undefined,
        location: location ?? undefined,
        displayName: displayName ?? undefined,
        avatarUrl: avatarUrl ?? undefined,
        website: website ?? undefined,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error al actualizar perfil:", err);
    return res.status(500).json({ error: "Error al actualizar perfil" });
  } finally {
    await prisma.$disconnect();
  }
}
