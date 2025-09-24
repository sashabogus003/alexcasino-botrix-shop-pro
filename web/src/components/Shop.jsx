import React, { useEffect, useMemo, useState } from "react";
import Toast from "./ui/Toast.jsx";

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  );
}

function formatNumber(n) {
  if (typeof n !== "number") return n;
  return new Intl.NumberFormat("ru-RU").format(n);
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 shadow-sm">
      <div className="h-6 w-2/3 bg-gray-700 rounded mb-2 animate-pulse"></div>
      <div className="h-4 w-1/2 bg-gray-700 rounded mb-4 animate-pulse"></div>
      <div className="h-8 w-32 bg-gray-700 rounded animate-pulse"></div>
    </div>
  );
}

export default function Shop() {
  const [nickname, setNickname] = useState("");
  const [loadingUser, setLoadingUser] = useState(false);
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [copied, setCopied] = useState(false);

  const pushToast = (title, description) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, title, description }]);
  };
  const closeToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const userPoints = useMemo(() => {
    if (!user) return null;
    if (Array.isArray(user?.data) && user.data[0]?.points != null) return user.data[0].points;
    if (Array.isArray(user) && user[0]?.points != null) return user[0].points;
    const flat = JSON.stringify(user);
    const match = flat.match(/"points"\s*:\s*(\d+)/);
    return match ? Number(match[1]) : null;
  }, [user]);

  const userNameDetected = useMemo(() => {
    if (!user) return null;
    if (Array.isArray(user?.data) && (user.data[0]?.name || user.data[0]?.username)) return user.data[0].name || user.data[0].username;
    if (Array.isArray(user) && (user[0]?.name || user[0]?.username)) return user[0].name || user[0].username;
    return nickname || null;
  }, [user, nickname]);

  const fetchUser = async () => {
    const v = nickname.trim();
    if (!v) return;
    setLoadingUser(true);
    setError(null);
    setUser(null);
    try {
      const resp = await fetch(`/api/user/${encodeURIComponent(v)}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setUser(data);
    } catch (e) {
      setError("Не удалось получить пользователя");
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchItems = async () => {
    setLoadingItems(true);
    setError(null);
    try {
      const resp = await fetch(`/api/items`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const arr = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      setItems(arr);
    } catch (e) {
      setError("Не удалось загрузить товары");
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const onEnter = (e) => { if (e.key === "Enter") fetchUser(); };

  return (
    <>
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} id={t.id} title={t.title} description={t.description} onClose={closeToast} />
        ))}
      </div>

      <div className="bg-gray-900/70 backdrop-blur rounded-3xl shadow-xl p-6 border border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <label className="text-sm text-gray-300">Ник на Kick</label>
            <input
              type="text"
              placeholder="например, alexcasino_fan"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={onEnter}
              className="mt-1 w-full rounded-xl border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <button
            onClick={fetchUser}
            disabled={!nickname || loadingUser}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 text-gray-100 px-5 py-3 font-semibold shadow hover:brightness-110 transition disabled:opacity-50"
          >
            {loadingUser ? <Spinner /> : null}
            {loadingUser ? "Загружаем…" : "Проверить баланс"}
          </button>
        </div>

        {user && (
          <div className="mt-5 grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
              <div className="text-sm text-gray-400">Пользователь</div>
              <div className="text-lg font-bold">{userNameDetected || nickname}</div>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
              <div className="text-sm text-gray-400">Баланс</div>
              <div className="text-lg font-bold">{userPoints != null ? formatNumber(userPoints) : "—"} поинтов</div>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
              <div className="text-sm text-gray-400">Инструкция</div>
              <div className="text-sm">Покупайте через чат командой <code>!shop buy "Название"</code></div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">🛍️ Товары</h2>
            <button
              onClick={fetchItems}
              className="text-sm text-brand-700 hover:text-brand-900 underline underline-offset-2"
              title="Обновить список"
            >
              Обновить
            </button>
          </div>

          {loadingItems ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => {
                const title = item.name ?? item.title ?? item.label ?? "Товар";
                const price = item.price ?? item.cost ?? item.points ?? 0;
                const desc = item.description ?? item.desc ?? "";
                return (
                  <div key={item.id ?? title} className="group rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-bold">{title}</div>
                        <div className="text-sm text-gray-300 mt-1 line-clamp-3">{desc}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-400">{(item.stock === -1 || item.stock === "-1") ? "Без лимита" : `Остаток: ${item.stock ?? 0}`}</div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-400">Цена</div>
                      <div className="text-lg font-extrabold text-brand-700">{formatNumber(Number(price))}</div>
                    </div>
                    <button
                      onClick={() => setSelectedItem(title)}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 text-gray-100 px-4 py-2.5 font-semibold shadow hover:brightness-110 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16h8M8 12h8m-6 8h6a2 2 0 002-2V6a2 2 0 00-2-2h-6m-2 14H6a2 2 0 01-2-2V8m6-4H8a2 2 0 00-2 2v2" />
                      </svg>
                      Купить через чат
                    </button>
                  </div>
                );
              })}
              {items.length === 0 && (
                <div className="text-sm text-gray-400">Товары пока не найдены.</div>
              )}
            </div>
          )}
        
      {/* Modal for buy command */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold text-gray-100">Напишите данное сообщение в чат Kick</h3>
              <button className="text-gray-400 hover:text-gray-200" onClick={() => setSelectedItem(null)} aria-label="Закрыть">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4 rounded-xl bg-gray-800 p-4 font-mono text-green-400">
              {!selectedItem ? null : `!shop buy "${selectedItem}"`}
            </div>
            <div className="mt-4 flex gap-3">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2 font-semibold text-gray-100 hover:brightness-110"
                onClick={async () => {
                  const cmd = `!shop buy "${selectedItem}"`;
                  try {
                    await navigator.clipboard.writeText(cmd);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  } catch {}
                }}
              >
                Скопировать
              </button>
              <button
                className="rounded-xl border border-gray-700 px-4 py-2 text-gray-200 hover:bg-gray-800"
                onClick={() => setSelectedItem(null)}
              >
                Закрыть
              </button>
              {copied && <span className="self-center text-sm text-green-400">Скопировано!</span>}
            </div>
          </div>
        </div>
      )}

    </div>
      </div>
    </>
  );
}
