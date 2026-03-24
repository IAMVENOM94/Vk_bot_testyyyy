require('dotenv').config();

const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '1mb' }));

const PORT = Number(process.env.PORT || 3000);
const VK_TOKEN = process.env.VK_GROUP_TOKEN || '';
const VK_CONFIRMATION = process.env.VK_CONFIRMATION || '';
const VK_SECRET = process.env.VK_SECRET || '';
const VK_API_VERSION = process.env.VK_API_VERSION || '5.199';

function assertEnv() {
  const missing = [];
  if (!VK_TOKEN) missing.push('VK_GROUP_TOKEN');
  if (!VK_CONFIRMATION) missing.push('VK_CONFIRMATION');
  if (!VK_SECRET) missing.push('VK_SECRET');

  if (missing.length) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
  }
}

assertEnv();

async function vkApi(method, params = {}) {
  const url = `https://api.vk.com/method/${method}`;

  const response = await axios.post(url, null, {
    params: {
      access_token: VK_TOKEN,
      v: VK_API_VERSION,
      ...params,
    },
    timeout: 10000,
  });

  if (response.data?.error) {
    const err = response.data.error;
    throw new Error(`VK API error ${err.error_code}: ${err.error_msg}`);
  }

  return response.data?.response;
}

async function sendMessage(peerId, text) {
  return vkApi('messages.send', {
    peer_id: peerId,
    random_id: crypto.randomInt(1, 2147483647),
    message: text,
  });
}

app.get('/', (_req, res) => {
  res.status(200).send('VK Callback bot is running');
});

app.post('/vk', async (req, res) => {
  const body = req.body || {};

  try {
    if (VK_SECRET && body.secret !== VK_SECRET) {
      return res.status(403).send('forbidden');
    }

    if (body.type === 'confirmation') {
      return res.status(200).send(VK_CONFIRMATION);
    }

    if (body.type === 'message_new') {
      const message = body.object?.message;
      const text = String(message?.text || '').trim().toLowerCase();
      const peerId = message?.peer_id;

      if (!peerId) {
        return res.status(200).send('ok');
      }

      let reply = 'Привет! Я бот VK на Callback API.';

      if (text === 'привет' || text === '/start' || text === 'start') {
        reply = 'Привет 👋\nЯ запущен и готов работать.';
      } else if (text === 'помощь' || text === 'меню') {
        reply = 'Доступные команды:\n• привет\n• помощь\n• id';
      } else if (text === 'id') {
        reply = `Твой peer_id: ${peerId}`;
      }

      await sendMessage(peerId, reply);
    }

    return res.status(200).send('ok');
  } catch (error) {
    console.error('Webhook error:', error.message);
    return res.status(500).send('error');
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
