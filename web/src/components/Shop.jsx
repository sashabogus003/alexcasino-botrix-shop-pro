
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
    <div className="card p-4">
      <div className="h-48 w-full bg-gray-800 rounded mb-3 animate-pulse"></div>
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
  const [step, setStep] = useState(1);
  const [telegram, setTelegram] = useState("");
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
    const match = flat.match(/\"points\"\s*:\s*(\d+)/);
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

  const getCommand = () => {
    if (!selectedItem) return "";
    const code = selectedItem.code || selectedItem.name || "item";
    return `!shop buy ${code}${telegram ? " " + telegram : ""}`;
  };

  return (
    <>
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} id={t.id} title={t.title} description={t.description} onClose={closeToast} />
        ))}
      </div>

      <div className="card p-6">
        {/* Баланс/поиск */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <label className="text-sm text-gray-300">Ник на Kick</label>
            <input
              type="text"
              placeholder="например, alexcasino_fan"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={onEnter}
              className="input mt-1"
            />
          </div>
          <button
            onClick={fetchUser}
            disabled={!nickname || loadingUser}
            className={`btn ${(!nickname || loadingUser) ? "btn-disabled" : "btn-primary"}`}
          >
            {loadingUser ? <Spinner /> : null}
            {loadingUser ? "Загружаем…" : "Проверить баланс"}
          </button>
        </div>

        {user && (
          <div className="mt-5 grid sm:grid-cols-3 gap-4">
            <div className="card p-4">
              <div className="text-sm text-gray-400">Пользователь</div>
              <div className="text-lg font-bold">{userNameDetected || nickname}</div>
            </div>
            <div className="card p-4">
              <div className="text-sm text-gray-400">Баланс</div>
              <div className="text-lg font-bold text-gradient-green">{userPoints != null ? formatNumber(userPoints) : "—"} поинтов</div>
            </div>
            <div className="card p-4">
              <div className="text-sm text-gray-400">Инструкция</div>
              <div className="text-sm">Выберите товар который есть в наличии, далее укажите свой ТГ логин(начинается с @) Вставьте комманду которая будет показына в чат kick</div>
            </div>
          </div>
        )}

        {/* Товары */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold glow">🛍️ Товары</h2>
            <button
              onClick={fetchItems}
              className="text-sm text-brand-700 hover:text-brand-800 underline underline-offset-2"
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
            <div className="text-sm text-red-500">{error}</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => {
                const title = item.name ?? item.title ?? item.label ?? "Товар";
                const price = item.price ?? item.cost ?? item.points ?? 0;
                const desc = item.description ?? item.desc ?? "";
                const code = item.code ?? title;
                const out = item.stock === 0;
                const unlimited = (item.stock === -1 || item.stock === "-1");

                return (
                  <div key={item.id ?? title} className={`card p-5 card-hover ${out ? "opacity-70" : ""} flex flex-col`}>
                    {/* Картинка */}
                    {item.image ? (
                      <img src={item.image} alt={title} className="w-full h-48 object-contain rounded-xl bg-gray-800 mb-3" />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center rounded-xl bg-gray-800 text-gray-500 mb-3">
                        Нет изображения
                      </div>
                    )}

                    {/* Описание */}
                    <div className="flex-1 flex flex-col">
                      <div>
                        <div className="text-lg font-bold text-white">{title}</div>
                        <div className="text-sm text-gray-300 mt-1 line-clamp-3">{desc}</div>
                      </div>

                      {/* Наличие */}
                      <div className="mt-2 text-sm font-bold">
                        {unlimited ? (
                          <span className="badge badge-green">Без лимита</span>
                        ) : out ? (
                          <span className="badge badge-red">Нет в наличии</span>
                        ) : (
                          <span className="badge badge-green">Остаток: {item.stock}</span>
                        )}
                      </div>

                      {/* Цена */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-400">Цена</div>
                        <div className="text-lg font-extrabold text-gradient-green">{formatNumber(Number(price))}</div>
                      </div>

                      {/* Кнопка купить */}
                      <button
                        onClick={() => {
                          if (out) {
                            pushToast("❌ Товара нет в наличии", `Товар "${title}" закончился.`);
                            return;
                          }
                          setSelectedItem({ title, code });
                          setStep(1);
                          setTelegram("");
                        }}
                        disabled={out}
                        className={`btn mt-4 w-full ${out ? "btn-disabled" : "btn-primary"}`}
                      >
                        Купить
                      </button>
                    </div>
                  </div>
                );
              })}
              {items.length === 0 && (
                <div className="text-sm text-gray-400">Товары пока не найдены.</div>
              )}
            </div>
          )}

          {/* Step 1: ввод Telegram */}
          {selectedItem && step === 1 && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div className="w-full max-w-lg card p-6">
                <h3 className="text-xl font-bold text-gray-100">Укажите свой Telegram для связи</h3>
                <input
                  type="text"
                  placeholder="@username"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  className="input mt-4"
                />
                <div className="mt-4 flex gap-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (!telegram.trim()) {
                        pushToast("Введите Telegram", "Чтобы продолжить, укажите свой Telegram.");
                        return;
                      }
                      setStep(2);
                    }}
                  >
                    Далее
                  </button>
                  <button className="btn btn-disabled" onClick={() => setSelectedItem(null)}>Отмена</button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: готовая команда */}
          {selectedItem && step === 2 && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div className="w-full max-w-lg card p-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-gray-100">Вставьте эту команду в чат Kick</h3>
                  <button className="text-gray-400 hover:text-gray-200" onClick={() => setSelectedItem(null)} aria-label="Закрыть">✕</button>
                </div>
                <div className="mt-4 rounded-xl bg-gray-800 p-4 font-mono text-green-400">
                  {!selectedItem ? null : `!shop buy ${selectedItem.code}${telegram ? " " + telegram : ""}`}
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    className="btn btn-primary"
                    onClick={async () => {
                      try { await navigator.clipboard.writeText(`!shop buy ${selectedItem.code}${telegram ? " " + telegram : ""}`); setCopied(true); setTimeout(()=>setCopied(false),1500); } catch {}
                    }}
                  >
                    Скопировать
                  </button>
                  <button className="btn btn-disabled" onClick={() => setSelectedItem(null)}>Закрыть</button>
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
