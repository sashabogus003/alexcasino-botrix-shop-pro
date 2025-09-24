
import React from "react";
import Shop from "./components/Shop.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-10 sm:pt-14 pb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white glow">
            Магазин за поинты
          </h1>
          <p className="mt-3 text-gray-300 text-base sm:text-lg max-w-2xl">
            Зрители канала <b>alexcasino</b> на Kick могут проверять баланс и покупать награды.
            Покупка выполняется командой в чате.
          </p>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Shop />
        </div>
      </main>

      <footer className="py-10 text-center text-sm text-gray-500">
        Сделано с ❤️ для <b>alexcasino</b>. Введите в чат Kick команду: <code>!shop buy code @telegram</code>.
      </footer>
    </div>
  );
}
