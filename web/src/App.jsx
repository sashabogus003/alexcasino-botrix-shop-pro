import React from "react";
import Shop from "./components/Shop.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 blur-3xl opacity-60 bg-gradient-to-tr from-brand-300 via-accent-500 to-brand-600"></div>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white drop-shadow">
            Магазин за поинты
          </h1>
          <p className="mt-3 text-white/90 text-lg max-w-2xl">
            Зрители канала <b>alexcasino</b> на Kick могут проверять баланс и
            покупать награды. Покупка выполняется командой в чате.
          </p>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 -mt-10">
          <Shop />
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-gray-500">
        Сделано с ❤️ для <b>alexcasino</b>. Введите в чат Kick команду: <code>!shop buy "НазваниеТовара"</code>.
      </footer>
    </div>
  );
}
