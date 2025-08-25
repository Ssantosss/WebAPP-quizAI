// app/page.tsx
import CourseSubjectPicker from './_components/CourseSubjectPicker';

export default function Home() {
  return (
    <main className="min-h-[100dvh] w-full">
      {/* Hero: Buddy centrato in alto */}
      <section className="pt-16 pb-6 flex flex-col items-center">
        {/* Buddy (SVG inline dove già definito) */}
        <div className="w-36 h-36 select-none pointer-events-none">
          {/* SVG Buddy inline o import come da progetto */}
        </div>
        <h2 className="mt-6 text-center text-xl font-semibold text-gray-900">
          Puoi provare gratis un quiz completo
        </h2>
      </section>

      {/* Card con i selettori (layout originale) */}
      <section className="px-4">
        <div className="mx-auto max-w-md rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm relative z-10 pointer-events-auto">
          {/* Il componente renderizza i due select: Corso + Materia */}
          <CourseSubjectPicker />
          <button
            type="button"
            className="mt-6 w-full rounded-[20px] bg-[#176d46] text-white py-4 text-lg font-semibold active:scale-[0.98] transition"
          >
            Inizia subito
          </button>
        </div>
      </section>

      {/* Spazio per la bottom nav sticky */}
      <div className="h-24" />
    </main>
  );
}

