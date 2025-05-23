const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";
const TOGETHER_API_KEY = "tgp_v1_k5sy2WftQ5ckNLnJhZ1PwYkNXSaEGhW9nOSA88yoeAU"; // You can move this to an env file later

export async function getMovieRecommendations(userPrompt: string): Promise<string> {
  const response = await fetch(TOGETHER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOGETHER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/Llama-3-8b-chat-hf",
      messages: [
        {
          role: "system",
content: `You are a helpful assistant. When a user gives a mood or setting, reply ONLY with a numbered list of 5 movie titles and a short one-line description. Example:

1. Midnight in Paris - A nostalgic writer travels to 1920s Paris.
2. Amélie - A quirky girl tries to spread happiness in Paris.
...`
        },
        {
          role: "user",
          content: userPrompt,
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get recommendation");
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
