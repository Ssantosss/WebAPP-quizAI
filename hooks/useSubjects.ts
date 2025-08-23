'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Subject } from '@/types/db'

export function useSubjects(courseId?: string) {
  const [data, setData] = useState<Subject[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let off = false
    if (!courseId) { setData([]); setLoading(false); return }
    setLoading(true)
    supabase
      .from('subjects')
      .select('id,name,course_id')
      .eq('course_id', courseId)
      .order('name', { ascending: true })
      .then(({ data }) => !off && setData(data ?? []))
      .finally(() => !off && setLoading(false))
    return () => { off = true }
  }, [courseId])

  return { data, loading }
}
