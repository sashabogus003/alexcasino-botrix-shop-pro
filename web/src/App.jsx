import React from "react";
import Shop from "./components/Shop.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-3xl opacity-30"
               style={{background: 'radial-gradient(circle at center, rgba(34,197,94,0.35), transparent 60%)'}} />
        </div>
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-10 sm:py-14">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white drop-shadow">
            Магазин за поинты
          </h1>
          <p className="mt-3 text-gray-300 text-base sm:text-lg max-w-2xl">
            Зрители канала <b>alexcasino</b> на Kick могут проверять баланс и покупать награды.
            Покупка выполняется командой в чате.
          </p>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-10">
          <Shop />
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-gray-500">
        Сделано с ❤️ для <b>alexcasino</b>. Введите в чат Kick команду: <code>!shop buy code @telegram</code>.
      </footer>
    </div>
  );
}
