import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("userId", data.userId);
      router.push("/feed");
    } else {
      alert(data.error || "Error al iniciar sesión");
    }
  };

  return (
    <>
      <Head>
        <title>Iniciar sesión | Karmic</title>
      </Head>
      <main className="min-h-screen flex items-center justify-center bg-[#f5f7ff] px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Iniciar sesión</h1>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-semibold text-gray-800">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Tu correo"
                className="w-full px-4 py-2 border rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-800">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Tu contraseña"
                className="w-full px-4 py-2 border rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Ingresar
            </button>
          </form>
          <p className="text-sm text-center mt-6">
            ¿No tenés una cuenta?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Registrate
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
