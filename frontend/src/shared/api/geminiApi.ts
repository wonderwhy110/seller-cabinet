const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string

export async function geminiGenerate(
  prompt: string,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
      signal,
    },
  )

  if (!response.ok) {
    throw new Error(`Gemini error: ${response.status}`)
  }

  const data = await response.json() as {
    candidates: { content: { parts: { text: string }[] } }[]
  }

  return data.candidates[0].content.parts[0].text.trim()
}