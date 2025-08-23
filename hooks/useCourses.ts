'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Course } from '@/types/db'

export function useCourses() {
  const [data, setData] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let off = false
    setLoading(true)
    supabase.from('courses').select('id,name').order('name', { ascending: true })
      .then(({ data }) => !off && setData(data ?? []))
      .finally(() => !off && setLoading(false))
    return () => { off = true }
  }, [])

  return { data, loading }
}
