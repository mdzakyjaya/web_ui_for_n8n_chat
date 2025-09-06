// We will initialize the AI client lazily (on first use) and import the SDK
// dynamically to prevent the app from crashing on load.
let ai: any | null = null; // Use `any` as the type is not available at the top level
const model = 'gemini-2.5-flash';

const getAiClient = async (): Promise<any | null> => {
  // Return the existing client if it's already initialized.
  if (ai) {
    return ai;
  }
  
  try {
    // Dynamically import the library only when needed.
    const { GoogleGenAI } = await import('@google/genai');

    // Safely check for the process object and the API_KEY to avoid ReferenceError in the browser.
    // The execution environment is expected to provide this environment variable.
    const apiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY;

    if (apiKey) {
      ai = new GoogleGenAI({ apiKey });
      return ai;
    } else {
      console.warn("API_KEY environment variable not found. Automatic title generation will fall back to truncation.");
      return null;
    }
  } catch (error) {
    console.error("Error initializing GoogleGenAI client:", error);
    return null;
  }
};

export const generateTitle = async (firstMessage: string): Promise<string> => {
  // Get the lazily-initialized client.
  const client = await getAiClient();
  
  if (!client) {
    // Fallback if the API key is not available or initialization failed.
    return firstMessage.length > 30 ? firstMessage.substring(0, 27) + '...' : firstMessage;
  }

  try {
    const prompt = `Based on the following user query, create a short, concise title of 5 words or less. The title should capture the main topic or intent. Do not use quotes or any special characters in the title.

User Query: "${firstMessage}"

Title:`;

    const response = await client.models.generateContent({
      model,
      contents: prompt,
    });

    const title = response.text.trim();
    
    // Simple cleanup in case the model adds quotes.
    return title.replace(/["']/g, '');

  } catch (error) {
    console.error('Error generating title with Gemini:', error);
    // Fallback to truncation logic in case of an API error.
    return firstMessage.length > 30 ? firstMessage.substring(0, 27) + '...' : firstMessage;
  }
};
