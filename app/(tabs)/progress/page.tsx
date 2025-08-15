'use client';
function Bar({ value }:{value:number}) {
  return (
    <div className="h-3 rounded-full bg-neutral-200 overflow-hidden">
      <div className="h-full bg-[#176d46]" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <h1 className="h2">Progressi</h1>
      <div className="card p-4 space-y-4">
        <div>
          <div className="flex justify-between mb-1"><span>Quiz completati</span><span>12</span></div>
          <Bar value={88} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><span>Precisione</span><span>80%</span></div>
          <Bar value={80} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><span>Quiz al giorno</span><span>1,5</span></div>
          <Bar value={60} />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Quiz recenti</h3>
        <ul className="divide-y divide-neutral-200">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">15/11/23</div>
                <div className="text-sm text-neutral-600">25 domande · 20 corrette</div>
              </div>
              <div className="w-24"><Bar value={80} /></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
