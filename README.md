# VK Callback Bot

Минимальный бот для VK Callback API.

## Что внутри
- `index.js` — сервер и обработчик Callback API
- `package.json` — зависимости и команда запуска
- `.env.example` — пример переменных окружения

## Команды бота
- `привет`
- `помощь`
- `id`

## Локальный запуск
```bash
npm install
npm start
```

## Переменные окружения
- `VK_GROUP_TOKEN` — токен сообщества
- `VK_CONFIRMATION` — строка подтверждения из Callback API
- `VK_SECRET` — секретный ключ сервера Callback API
- `VK_API_VERSION` — версия API VK

## Настройка VK
1. Вставь адрес своего бота в Callback API: `https://твой-домен/vk`
2. Нажми «Подтвердить»
3. Включи событие `message_new`

## Важно
Если ты уже показывал токен на скриншоте, перевыпусти его в VK и используй новый.
