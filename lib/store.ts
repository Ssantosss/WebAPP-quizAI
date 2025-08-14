import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Plan = 'free'|'premium'|'pro';
export type QA = { index:number; predicted?:string };
export type Session = { id:string; startedAt:number; shots:number; index:number; answers:QA[] };
export type StatsRecent = { date:string; total:number; correct:number };
export type KPI = { completed:number; accuracy:number; perDay:number };

type State = {
  user: { email?:string; plan:Plan };
  session?: Session;
  recent: StatsRecent[];
  kpi: KPI;
  actions:{
    login(email:string):void;
    logout():void;
    startSession():void;
    recordAnswer(pred:string):void;
    incShot():void;
    finishSession(sum:{total:number; correct:number; timeSec:number}):void;
    resetSession():void;
  };
};

export const useApp = create<State>()(persist((set,get)=>({
  user:{ plan:'free' },
  recent:[],
  kpi:{ completed:0, accuracy:0, perDay:0 },
  actions:{
    login:(email)=> set(s=>({user:{...s.user,email}})),
    logout:()=> set({user:{plan:'free'},session:undefined}),
    startSession:()=> set({session:{id:crypto.randomUUID(),startedAt:Date.now(),shots:0,index:1,answers:[]}}),
    recordAnswer:(pred)=> set(s=>{ if(!s.session) return {}; const ss=s.session; ss.answers.push({index:ss.index,predicted:pred}); ss.index=Math.min(30,ss.index+1); return {session:ss}; }),
    incShot:()=> set(s=> s.session? {session:{...s.session,shots:s.session.shots+1}}:{}),
    finishSession:(sum)=> set(s=>{ if(!s.session) return {}; const date=new Date().toISOString().slice(0,10); const recent=[{date,total:sum.total,correct:sum.correct},...s.recent].slice(0,20); const totalQ=recent.reduce((a,b)=>a+b.total,0); const totalC=recent.reduce((a,b)=>a+b.correct,0); const today=new Date().toISOString().slice(0,10); const perDay=recent.filter(r=>r.date===today).length; return { session:undefined, recent, kpi:{ completed:recent.length, accuracy: totalQ? totalC/totalQ:0, perDay } }; }),
    resetSession:()=> set({session:undefined})
  }
}),{ name:'buddy-store' }));
