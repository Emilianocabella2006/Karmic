// src/components/Layout.tsx
import Link from "next/link";
const username = typeof window !== "undefined" ? localStorage.getItem("username") : "";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f7ff] flex">
      <aside className="w-64 p-6 border-r">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">Karmic</h1>
        <nav className="space-y-4 text-gray-900">
          <Link href="/feed" className="block hover:underline">Inicio</Link>
          <Link href="/explore" className="block hover:underline">Explorar</Link>
          <Link href="/notifications" className="block hover:underline">Notificaciones</Link>
            <li><Link href={`/profile/${username}`}>Perfil</Link></li>
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

