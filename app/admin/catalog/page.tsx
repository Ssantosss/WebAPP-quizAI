'use client'
import { useState } from 'react'

export default function CatalogAdminPage() {
  const [json, setJson] = useState(JSON.stringify({
    courses: [
      { name: 'Ingegneria', subjects: ['Analisi 1', 'Fisica 1', 'Chimica'] },
      { name: 'Informatica', subjects: ['Algoritmi', 'Reti', 'Basi di Dati'] },
      { name: 'Scienze della Nutrizione', subjects: ['Biochimica', 'Anatomia', 'Fisiologia'] },
      { name: 'Economia', subjects: ['Microeconomia', 'Macroeconomia', 'Statistica'] },
    ]
  }, null, 2))
  const [out, setOut] = useState<string>('')
  const [token, setToken] = useState('')

  const submit = async () => {
    setOut('Carico…')
    const res = await fetch('/api/catalog/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: json,
    })
    const txt = await res.text()
    setOut(`${res.status}: ${txt}`)
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Import Catalogo (Admin)</h1>
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="ADMIN_IMPORT_TOKEN"
        value={token}
        onChange={e => setToken(e.target.value)}
      />
      <textarea
        className="w-full h-64 border rounded p-3 font-mono text-sm"
        value={json}
        onChange={e => setJson(e.target.value)}
      />
      <button onClick={submit} className="px-4 py-2 rounded bg-emerald-700 text-white">Importa</button>
      <pre className="whitespace-pre-wrap text-sm border rounded p-3">{out}</pre>
    </main>
  )
}
