'use client';
import { useApp } from '../../lib/store';

export default function DashboardPage(){
  const { kpi, recent } = useApp(s=>({kpi:s.kpi,recent:s.recent}));
  return (
    <div className="container">
      <h1 className="h1">Dashboard</h1>
      <div className="card" style={{display:'flex',justifyContent:'space-between',textAlign:'center'}}>
        <div style={{flex:1}}>
          <h2 className="h2">Completati</h2>
          <p className="h1">{kpi.completed}</p>
        </div>
        <div style={{flex:1}}>
          <h2 className="h2">Accuratezza</h2>
          <p className="h1">{Math.round(kpi.accuracy*100)}%</p>
        </div>
        <div style={{flex:1}}>
          <h2 className="h2">Quiz/giorno</h2>
          <p className="h1">{kpi.perDay}</p>
        </div>
      </div>
      {recent.map((r,i)=>(
        <div key={i} className="card">
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <span>{r.date}</span>
            <span>{r.correct}/{r.total}</span>
          </div>
          <div className="progress"><span style={{width:`${(r.correct/r.total)*100}%`}}/></div>
        </div>
      ))}
    </div>
  );
}
