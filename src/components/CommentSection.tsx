import { useState, useEffect } from "react";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    username: string;
    id: number;
  };
  upvotes: number;
  downvotes: number;
}

export default function CommentSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments/${postId}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Debes iniciar sesión para comentar");

    try {
      const res = await fetch(`/api/comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        setNewComment("");
        await fetchComments();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Error al publicar comentario");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Error de conexión");
    }
  };

  const handleVote = async (commentId: number, type: "UP" | "DOWN") => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Inicia sesión para votar");

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId: commentId, type }),
      });

      if (res.ok) {
        fetchComments(); // Refresca los comentarios después de votar
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="ml-6 mt-3 border-t pt-3">
      <h4 className="text-sm font-bold text-gray-600 mb-2">Comentarios</h4>

      <ul className="mb-3 space-y-3">
        {comments.map((comment) => (
          <li key={comment.id} className="text-sm">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <span className="font-semibold text-blue-600">
                  @{comment.author.username}
                </span>{" "}
                <span className="text-gray-700">{comment.content}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleComment()}
          className="flex-1 p-2 border rounded text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Escribe un comentario..."
        />
        <button
          onClick={handleComment}
          disabled={!newComment.trim()}
          className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Comentar
        </button>
      </div>
    </div>
  );
}