# alexcasino-botrix-shop (PRO UI)

Супер-аккуратный магазин за поинты (Botrix) с красивым UI на **Vite + React + Tailwind**, готов к деплою на **Vercel**.

## Содержимое
- **/api** — Vercel Serverless Functions: прокси к Botrix API (секреты не попадают во фронтенд).
- **/web** — фронтенд (Vite + React + Tailwind). Современный, адаптивный дизайн, тосты, скелетоны, копирование команд.

## Быстрый старт локально
```bash
# Установить vercel CLI (опционально, для локального теста функций)
npm i -g vercel

# Фронтенд
cd web
npm i
npm run dev

# Полный стек локально (статик+функции)
# из корня:
vercel dev
```

## Переменные окружения
Создайте `.env` в корне (или задайте на Vercel → Settings → Environment Variables):
```
CHANNEL=alexcasino
```

## Маршруты
- `GET /api/items` — товары из Botrix Shop API.
- `GET /api/user/:nickname` — поиск пользователя в Leaderboard.

> Покупка делается командой в чате Kick:
```
!shop buy "НазваниеТовара"
```

## Деплой на Vercel
1. Импортируйте репозиторий.
2. Добавьте переменную окружения `CHANNEL`.
3. Нажмите Deploy. `vercel.json` уже настроен (web → static-build, api → serverless).

## Лицензия
MIT
