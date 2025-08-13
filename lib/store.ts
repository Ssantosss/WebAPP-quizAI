import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Plan = "free"|"premium"|"pro";

export type QA = { index:number; predicted?:"A"|"B"|"C"|"D" };
export type Session = {
  id:string; startedAt:number; finishedAt?:number;
  shots:number; // scatti effettuati
  index:number; // 1..30
  answers: QA[];
};

type StatsRecent = { date:string; total:number; correct:number };

type State = {
  user: { email?:string; plan:Plan };
  session?: Session;
  recent: StatsRecent[];
  actions: {
    login(email:string):void;
    startSession():void;
    recordAnswer(pred:"A"|"B"|"C"|"D"):void;
    incShot():void;
    finishSession(summary:{total:number; correct:number; timeSec:number}):void;
    resetSession():void;
    upgrade(plan:Plan):void;
    logout():void;
  }
}

export const useApp = create<State>()(persist((set,get)=>({
  user:{ plan:"free" },
  recent:[],
  actions:{
    login:(email)=> set(s=>({user:{...s.user,email}})),
    startSession:()=> set({ session:{
      id:crypto.randomUUID(), startedAt:Date.now(),
      shots:0,index:1,answers:[]
    }}),
    recordAnswer:(pred)=> set(s=>{
      if(!s.session) return {};
      const ss = s.session;
      const i = ss.index;
      ss.answers.push({index:i,predicted:pred});
      ss.index = Math.min(30, ss.index+1);
      return { session:ss };
    }),
    incShot:()=> set(s=> s.session? { session:{...s.session, shots:s.session.shots+1 } }:{}),
    finishSession:(sum)=> set(s=>{
      if(!s.session) return {};
      const date = new Date().toISOString().slice(0,10);
      const recent = [{date,total:sum.total,correct:sum.correct}, ...s.recent].slice(0,10);
      return { session:undefined, recent };
    }),
    resetSession:()=> set({ session:undefined }),
    upgrade:(plan)=> set(s=>({ user:{...s.user,plan} })),
    logout:()=> set({ user:{ plan:"free" }, session:undefined })
  }
}), { name:"buddy-store" }));
