import test from 'node:test';import assert from 'node:assert/strict';
import {lessons} from '../public/content.js';
class Element{constructor(){this.innerHTML='';this.textContent='';this.listeners={};this.dataset={};this.classList={toggle(){}};}addEventListener(n,f){this.listeners[n]=f;}setAttribute(){}removeAttribute(){}focus(){}click(){} }
const nodes=new Map();const get=s=>{if(!nodes.has(s))nodes.set(s,new Element());return nodes.get(s);};const events={};let saved=null;
globalThis.document={querySelector:get,querySelectorAll:()=>[],body:get('body'),createElement:()=>new Element()};globalThis.window={addEventListener:(k,f)=>events[k]=f,scrollTo(){}};let hash='#home';globalThis.location={get hash(){return hash;},set hash(v){hash=v.startsWith('#')?v:'#'+v;},protocol:'file:'};globalThis.localStorage={getItem:()=>saved,setItem:(k,v)=>saved=v};globalThis.confirm=()=>true;
await import('../public/app.js');
const click=async d=>get('#main').listeners.click({target:{closest:()=>({dataset:d,disabled:false,setAttribute(){}})}});
const route=h=>{location.hash='#'+h;events.hashchange();};
const progress=()=>JSON.parse(saved||'null');
test('All routes render, including colloquial shortcuts and missing lessons',()=>{
 for(const r of ['home','lessons','lesson/hello','shortcuts','review','vocabulary','practice','builder','progress','about']){route(r);assert.ok(get('#main').innerHTML.length>200,r);}
 route('lesson/missing');assert.match(get('#main').innerHTML,/نەدۆزرایەوە/);
});
test('Lesson 2 remains locked before pass, even by URL and quiz button',async()=>{
 route('lesson/identity');assert.match(get('#main').innerHTML,/قوفڵە/);
 await click({quiz:'identity'});assert.notEqual(location.hash,'#quiz');
 route('home');assert.match(get('#main').innerHTML,/دوای دەرچوون لە وانەی 1/);
});
test('Old read-complete button is ignored and does not unlock the next lesson',async()=>{
 await click({complete:'hello'});assert.equal(progress(),null);
 route('lesson/identity');assert.match(get('#main').innerHTML,/قوفڵە/);
});
test('Known-word toggle persists removal and addition',async()=>{
 await click({known:'hello-0'});assert.ok(progress().known.includes('hello-0'));
 await click({known:'hello-0'});assert.ok(!progress().known.includes('hello-0'));
});
test('Quiz pass unlocks next lesson, duplicate clicks cannot double count',async()=>{
 await click({quiz:'hello'});
 for(let i=0;i<lessons[0].items.length;i++){
  const html=get('#main').innerHTML;
  const fa=html.match(/class="fa" lang="fa">([^<]+)/)[1];
  const answer=lessons[0].items.find(w=>w.fa===fa).ku;
  const choices=[...html.matchAll(/data-answer="(\d)"[^>]*>([^<]+)<\/button>/g)];
  const idx=choices.find(m=>m[2]===answer)[1];
  await click({answer:idx});await click({answer:idx});await click({next:''});
 }
 assert.equal(progress().scores.hello,100);assert.deepEqual(progress().completed,['hello']);
 assert.match(get('#main').innerHTML,/100٪/);
 route('lesson/identity');assert.match(get('#main').innerHTML,/خۆت بناسێنە/);assert.doesNotMatch(get('#main').innerHTML,/ئەم وانەیە هێشتا/);
 route('lesson/numbers');assert.match(get('#main').innerHTML,/قوفڵە/);
});
test('Hint setting persists and vocabulary search includes extended lessons',()=>{
 get('#hints').listeners.change({target:{checked:false}});assert.equal(progress().hints,false);
 route('vocabulary');get('#main').listeners.input({target:{id:'search',value:'خداحافظ'}});
 assert.match(get('#word-list').innerHTML,/خواحافیز/);
 get('#main').listeners.input({target:{id:'search',value:'صرافی'}});
 assert.match(get('#word-list').innerHTML,/سەرافی/);
 get('#main').listeners.input({target:{id:'search',value:'zzzzzz'}});
 assert.match(get('#word-list').innerHTML,/نەدۆزرایەوە/);
});
