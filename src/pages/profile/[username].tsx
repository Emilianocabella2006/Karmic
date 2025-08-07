// src/pages/profile/[username].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import ProfileEditForm from "@/components/ProfileEditForm";
import { parseText } from "@/utils/parseText";

interface UserData {
  id: number;
  username: string;
  avatarUrl?: string;
  createdAt: string;
  displayName?: string;
  location?: string;
  website?: string;
  bio?: string;
  posts?: {id: number, content: string, createdAt: string}[];
}

export default function UserProfile() {
  const router = useRouter();
  const { username } = router.query;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const loggedInUsername =
    typeof window !== "undefined" ? localStorage.getItem("username") : null;
  const loggedInUserId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const isOwnProfile = loggedInUsername === username;

  // Obtener perfil
  useEffect(() => {
    if (typeof username === "string") {
      fetch(`/api/profile/${username}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar perfil");
          return res.json();
        })
        .then((data) => {
          setUserData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
        });
    }
  }, [username]);

  // Verificar si está siguiendo
  useEffect(() => {
    if (userData?.id && loggedInUserId) {
      fetch(`/api/follow/status?followerId=${loggedInUserId}&followingId=${userData.id}`)
        .then((res) => res.json())
        .then((data) => setIsFollowing(data.isFollowing))
        .catch((err) => console.error("Error al verificar follow", err));
    }
  }, [userData?.id, loggedInUserId]);

  // Acción de seguir/dejar de seguir
  const handleFollowToggle = async () => {
    if (!loggedInUserId || !userData?.id) return;
    const res = await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        followerId: Number(loggedInUserId),
        followingId: userData.id,
      }),
    });

    if (res.ok) {
      setIsFollowing((prev) => !prev);
    } else {
      console.error("Error al seguir/dejar de seguir");
    }
  };

  if (loading) return <p className="p-6">Cargando perfil...</p>;
  if (!userData) return <p className="p-6">Usuario no encontrado</p>;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Encabezado */}
        <div className="flex items-center gap-4 mb-4">
          {userData.avatarUrl && (
            <img
              src={userData.avatarUrl}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border"
            />
          )}
          <div>
            <h1 className="text-xl font-semibold text-gray-800 mt-8 mb-4">@{userData.username}</h1>
            <p className="text-sm text-gray-500">
              Miembro desde {new Date(userData.createdAt).toLocaleDateString()}
            </p>

            {!isOwnProfile && (
              <button
                onClick={handleFollowToggle}
                className={`mt-2 px-4 py-1 text-sm rounded-full border ${
                  isFollowing
                    ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                    : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                }`}
              >
                {isFollowing ? "Dejar de seguir" : "Seguir"}
              </button>
            )}
          </div>
        </div>

        {/* Info del perfil */}
        {userData.displayName && (
          <p className="text-lg font-medium text-gray-800 mb-1">
            {userData.displayName}
          </p>
        )}
        {userData.location && (
          <p className="text-sm text-gray-600 mb-1">📍 {userData.location}</p>
        )}
        {userData.website && (
          <p className="text-sm text-blue-600 mb-4">
            🌐 <a href={userData.website} target="_blank" rel="noopener noreferrer">{userData.website}</a>
          </p>
        )}
        {userData.bio && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700">{userData.bio}</p>
          </div>
        )}

        {/* Edición de perfil si es propio */}
        {isOwnProfile && (
          // Arreglo de tipos: convierto el id a string para que coincida con el tipo esperado por ProfileEditForm
          <ProfileEditForm
            user={{ ...userData, id: String(userData.id) }}
            onUpdate={(updatedUser) => setUserData({ ...updatedUser, id: Number(updatedUser.id) })}
          />
        )}

        {/* Publicaciones */}
        <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
          Publicaciones
        </h2>
        {!userData.posts || userData.posts.length === 0 ? (
          <p className="text-gray-500 italic">Este usuario aún no publicó nada.</p>
        ) : (
          userData.posts.map((post: any) => (
            <div key={post.id} className="bg-white p-4 rounded shadow mb-4">
              <p className="text-gray-800">{parseText(post.content)}</p>
              <p className="text-sm text-gray-500 mt-2">
                Publicado el {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
