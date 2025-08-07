// pages/api/comments/[postId].ts
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { postId, PostId } = req.query;
  const actualPostId = postId || PostId;

  if (req.method === "POST") {
    console.log("POST request body:", req.body);
    console.log("POST request headers:", req.headers.authorization);
    
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token requerido" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      console.log("Decoded JWT:", decoded);
      const { id } = decoded as { id: number };

      const { content } = req.body;
      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Comentario inválido" });
      }

      console.log("actualPostId from query:", actualPostId, "type:", typeof actualPostId);
      
      let parsedPostId;
      if (Array.isArray(actualPostId)) {
        parsedPostId = parseInt(actualPostId[0]);
      } else {
        parsedPostId = parseInt(actualPostId as string);
      }
      
      console.log("parsedPostId:", parsedPostId);
      
      if (isNaN(parsedPostId)) {
        return res.status(400).json({ error: "ID de post inválido" });
      }

      const newComment = await prisma.comment.create({
        data: {
          content,
          postId: parsedPostId,
          authorId: id,
        },
        include: {
          author: {
            select: {
              username: true,
            },
          },
        },
      });

      // Crear notificación para el autor del post (si no es el mismo que comenta)
      const post = await prisma.post.findUnique({
        where: { id: parsedPostId },
        select: { authorId: true },
      });
      if (post && post.authorId !== id) {
        await prisma.notification.create({
          data: {
            userId: post.authorId,
            fromUserId: id,
            postId: parsedPostId,
            type: "comment",
          },
        });
      }

      return res.status(200).json(newComment);
    } catch (err) {
      console.error("Error al comentar (POST):", err);
      return res.status(500).json({ error: "Error al procesar el comentario" });
    }
  } else if (req.method === "GET") {
    try {
      console.log("GET request - actualPostId:", actualPostId, "type:", typeof actualPostId);
      
      const parsedPostId = parseInt(actualPostId as string);
      console.log("Parsed postId:", parsedPostId);
      
      const comments = await prisma.comment.findMany({
        where: {
          postId: parsedPostId,
        },
        include: {
          author: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      console.log("Found comments:", comments.length);
      return res.status(200).json({ comments });
    } catch (error) {
      console.error("Error al obtener comentarios (GET):", error);
      return res.status(500).json({ error: "Error al obtener comentarios" });
    }
  } else {
    return res.status(405).end("Method Not Allowed");
  }
}