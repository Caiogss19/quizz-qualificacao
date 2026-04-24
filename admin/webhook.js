async function sendWebhook(data, retries = 3, backoff = 1000) {
  let webhookUrl = '';
  if (typeof activeQuiz !== 'undefined' && activeQuiz && activeQuiz.webhookUrl) {
    webhookUrl = activeQuiz.webhookUrl;
  } else {
    webhookUrl = localStorage.getItem('sparkmaxx_webhook_url');
  }

  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (err) {
    if (retries > 0) {
      console.warn(`Webhook failed. Retrying in ${backoff}ms...`);
      setTimeout(() => sendWebhook(data, retries - 1, backoff * 2), backoff);
    } else {
      console.error('Webhook failed permanently after retries.');
    }
  }
}
