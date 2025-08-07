// pages/explore.tsx
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ExplorePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [hashtags, setHashtags] = useState<[string, number][]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/explore")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setHashtags(data.hashtags);
        setSuggestedUsers(data.users);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-64 p-6 border-r">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">Karmic</h1>
        <ul className="space-y-4 text-gray-900">
          <li><Link href="/feed">Inicio</Link></li>
          <li><Link href="/explore">Explorar</Link></li>
          <li><Link href="/notifications">Notificaciones</Link></li>
        </ul>
      </aside>

      <main className="flex-1 max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Explorar</h2>

        <section className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Tendencias</h3>
          <ul className="text-sm space-y-1">
            {hashtags.map(([tag, count]) => (
              <li key={tag}>
                <Link href={`/hashtag/${tag.slice(1)}`} className="text-blue-600 hover:underline">
                  {tag}
                </Link> ({count})
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Publicaciones recientes</h3>
          {posts.map((post) => (
            <div key={post.id} className="bg-gray-100 p-4 rounded mb-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Link href={`/profile/${post.author.username}`} className="text-blue-600 font-semibold hover:underline">
                  @{post.author.username}
                </Link>
              </div>
              <p className="text-gray-800">{post.content}</p>
              <p className="text-sm text-gray-500 mt-1">
                Publicado el {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">A quién seguir</h3>
          <ul className="text-sm space-y-2">
            {suggestedUsers.map((user) => (
              <li key={user.id} className="flex justify-between">
                <Link href={`/profile/${user.username}`} className="text-blue-600 font-semibold hover:underline">
                  @{user.username}
                </Link>
                <button className="text-blue-600 hover:underline">Seguir</button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
