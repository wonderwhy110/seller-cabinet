const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string

export async function groqGenerate(
  prompt: string,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`Groq error: ${response.status}`)
  }

  const data = await response.json() as {
    choices: { message: { content: string } }[]
  }

  return data.choices[0].message.content.trim()
}