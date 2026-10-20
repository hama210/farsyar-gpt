import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,words,builders} from '../public/content.js';
import {shortPhrases} from '../public/extra-content.js';
import {fresh,normalize,isUnlocked,recordResult,shuffled,score,matches,PASS_SCORE} from '../public/core.js';
const ids=lessons.map(l=>l.id), wids=words.map(w=>w.id);
test('All topics and colloquial vocabulary have complete Sorani guidance',()=>{
 assert.equal(new Set(ids).size,ids.length);
 assert.equal(new Set(wids).size,words.length);
 assert.ok(lessons.length>=20);
 assert.ok(words.length>=240);
 assert.ok(shortPhrases.length>=15);
 for(const w of words){for(const k of ['fa','pron','ku'])assert.ok(w[k]?.trim(),`${w.id}: ${k}`);assert.ok(['both','formal','casual'].includes(w.register));}
 for(const l of lessons){assert.ok(l.items.length>=6);for(const n of l.dialog)assert.ok(l.items[n]);}
 for(const b of builders){assert.ok(b.fa&&b.pron&&b.ku);for(const t of b.tokens)assert.ok(t.length===3&&t.every(Boolean));}
 for(const p of shortPhrases)for(const field of ['formal','formalPron','casual','pron','ku'])assert.ok(p[field]);
});
test('Storage safely migrates v1, does not trust old read-completed flags',()=>{
 assert.deepEqual(normalize(null,ids,wids),fresh());
 assert.deepEqual(normalize({version:3},ids,wids),fresh());
 const s=normalize({version:1,completed:['hello','hello','identity','fake'],known:[wids[0],'bad'],mistakes:[wids[1],'bad'],scores:{hello:101,identity:75,numbers:-1,cafe:'90'},days:['2026-10-21','bad','2026-10-21'],hints:false},ids,wids);
 assert.deepEqual(s.completed,[]);
 assert.deepEqual(s.known,[wids[0]]);assert.deepEqual(s.mistakes,[wids[1]]);
 assert.deepEqual(s.scores,{identity:75});
 assert.deepEqual(s.days,['2026-10-21']);
 assert.equal(s.hints,false);
});
test('Pass requires 80 percent and exactly sequential gate, including direct visits',()=>{
 const s=fresh();assert.equal(PASS_SCORE,80);
 assert.equal(isUnlocked('hello',ids,s.completed),true);
 assert.equal(isUnlocked('identity',ids,s.completed),false);
 assert.equal(isUnlocked('unknown',ids,s.completed),false);
 assert.equal(recordResult(s,'identity',100,ids),false);
 assert.equal(recordResult(s,'hello',79,ids),false);
 assert.deepEqual(s.completed,[]);
 assert.equal(recordResult(s,'hello',80,ids),true);
 assert.deepEqual(s.completed,['hello']);
 assert.equal(isUnlocked('identity',ids,s.completed),true);
 assert.equal(recordResult(s,'identity',100,ids),true);
 assert.deepEqual(s.completed,['hello','identity']);
 assert.equal(recordResult(s,'identity',100,ids),true);
 assert.deepEqual(s.completed,['hello','identity']);
});
test('Restore preserves only consecutively passed quizzes',()=>{
 const s=normalize({version:2,completed:['hello','identity','numbers'],scores:{hello:100,identity:79,numbers:100},known:[],days:[]},ids,wids);
 assert.deepEqual(s.completed,['hello']);
 assert.equal(isUnlocked('numbers',ids,s.completed),false);
});
test('Progress export/import round trips after passing quizzes',()=>{
 const s=fresh();recordResult(s,'hello',83,ids);s.known=[wids[0]];
 assert.deepEqual(normalize(JSON.parse(JSON.stringify(s)),ids,wids),s);
});
test('Sentence order and scoring utilities',()=>{
 assert.equal(matches([0,1,2],3),true);assert.equal(matches([1,0,2],3),false);
 assert.equal(matches([0,1],3),false);assert.equal(matches([0,1,1],3),false);
 assert.equal(score(5,6),83);assert.equal(score(0,0),0);
 const a=[1,2,3,4];for(let i=0;i<30;i++)assert.deepEqual(shuffled(a).sort(),a);assert.deepEqual(a,[1,2,3,4]);
});
