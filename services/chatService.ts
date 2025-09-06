

const WEBHOOK_URL = 'https://a-ay.mdlax.my.id/webhook/n8n_chat_agent';

export const sendMessageToWebhook = async (
  message: string,
  sessionId: string,
  model: string
): Promise<string> => {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatInput: message,
        session_id: sessionId,
        model: model,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Webhook failed with status: ${response.status}. ${errorText}`);
    }

    const data = await response.json();

    // The webhook returns a response in the format: {"AIResponse": "..."}
    // We need to safely extract the 'AIResponse' string.
    if (data && typeof data.AIResponse === 'string') {
      return data.AIResponse;
    } else {
      console.error(
        'Unexpected response format from webhook:',
        JSON.stringify(data, null, 2)
      );
      throw new Error('Invalid response format from webhook.');
    }
  } catch (error) {
    console.error('Error sending message to webhook:', error);
    if (error instanceof Error) {
        return `An error occurred while connecting to the AI assistant: ${error.message}`;
    }
    return 'An unknown error occurred.';
  }
};