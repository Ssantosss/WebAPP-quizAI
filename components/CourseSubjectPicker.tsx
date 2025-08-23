'use client'
import { useCourses } from '@/hooks/useCourses'
import { useSubjects } from '@/hooks/useSubjects'

type Value = { courseId?: string; subjectId?: string }
export type PickerValue = Value

type Props = { value: Value; onChange: (v: Value) => void }

export default function CourseSubjectPicker({ value, onChange }: Props) {
  const { data: courses, loading: loadingC } = useCourses()
  const { data: subjects, loading: loadingS } = useSubjects(value.courseId)
  const canPickSubject = !!value.courseId

  return (
    <div className="space-y-5">
      <div>
        <label className="block mb-2 text-neutral-700 text-[15px]">Corso di Laurea</label>
        <select
          className="w-full h-14 rounded-2xl border border-neutral-200 bg-white px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#176d46]/25"
          value={value.courseId ?? ''}
          onChange={(e) => onChange({ courseId: e.target.value || undefined, subjectId: undefined })}
        >
          <option value="">
            {loadingC ? 'Carico…' : (courses.length ? 'Seleziona corso' : 'Nessun corso disponibile')}
          </option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block mb-2 text-neutral-700 text-[15px]">Materia</label>
        <select
          className="w-full h-14 rounded-2xl border border-neutral-200 bg-white px-4 text-[16px] disabled:bg-neutral-50 disabled:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#176d46]/25"
          value={value.subjectId ?? ''}
          onChange={(e) => onChange({ ...value, subjectId: e.target.value || undefined })}
          disabled={!canPickSubject}
        >
          {!canPickSubject && <option value="">Seleziona corso prima</option>}
          {canPickSubject && (
            <>
              <option value="">
                {loadingS ? 'Carico…' : (subjects.length ? 'Seleziona materia' : 'Nessuna materia disponibile')}
              </option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </>
          )}
        </select>
      </div>
    </div>
  )
}
