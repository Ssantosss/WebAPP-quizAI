import CourseSubjectPicker from './_components/CourseSubjectPicker';

export default function Home() {
  return (
    <main className="min-h-[100dvh] w-full">
      <section className="px-6 pt-10 pb-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Allenati con<br/>Buddy
        </h1>
        <div className="mt-6 flex justify-center">
          <img src="/buddy.png" alt="Buddy" className="w-44 h-44 select-none pointer-events-none" />
        </div>
        <p className="mt-6 text-lg text-gray-800">Puoi provare gratis un<br/>quiz completo</p>
      </section>

      <section className="px-4">
        <div className="mx-auto max-w-md rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm relative z-10 pointer-events-auto">
          <CourseSubjectPicker />
          <a href="/quiz" className="block mt-6 w-full text-center rounded-[20px] bg-[#176d46] text-white py-4 text-lg font-semibold active:scale-[0.98] transition">
            Inizia subito
          </a>
        </div>
      </section>

      <div className="h-24" />
    </main>
  );
}
