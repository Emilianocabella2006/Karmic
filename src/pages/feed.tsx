import { useState, useEffect } from "react";
import Link from "next/link";
import { parseText } from "@/utils/parseText";
import CommentSection from "@/components/CommentSection";


export default function HomePage() {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [trendingTags, setTrendingTags] = useState<[string, number][]>([]); // ✅ Estado para tendencias
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);

  const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;

  const handlePost = async () => {
    const token = localStorage.getItem("token");
    if (!postContent.trim() || !token) return;

    const res = await fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: postContent }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Publicado con éxito");
      setPostContent("");
      loadPosts();
      loadTrending(); // 🔁 también refresca tendencias
    } else {
      alert(data.error || "Error al publicar");
    }
  };

  const loadPosts = async () => {
    const res = await fetch("/api/feed");
    const data = await res.json();
    setPosts(data.posts || []);
  };

  const loadTrending = async () => {
    const res = await fetch("/api/trending");
    const data = await res.json();
    setTrendingTags(data);
  };

const loadSuggestedUsers = async () => {
  const res = await fetch("/api/explore");
  const data = await res.json();
  setSuggestedUsers(data.users || []);
};


  useEffect(() => {
    loadPosts();
    loadTrending(); 
    loadSuggestedUsers(); 
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-64 p-6 border-r">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">Karmic</h1>
        <ul className="space-y-4 text-gray-900">
          <li><Link href="/feed">Inicio</Link></li>
          <li><Link href="/explore">Explorar</Link></li>
          <li><Link href="/notifications">Notificaciones</Link></li>
          <li><Link href={`/profile/${username}`}>Perfil</Link></li>
        </ul>
      </aside>

      <main className="flex-1 max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Inicio</h2>

        <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
          <textarea
            rows={3}
            className="w-full p-2 border rounded resize-none text-gray-800 placeholder-gray-500 focus:text-gray-900"
            placeholder="¿Qué estás pensando?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <div className="text-right mt-2">
            <button
              className="bg-blue-600 text-white font-bold px-4 py-2 rounded-full hover:bg-blue-700"
              onClick={handlePost}
            >
              Publicar
            </button>
          </div>
        </div>

        {posts.map((post) => (
          <div key={post.id} className="bg-gray-100 border p-4 rounded mb-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              {post.author.avatarUrl ? (
                <img
                  src={post.author.avatarUrl}
                  alt={`Avatar de ${post.author.username}`}
                  className="w-10 h-10 rounded-full object-cover border"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
              )}
              <Link
                href={`/profile/${post.author.username}`}
                className="font-semibold text-sm text-blue-600 hover:underline"
              >
                @{post.author.username}
              </Link>
            </div>

            <p className="text-gray-800">{parseText(post.content)}</p>
            <p className="text-sm text-gray-500 mt-2">
              Publicado el {new Date(post.createdAt).toLocaleString()}
            </p>
            <CommentSection postId={post.id} />

          </div>
        ))}
      </main>

      <aside className="w-80 p-6 bg-gray-50 border-l hidden md:block">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-400 mb-2">Tendencias</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            {trendingTags.length === 0 ? (
              <li className="text-gray-400 italic">Cargando...</li>
            ) : (
              trendingTags.map(([tag, count]) => (
                <li key={tag}>
                  <Link
                    href={`/hashtag/${tag.slice(1)}`}
                    className="hover:underline text-blue-600"
                  >
                    {tag}
                  </Link>{" "}
                  <span className="text-gray-400">({count})</span>
                </li>
              ))
            )}
          </ul>
        </div>

<div>
          <h3 className="text-sm font-bold text-gray-400 mb-2">A quién seguir</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            {suggestedUsers.length === 0 ? (
              <li className="text-gray-400 italic">Cargando...</li>
            ) : (
              suggestedUsers.map((user) => (
                <li key={user.id} className="flex justify-between">
                  <Link 
                    href={`/profile/${user.username}`} 
                    className="text-blue-600 hover:underline"
                  >
                    @{user.username}
                  </Link>
                  <button className="text-blue-600 hover:underline">Seguir</button>
                </li>
              ))
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
}