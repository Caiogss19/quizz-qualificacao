export async function sendWebhook(data, retries = 3, backoff = 1000) {
  const webhookUrl = localStorage.getItem('sparkmaxx_webhook_url'); // The admin will set this
  if (!webhookUrl) return;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP erro ${response.status}`);
  } catch (error) {
    if (retries > 0) {
      console.warn(`Webhook falhou. Tentando novamente em ${backoff}ms...`, error);
      setTimeout(() => sendWebhook(data, retries - 1, backoff * 2), backoff);
    } else {
      console.error('Webhook falhou após várias tentativas:', error);
    }
  }
}
