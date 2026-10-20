export const KEY='farsiyar.v1'; // Preserve existing learners' localStorage key.
export const PASS_SCORE=80;
export const fresh=()=>({version:2,completed:[],known:[],mistakes:[],scores:{},hints:true,days:[]});
export function normalize(raw,lessonIds,wordIds){
 const s=fresh();if(!raw||![1,2].includes(raw.version))return s;
 s.known=Array.isArray(raw.known)?[...new Set(raw.known.filter(x=>wordIds.includes(x)))]:[];
 s.mistakes=Array.isArray(raw.mistakes)?[...new Set(raw.mistakes.filter(x=>wordIds.includes(x)))]:[];
 s.hints=raw.hints!==false;
 if(raw.scores&&typeof raw.scores==='object')for(const id of lessonIds){const n=raw.scores[id];if(Number.isInteger(n)&&n>=0&&n<=100)s.scores[id]=n;}
 // Never trust the old "read this lesson" completed flag: only a passing
 // recorded quiz may advance; enforce contiguous order on restoration/import.
 for(const id of lessonIds){if((s.scores[id]||0)<PASS_SCORE)break;s.completed.push(id);}
 s.days=Array.isArray(raw.days)?[...new Set(raw.days.filter(x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)))].slice(-366):[];
 return s;
}
export function isUnlocked(lessonId,lessonIds,completed){
 const index=lessonIds.indexOf(lessonId);
 return index>=0&&(index===0||completed.includes(lessonIds[index-1]));
}
export function recordResult(state,lessonId,result,lessonIds){
 if(!isUnlocked(lessonId,lessonIds,state.completed)||!Number.isInteger(result)||result<0||result>100)return false;
 state.scores[lessonId]=Math.max(state.scores[lessonId]||0,result);
 if(state.scores[lessonId]>=PASS_SCORE&&!state.completed.includes(lessonId))state.completed.push(lessonId);
 state.completed=lessonIds.filter(id=>state.completed.includes(id));
 return state.completed.includes(lessonId);
}
export const shuffled=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
export const score=(right,total)=>total?Math.round(right/total*100):0;
export const matches=(selected,total)=>selected.length===total&&selected.every((n,i)=>n===i);
