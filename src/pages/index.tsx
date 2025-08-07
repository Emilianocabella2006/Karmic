// pages/index.tsx
import Head from "next/head";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <title>Karmic - Red social con Karma</title>
      </Head>
    {/* NAVBAR SIMPLIFICADA */}
    <header className="w-full px-6 py-4 absolute top-0 left-0 z-10">
      <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600">Karmic</h1>
      </div>
    </header>
      <main className="bg-[#f5f7ff] text-gray-800">
        {/* HERO */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl font-bold mb-4">
                Bienvenido a <span className="text-blue-600">Karmic</span>
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                La red social moderna para compartir, expresarte y transmitir en vivo.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <a
                  href="/login"
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
                >
                  Iniciar sesión
                </a>
                <a
                  href="/register"
                  className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition"
                >
                  Registrarse
                </a>
              </div>
            </div>
            <div className="flex-1">
              <Image
                src="/landing_page.svg"
                alt="Ilustración Karmic"
                width={500}
                height={400}
                className="rounded-2xl shadow-lg mx-auto"
              />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-10">¿Por qué elegir Karmic?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-50 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-2">🔥 Karma en tiempo real</h3>
                <p className="text-gray-600">
                  Ganá o perdé karma según la reacción de la comunidad a tus aportes.
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-2">💬 Microblogging libre</h3>
                <p className="text-gray-600">
                  Publicá ideas, debates, memes o arte. Karmic no limita tu voz.
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-2">📡 Karmic Live</h3>
                <p className="text-gray-600">
                  Transmití en vivo y recibí karma por cada oyente e interacción.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* KARMA SYSTEM */}
        <section className="py-20 bg-gradient-to-r from-indigo-100 to-blue-100">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-6">Sistema de Karma</h2>
            <p className="text-lg text-gray-700 mb-6">
              Cada interacción en Karmic genera karma: desde un simple like hasta un stream exitoso.
              Vos controlás tu reputación. ¡Subí en el ranking y desbloqueá logros únicos!
            </p>
          </div>
        </section>

        {/* FOR CREATORS */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Creadores sin cadenas.</h2>
            <p className="text-lg text-gray-700 mb-6">
              ¿Hacés contenido? Karmic te da las herramientas para crecer con tu comunidad, transmitir en vivo y ganar visibilidad real.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6 mt-6">
              <div className="bg-blue-50 text-blue-900 p-6 rounded-xl shadow w-full md:w-1/3">
                🚀 Creador de tendencias
              </div>
              <div className="bg-blue-50 text-blue-900 p-6 rounded-xl shadow w-full md:w-1/3">
                💰 Monetización por Karma (próximamente)
              </div>
              <div className="bg-blue-50 text-blue-900 p-6 rounded-xl shadow w-full md:w-1/3">
                🧠 Comunidad con impacto
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 bg-blue-600 text-white text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Unite a Karmic hoy</h2>
            <p className="mb-6">
              Creá tu perfil, publicá tu primer Post y empezá a ganar karma. ¡Tu voz importa!
            </p>
            <a
              href="/register"
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Registrarse gratis
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gray-100 text-center text-gray-500 text-sm py-4">
          © {new Date().getFullYear()} Karmic. Todos los derechos reservados.
        </footer>
      </main>
    </>
  );
}
