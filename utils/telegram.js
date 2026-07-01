// Telegram notification sender utility

const sendTelegramMessage = async (text) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = '8846419644';
  
  console.log(`[Telegram Log] Alert Message:\n${text}`);
  
  if (!token || token === 'YOUR_TELEGRAM_BOT_TOKEN_HERE') {
    console.warn('Telegram Bot Token is not configured in backend/.env. Skipping Telegram API send.');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });
    const data = await response.json();
    if (!data.ok) {
      console.error('Telegram API error response:', data.description);
    }
  } catch (err) {
    console.error('Telegram connection failed:', err.message);
  }
};

module.exports = {
  sendTelegramMessage
};
