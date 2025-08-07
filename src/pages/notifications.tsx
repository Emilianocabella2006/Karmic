// pages/notifications.tsx
import { useEffect, useState } from "react";
import Link from "next/link";

type Notification = {
  id: number;
  type: "comment" | "mention"; // extensible para "like", "follow", etc.
  createdAt: string;
  fromUser: {
    username: string;
  };
  post?: {
    id: number;
  };
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [username, setUsername] = useState("");

useEffect(() => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("username");
  const storedUserId = localStorage.getItem("userId");

  setUsername(storedUser || "");

  if (token && storedUserId) {
    fetch(`/api/notifications?userId=${storedUserId}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data.notifications || []))
      .catch((err) => console.error("Error cargando notificaciones", err));
  }
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Notificaciones</h2>

        {notifications.length === 0 ? (
          <p className="text-gray-500">No tienes notificaciones aún.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((n) => (
              <li key={n.id} className="bg-gray-100 p-4 rounded shadow-sm">
                <p className="text-sm text-gray-800">
                  {n.type === "comment" && (
                    <>
                      <Link href={`/profile/${n.fromUser.username}`} className="text-blue-600 font-semibold hover:underline">
                        @{n.fromUser.username}
                      </Link>{" "}
                      comentó en tu{" "}
                      {n.post && (
                        <Link href={`/post/${n.post.id}`} className="text-blue-600 hover:underline">
                          publicación
                        </Link>
                      )}
                      .
                    </>
                  )}

                  {n.type === "mention" && (
                    <>
                      <Link href={`/profile/${n.fromUser.username}`} className="text-blue-600 font-semibold hover:underline">
                        @{n.fromUser.username}
                      </Link>{" "}
                      te mencionó en un{" "}
                      {n.post && (
                        <Link href={`/post/${n.post.id}`} className="text-blue-600 hover:underline">
                          post
                        </Link>
                      )}
                      .
                    </>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
