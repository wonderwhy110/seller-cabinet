import { OLLAMA_BASE_URL, OLLAMA_MODEL } from '@shared/config'

interface OllamaRequest {
  model: string
  prompt: string
  stream: boolean
}

interface OllamaResponse {
  response: string
}

export async function ollamaGenerate(prompt: string, signal?: AbortSignal): Promise<string> {
  const body: OllamaRequest = {
    model: OLLAMA_MODEL,
    prompt,
    stream: false,
  }

  const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })

  if (!res.ok) {
    throw new Error(`Ollama error: ${res.status} ${res.statusText}`)
  }

  const data: OllamaResponse = await res.json()
  return data.response
}
