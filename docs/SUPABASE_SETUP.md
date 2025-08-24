# Supabase – Seed & RLS per Materie (Subjects)

## 1) Esegui il seed delle materie
- Vai su **Supabase → SQL Editor**
- Incolla il contenuto di `supabase/seed/seed_subjects.sql`
- Clicca **Run**

## 2) Abilita RLS/Policy su `subjects`
- Sempre nel SQL Editor, incolla `supabase/policies/subjects_read.sql`
- **Run**

## 3) Verifica dati presenti
```sql
select c.name, count(s.id) as subjects_count
from public.courses c
left join public.subjects s on s.course_id = c.id
group by c.id, c.name
order by c.name;
```
Devi vedere subjects_count > 0 per ogni corso.

---

### 2) (Facoltativo ma utile) Health API unica

Se **non esiste già**, crea `app/api/health/route.ts` per un controllo rapido:

```ts
// app/api/health/route.ts
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const sb = supabase;

    const { count: coursesCount } = await sb.from('courses').select('id', { count: 'exact', head: true });
    const { count: subjectsCount } = await sb.from('subjects').select('id', { count: 'exact', head: true });

    return new Response(JSON.stringify({
      ok: true,
      env: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      counts: { courses: coursesCount ?? 0, subjects: subjectsCount ?? 0 },
    }), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }});
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: String(e?.message || e) }), { status: 500 });
  }
}
```

## Env & CORS

Configura le variabili d'ambiente sia in `.env.local` che su Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY>
```

Imposta gli **Allowed Origins** in Supabase → Settings → API:

```
http://localhost:3000
https://web-app-quiz-ai.vercel.app
```

## RLS per lettura pubblica

Se vuoi permettere la lettura senza login, aggiungi queste policy:

```sql
-- Courses: lettura pubblica
create policy "Public read courses"
on public.courses
for select
to public
using (true);

-- Subjects: lettura pubblica
create policy "Public read subjects"
on public.subjects
for select
to public
using (true);
```

In alternativa usa `to authenticated` per restringere l'accesso.

