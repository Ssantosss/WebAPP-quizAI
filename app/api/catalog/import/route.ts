import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

type Payload = {
  courses: Array<{ name: string; subjects: string[] }>
}

export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token || token !== process.env.ADMIN_IMPORT_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Payload
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const results: { insertedCourses: number; insertedSubjects: number } = { insertedCourses: 0, insertedSubjects: 0 }

  for (const c of body.courses) {
    // upsert corso per nome
    const { data: upCourse, error: e1 } = await supabaseAdmin
      .from('courses')
      .upsert({ name: c.name }, { onConflict: 'name' })
      .select('id')
      .single()

    if (e1 || !upCourse) return NextResponse.json({ error: e1?.message ?? 'upsert course failed', course: c.name }, { status: 500 })
    results.insertedCourses++

    // upsert materie per (course_id, name)
    if (Array.isArray(c.subjects) && c.subjects.length) {
      const rows = c.subjects.map(name => ({ course_id: upCourse.id, name }))
      const { error: e2 } = await supabaseAdmin
        .from('subjects')
        .upsert(rows, { onConflict: 'course_id,name', ignoreDuplicates: true })

      if (e2) return NextResponse.json({ error: e2.message, course: c.name }, { status: 500 })
      results.insertedSubjects += rows.length
    }
  }

  return NextResponse.json({ ok: true, ...results })
}
