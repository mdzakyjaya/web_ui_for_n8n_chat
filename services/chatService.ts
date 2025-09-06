
import { Message, ChatHistory } from '../types';

const WEBHOOK_URL = 'https://a-ay.mdlax.my.id/webhook/n8n_chat_agent';

export const sendMessageToWebhook = async (
  message: string,
  history: Message[]
): Promise<string> => {
  try {
    const formattedHistory: ChatHistory[] = history.map(item => ({
      role: item.role,
      parts: [{ text: item.content }],
    }));

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        history: formattedHistory,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Webhook failed with status: ${response.status}. ${errorText}`);
    }

    const data = await response.json();

    // The webhook appears to return the response in a `text` field.
    if (typeof data.text !== 'string') {
        throw new Error('Invalid response format from webhook.');
    }
    
    return data.text;

  } catch (error) {
    console.error('Error sending message to webhook:', error);
    if (error instanceof Error) {
        return `An error occurred while connecting to the AI assistant: ${error.message}`;
    }
    return 'An unknown error occurred.';
  }
};
