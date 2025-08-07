// pages/hashtag/[tag].tsx
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";

type Post = {
  id: number;
  content: string;
  createdAt: string;
  author: {
    username: string;
    avatarUrl: string | null;
  };
};

export default function HashtagPage() {
  const router = useRouter();
  const { tag } = router.query;

  const [posts, setPosts] = useState<Post[]>([]);
  const [username, setUsername] = useState("usuario"); // puedes reemplazarlo por el usuario real si tienes auth
  const [trendingTags, setTrendingTags] = useState<[string, number][]>([]);

  useEffect(() => {
    if (tag) {
      fetch(`/api/hashtag/${tag}`)
        .then((res) => res.json())
        .then((data) => setPosts(data));
    }
  }, [tag]);

useEffect(() => {
  fetch("/api/trending")
    .then((res) => res.json())
    .then((data) => setTrendingTags(data))
    .catch((err) => console.error("Error cargando tendencias:", err));
}, []);

  const parseText = (text: string) => {
    return text
      .split(" ")
      .map((word, i) => {
        if (word.startsWith("#")) {
          const clean = word.slice(1);
          return (
            <Link
              key={i}
              href={`/hashtag/${clean}`}
              className="text-blue-500 hover:underline"
            >
              {word}{" "}
            </Link>
          );
        } else if (word.startsWith("@")) {
          const clean = word.slice(1);
          return (
            <Link
              key={i}
              href={`/profile/${clean}`}
              className="text-blue-500 hover:underline"
            >
              {word}{" "}
            </Link>
          );
        } else {
          return word + " ";
        }
      });
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 p-6 border-r">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">Karmic</h1>
        <ul className="space-y-4 text-gray-900">
          <li><Link href="/feed">Inicio</Link></li>
          <li><Link href="/explore">Explorar</Link></li>
          <li><Link href="/notifications">Notificaciones</Link></li>
          <li><Link href={`/profile/${username}`}>Perfil</Link></li>
        </ul>
      </aside>

      {/* Main */}
      <main className="flex-1 max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
        #{tag}
        </h2>

        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-100 border p-4 rounded mb-4 shadow-sm"
          >
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
          </div>
        ))}
      </main>

      {/* Aside derecho */}
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
            <li className="flex justify-between">
              @Elon Moskito <a href="#" className="text-blue-600 hover:underline">Seguir</a>
            </li>
            <li className="flex justify-between">
              @CabelgamesVT <a href="#" className="text-blue-600 hover:underline">Seguir</a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

