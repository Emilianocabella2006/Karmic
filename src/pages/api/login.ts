import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Método no permitido");

  const { email, password } = req.body;
console.log("EMAIL:", email, "PASSWORD:", password); // <-- Agrega esto para verificar


  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Credenciales inválidas" });

 const token = sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

 res.status(200).json({
  token,
  username: user.username,
  userId: user.id,
});
}
