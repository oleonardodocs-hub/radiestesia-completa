(()=>{
'use strict';
const charts=window.RC_DATA||[];
const lessons=window.RC_LESSONS||[];
const main=document.getElementById('main');
const modal=document.getElementById('chart-modal');
const md=document.getElementById('modal-content');
const sm=document.getElementById('simple-modal');
const smc=document.getElementById('simple-modal-content');
const categories=[...new Set(charts.map(c=>c.category))];
const KEY='rc121-v2:';
const get=(k,def)=>{try{const v=JSON.parse(localStorage.getItem(KEY+k));return v===null?def:v;}catch{return def;}};
const save=(k,v)=>{try{localStorage.setItem(KEY+k,JSON.stringify(v));return true;}catch{toast('Salvataggio locale non disponibile.');return false;}};
const state={view:'home',category:'Tutte',query:'',sort:'number',limit:18,favorites:new Set(get('favorites',[])),studied:new Set(get('studied',[])),journal:get('journal',[])};
const esc=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=(s)=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const shorten=(s,max=19)=>s.length>max?s.slice(0,max-1)+'…':s;
const chartById=(id)=>charts.find(c=>c.id===id);
const notice='<div class="notice"><strong>Nota sul metodo.</strong> Queste 121 tavole sono disegni didattici originali e attività di riflessione ispirate alla tradizione radiestesica, non riproduzioni di tavole storiche certificate. Le risposte del pendolo possono riflettere movimenti involontari (effetto ideomotorio); non sono misure oggettive né indicazioni diagnostiche, terapeutiche o predittive.</div>';
let toastTimeout;
function toast(message){let el=document.getElementById('toast');el.textContent=message;el.classList.add('shown');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('shown'),3200)}
function point(cx,cy,r,angle){return [cx+Math.cos(angle)*r,cy+Math.sin(angle)*r]}
function textTag(x,y,label,size=12,fill='#27395a',weight='650'){
 let pieces=[]; if(label.length>17&&label.includes(' ')){
  const parts=label.split(' ');let a='',b='';for(const part of parts){if((a+' '+part).trim().length<=13||!a)a=(a+' '+part).trim();else b=(b+' '+part).trim()};pieces=[a,b].filter(Boolean);
 }else pieces=[label];
 if(pieces.length>1)return `<text x="${x.toFixed(1)}" y="${(y-5).toFixed(1)}" text-anchor="middle" font-size="${size}" fill="${fill}" font-family="Arial,sans-serif" font-weight="${weight}">${pieces.map((p,i)=>`<tspan x="${x.toFixed(1)}" dy="${i?15:0}">${esc(p)}</tspan>`).join('')}</text>`;
 return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" font-size="${size}" fill="${fill}" font-family="Arial,sans-serif" font-weight="${weight}">${esc(label)}</text>`
}
function ring(cx,cy,r,stroke='#b68a37',width=2,opacity=1){return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="${width}" opacity="${opacity}"/>`}
function polygon(cx,cy,r,sides,rot=-Math.PI/2){return Array.from({length:sides},(_,i)=>point(cx,cy,r,rot+Math.PI*2*i/sides).map(n=>n.toFixed(2)).join(',')).join(' ')}
function symmetricStar(cx,cy,r,points,rot=-Math.PI/2,inner=.49){return Array.from({length:points*2},(_,i)=>point(cx,cy,i%2?r*inner:r,rot+i*Math.PI/points).map(n=>n.toFixed(2)).join(',')).join(' ')}
function svgGraphic(chart,mode='full'){
 const cx=320,cy=348,R=218;
 const gold='#b9914c',ink='#17335d',blue='#385982';
 let art='';const labels=chart.labels;
 const idx=Number(chart.number);
 const n=labels.length;
 const isDial=['radial','semicircle'].includes(chart.kind);
 if(chart.kind==='semicircle'){
  const originY=475,rr=230;
  art+=`<path d="M 90 ${originY} A ${rr} ${rr} 0 0 1 550 ${originY}" fill="none" stroke="${ink}" stroke-width="3"/>`;
  art+=`<path d="M 126 ${originY} A 194 194 0 0 1 514 ${originY}" fill="none" stroke="${gold}" stroke-width="1.5"/>`;
  art+=`<line x1="78" x2="562" y1="${originY}" y2="${originY}" stroke="${ink}" stroke-width="2"/>`;
  const intervals=n===4?4:n-1;
  for(let i=0;i<=intervals;i++){
   const theta=Math.PI+i*Math.PI/intervals, a=point(cx,originY,rr,theta),b=point(cx,originY,23,theta);
   art+=`<path d="M ${b[0].toFixed(1)} ${b[1].toFixed(1)} L ${a[0].toFixed(1)} ${a[1].toFixed(1)}" fill="none" stroke="${gold}" stroke-width="${i===0||i===intervals?2:1}" opacity=".76"/>`;
  }
  labels.forEach((v,i)=>{
   const theta=Math.PI+(i+.5)*Math.PI/n;
   const pp=point(cx,originY,167,theta);
   art+=textTag(pp[0],pp[1],v,n>9?11.8:n>7?12.7:n>5?13.5:15,ink);
  });
  art+=ring(cx,originY,13,ink,2)+`<circle cx="${cx}" cy="${originY}" r="4.5" fill="${gold}"/>`;
  art+=textTag(cx,527,'PUNTO DI LETTURA',11.5,blue);
 } else if(chart.kind==='radial'){
  const colors=['#cd4a4a','#d87e2b','#e4bc34','#4f996a','#447db6','#6054aa','#9958a6'];
  art+=ring(cx,cy,230,ink,2.5)+ring(cx,cy,140,gold,1.5)+ring(cx,cy,45,ink,2);
  const sectors=n;
  for(let i=0;i<sectors;i++){
   const a=-Math.PI/2+(i-.5)*2*Math.PI/sectors;
   const p1=point(cx,cy,48,a),p2=point(cx,cy,230,a);
   art+=`<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="${gold}" stroke-width="1.5"/>`;
   const mid=-Math.PI/2+i*Math.PI*2/sectors,lp=point(cx,cy,185,mid);
   if(idx===120){const start=-Math.PI/2+(i-.5)*Math.PI*2/sectors,end=-Math.PI/2+(i+.5)*Math.PI*2/sectors;
    const a0=point(cx,cy,144,start),a1=point(cx,cy,225,start),b1=point(cx,cy,225,end),b0=point(cx,cy,144,end);
    art+=`<path d="M ${a0.join(' ')} L ${a1.join(' ')} A 225 225 0 0 1 ${b1.join(' ')} L ${b0.join(' ')} A 144 144 0 0 0 ${a0.join(' ')}" fill="${colors[i%colors.length]}" opacity=".25"/>`;
   }
   art+=textTag(lp[0],lp[1]+4,labels[i],n>7?11:n>5?13:14,ink);
  }
  art+=`<circle cx="${cx}" cy="${cy}" r="29" fill="#faf3e1" stroke="${gold}" stroke-width="1.5"/><polygon points="${symmetricStar(cx,cy,17,5)}" fill="${gold}"/>`;
 }else{
  const var1=idx%4, var2=idx%5;
  art+=ring(cx,cy,236,ink,2.4)+ring(cx,cy,222,gold,1.2)+ring(cx,cy,126,gold,1.2);
  for(let a=0;a<24;a++){
   let ang=a*Math.PI/12, pp=point(cx,cy,236,ang), qq=point(cx,cy,a%3===0?221:228,ang);
   art+=`<line x1="${pp[0].toFixed(1)}" y1="${pp[1].toFixed(1)}" x2="${qq[0].toFixed(1)}" y2="${qq[1].toFixed(1)}" stroke="${gold}" stroke-width="${a%3===0?2:1}"/>`;
  }
  switch(chart.kind){
   case 'spiral':{
    let pts=[];const turns=idx===2?4.8:2.8+(idx%4)*.35;
    for(let k=0;k<=600;k++){let t=k/600,rr=7+t*133,angle=t*Math.PI*2*turns+(idx%7)*.14;pts.push(point(cx,cy,rr,angle).map(v=>v.toFixed(2)).join(','))}
    art+=`<polyline points="${pts.join(' ')}" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    art+=ring(cx,cy,148,gold,1)+`<circle cx="${cx}" cy="${cy}" r="7" fill="${gold}"/>`;
    break;}
   case 'shield':{
    const d=`M ${cx} ${cy-141} C ${cx+32} ${cy-107} ${cx+95} ${cy-100} ${cx+133} ${cy-92} L ${cx+110} ${cy+23} Q ${cx+88} ${cy+102} ${cx} ${cy+150} Q ${cx-88} ${cy+102} ${cx-110} ${cy+23} L ${cx-133} ${cy-92} C ${cx-95} ${cy-100} ${cx-32} ${cy-107} ${cx} ${cy-141} Z`;
    art+=`<path d="${d}" fill="rgba(215,188,121,.075)" stroke="${ink}" stroke-width="3"/>`;
    art+=`<polygon points="${symmetricStar(cx,cy,48,4+var1)}" fill="none" stroke="${gold}" stroke-width="3"/>`;
    art+=ring(cx,cy,87,gold,1.6);break;}
   case 'sun':{
    for(let k=0;k<24+var2*4;k++){const n=24+var2*4,a=k*Math.PI*2/n,p1=point(cx,cy,138,a),p2=point(cx,cy,k%2?166:191,a);art+=`<path d="M ${p1.join(' ')} L ${p2.join(' ')}" stroke="${gold}" stroke-width="${k%2?1.5:2.7}"/>`}
    art+=`<circle cx="${cx}" cy="${cy}" r="100" fill="rgba(245,210,123,.16)" stroke="${ink}" stroke-width="3"/>`;
    art+=`<polygon points="${symmetricStar(cx,cy,80,8+var1)}" fill="none" stroke="${gold}" stroke-width="2"/>`;break;}
   case 'flower':{
    let petals=6+var1*2;
    for(let k=0;k<petals;k++){art+=`<ellipse cx="${cx}" cy="${cy-80}" rx="${37+var2*2}" ry="83" transform="rotate(${360*k/petals} ${cx} ${cy})" fill="rgba(203,156,74,.07)" stroke="${ink}" stroke-width="1.6"/>`}
    art+=ring(cx,cy,44,gold,2);break;}
   case 'grid':{
    let step=56+var1*4;for(let k=-2;k<=2;k++){art+=`<line x1="${cx-2*step}" y1="${cy+k*step}" x2="${cx+2*step}" y2="${cy+k*step}" stroke="${k===0?ink:gold}" stroke-width="${k===0?2.2:1.2}"/>`;
    art+=`<line x1="${cx+k*step}" y1="${cy-2*step}" x2="${cx+k*step}" y2="${cy+2*step}" stroke="${k===0?ink:gold}" stroke-width="${k===0?2.2:1.2}"/>`}
    art+=`<polygon points="${polygon(cx,cy,54,4,Math.PI/4)}" fill="#fffaf0" stroke="${ink}" stroke-width="2"/>`;break;}
   case 'vesica':{
    art+=`<circle cx="${cx-61}" cy="${cy}" r="128" fill="rgba(86,121,166,.07)" stroke="${ink}" stroke-width="3"/>`;
    art+=`<circle cx="${cx+61}" cy="${cy}" r="128" fill="rgba(218,169,86,.1)" stroke="${gold}" stroke-width="3"/>`;
    art+=`<polygon points="${polygon(cx,cy,56,6+var1)}" fill="none" stroke="${ink}" stroke-width="2"/>`;break;}
   case 'star':{
    art+=`<polygon points="${symmetricStar(cx,cy,147,5+var1)}" fill="rgba(218,169,86,.08)" stroke="${ink}" stroke-width="3"/>`;
    art+=`<polygon points="${polygon(cx,cy,68,5+var1)}" fill="none" stroke="${gold}" stroke-width="2"/>`;break;}
   case 'lotus':{
    for(let k=0;k<8+var1*2;k++){
     let petals=8+var1*2;
     art+=`<ellipse cx="${cx}" cy="${cy-99}" rx="${34+var2}" ry="94" transform="rotate(${360*k/petals} ${cx} ${cy})" fill="rgba(216,178,105,.065)" stroke="${ink}" stroke-width="1.45"/>`}
    art+=ring(cx,cy,59,gold,2.4)+`<polygon points="${polygon(cx,cy,44,8)}" fill="none" stroke="${gold}" stroke-width="2"/>`;break;}
   case 'hex':{
    for(let z=0;z<4;z++)art+=`<polygon points="${polygon(cx,cy,52+z*35,6,Math.PI/6+(var1*Math.PI/18))}" fill="none" stroke="${z%2?gold:ink}" stroke-width="${z===3?2.5:1.7}"/>`;
    art+=ring(cx,cy,28,gold,2);break;}
   default:art+=ring(cx,cy,99,gold,2)
  }
  // zone testuali dedicate: ogni grafico ha i propri settori, non un'etichetta generica.
  const count=Math.min(6,labels.length);
  for(let k=0;k<count;k++){
   const a=-Math.PI/2+k*Math.PI*2/count;
   const pp=point(cx,cy,190,a);
   const l=labels[k];
   art+=`<rect x="${(pp[0]-41).toFixed(2)}" y="${(pp[1]-12).toFixed(2)}" width="82" height="24" rx="10" fill="#fffbf3" stroke="#d9bd85" stroke-width=".8"/>`;
   art+=textTag(pp[0],pp[1]+4,shorten(l,12),10.6,ink,'700');
  }
  art+=`<circle cx="${cx}" cy="${cy}" r="34" fill="#fffaf0" stroke="${ink}" stroke-width="2"/>`;
  art+=`<polygon points="${symmetricStar(cx,cy,14,5+idx%3)}" fill="none" stroke="${gold}" stroke-width="2"/>`;
 }
 const ttl=chart.title.length>32?chart.title.match(/.{1,29}(?:\s|$)/g)||[chart.title]:[chart.title];
 const titleLines=ttl.slice(0,2).map((t,i)=>`<tspan x="320" dy="${i?22:0}">${esc(t.trim())}</tspan>`).join('');
 const footer=`<text x="320" y="670" text-anchor="middle" font-size="13" font-family="Arial,sans-serif" letter-spacing="2" fill="#546783">SCHEMA ORIGINALE · ESERCIZIO SIMBOLICO</text>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 710" width="640" height="710" role="img" aria-label="Tavola ${esc(chart.number)}: ${esc(chart.title)}">
 <rect width="640" height="710" fill="#fffdf7"/><rect x="19" y="20" width="602" height="666" rx="13" fill="none" stroke="${gold}" stroke-width="2"/>
 <text x="320" y="49" text-anchor="middle" font-size="12" font-weight="700" letter-spacing="3" fill="${gold}" font-family="Arial,sans-serif">RADIESTESIA COMPLETA</text>
 <text x="320" y="80" text-anchor="middle" font-size="23" font-family="Georgia,serif" fill="${ink}">${titleLines}</text>
 <text x="60" y="117" font-size="13" font-weight="700" letter-spacing="1" fill="${gold}" font-family="Arial,sans-serif">Nº ${chart.number}</text>
 ${art}
 <line x1="76" y1="640" x2="564" y2="640" stroke="${gold}" stroke-width="1"/>${footer}</svg>`;
}
function cardsHtml(items){return `<div class="cards">${items.map(c=>`<article class="chart-card">
 <div class="chart-art" data-open="${c.id}" role="button" tabindex="0" aria-label="Apri ${esc(c.title)}">
 <span class="chart-number">Nº ${c.number}</span>${svgGraphic(c,'thumb')}<button class="fav-icon ${state.favorites.has(c.id)?'active':''}" type="button" data-fav="${c.id}" aria-label="${state.favorites.has(c.id)?'Rimuovi dai':'Aggiungi ai'} preferiti">${state.favorites.has(c.id)?'♥':'♡'}</button></div>
 <div class="chart-card-body"><span class="chip">${esc(c.category)}</span><h3>${esc(c.title)}</h3><p>${esc(c.purpose)}</p><div class="card-footer"><small>${state.studied.has(c.id)?'✓ Studiato':'◷ '+c.time}</small><button data-open="${c.id}" type="button">Apri la tavola ↗</button></div></div></article>`).join('')}</div>`}
function home(){
 const recommendations=[charts[0],charts[112],charts[113],charts[118],charts[79],charts[100]];
 main.innerHTML=`<section class="hero"><div><span class="micro">IL TUO PERCORSO, PASSO DOPO PASSO</span><h1>121 grafici.<br/><span class="gold">Un metodo da esplorare.</span></h1><p>Tavole originali stampabili, indicazioni concrete e attività guidate in italiano. Esplora i grafici, annota le tue osservazioni e ritrova quelli che usi di più.</p><div class="hero-actions"><button class="btn btn-primary" data-nav="library">Esplora i 121 grafici →</button><button class="btn btn-secondary" data-nav="guide">Inizia dal metodo</button></div></div><div class="hero-illustration"><img src="assets/icon-512.png" alt="Emblema Radiestesia Completa"/></div></section>
 <div class="statbar"><div class="stat"><i>◉</i><div><strong>${charts.length}</strong><small>tavole illustrate</small></div></div><div class="stat"><i>✧</i><div><strong>${state.studied.size}</strong><small>tavole studiate</small></div></div><div class="stat"><i>♡</i><div><strong>${state.favorites.size}</strong><small>preferiti salvati</small></div></div></div>
 <div class="section-head"><div><span class="micro">SELEZIONE PER COMINCIARE</span><h2>Da dove vuoi iniziare?</h2></div><button class="text-link" data-nav="library">Biblioteca completa →</button></div>${cardsHtml(recommendations)}
 <div class="section-head"><div><span class="micro">CONTENUTO INCLUSO</span><h2>Gli strumenti dell'app</h2></div></div>
 <div class="resource-grid"><section class="resource"><div class="icon">☷</div><h3>Metodo di utilizzo</h3><p>Sette lezioni: preparazione, domande, convenzioni, lettura e verifica delle osservazioni.</p><button class="btn btn-quiet" data-nav="guide">Apri la guida →</button></section><section class="resource"><div class="icon">▤</div><h3>Diario di pratica</h3><p>Registra grafico, domanda, osservazione e verifica. I tuoi dati restano nel browser che stai usando.</p><button class="btn btn-quiet" data-nav="journal">Apri il diario →</button></section></div>${notice}`;
}
function getFiltered(favOnly=false){let set=charts.filter(c=>(!favOnly||state.favorites.has(c.id))&&(state.category==='Tutte'||c.category===state.category));let q=normalize(state.query.trim());if(q)set=set.filter(c=>normalize([c.title,c.category,c.purpose,c.exercise,...c.labels,...c.tags].join(' ')).includes(q));if(state.sort==='title')set.sort((a,b)=>a.title.localeCompare(b.title,'it'));return set;}
function filterUI(favOnly=false){return `<div class="filters"><label class="search"><span>⌕</span><input id="search-chart" aria-label="Cerca grafici" type="search" placeholder="Cerca per nome, funzione o tema…" value="${esc(state.query)}" autocomplete="off"/></label><button type="button" class="filter-btn" id="sort-chart">${state.sort==='number'?'Nº 001–121':'A–Z'} ↕</button></div><div class="filter-strip"><button class="filter-btn ${state.category==='Tutte'?'active':''}" data-category="Tutte">Tutte</button>${categories.map(cat=>`<button class="filter-btn ${state.category===cat?'active':''}" data-category="${esc(cat)}">${esc(cat)}</button>`).join('')}</div>`}
function library(favOnly=false){const set=getFiltered(favOnly);main.innerHTML=`<div class="page-header"><span class="micro">${favOnly?'LA TUA SELEZIONE':'10 CATEGORIE TEMATICHE'}</span><h1>${favOnly?'I tuoi preferiti':'Biblioteca dei 121 grafici'}</h1><p>${favOnly?'Ritrova qui le tavole che hai scelto di salvare.':'Ogni tavola include uno schema originale, uno scopo preciso, un esercizio concreto e strumenti per stampare o esportare il disegno.'}</p></div>${filterUI(favOnly)}<div class="result-count">${set.length} ${set.length===1?'grafico trovato':'grafici trovati'}${set.length>state.limit?` · primi ${state.limit} mostrati`:''}</div>${set.length?cardsHtml(set.slice(0,state.limit))+(set.length>state.limit?`<div class="load-more"><button class="btn btn-secondary" id="load-more">Mostra altri grafici (${set.length-state.limit} rimasti) ↓</button></div>`:''):`<div class="empty-state"><strong>${favOnly&&state.favorites.size===0?'Nessun preferito ancora':'Nessun grafico trovato'}</strong><p>${favOnly&&state.favorites.size===0?'Tocca il cuore su una tavola per salvarla.':'Prova un altro termine o seleziona tutte le categorie.'}</p></div>`}${notice}`;
}
function guide(){main.innerHTML=`<header class="page-header"><span class="micro">GUIDA DI CONSULTAZIONE</span><h1>Metodo passo passo</h1><p>Un percorso utile per iniziare con criteri chiari e registrare le osservazioni senza confondere simboli, impressioni e fatti.</p></header><div class="guide-start"><span class="micro">PRIMA DI COMINCIARE</span><h3>Materiale di base</h3><p>Ti bastano il tuo pendolo, una tavola stampata o visualizzata, un supporto stabile e il diario. Il pendolo non produce letture oggettive di salute, futuro o proprietà fisiche.</p><div class="guide-checks"><label><input type="checkbox"/> Tavola scelta</label><label><input type="checkbox"/> Pendolo pronto</label><label><input type="checkbox"/> Domanda definita</label><label><input type="checkbox"/> Diario aperto</label></div></div>${lessons.map((l,i)=>`<details class="lesson" ${i===0?'open':''}><summary><span>${esc(l.title)}</span><small>${esc(l.time)}</small></summary><p>${esc(l.content)}</p></details>`).join('')}<div class="button-group"><button class="btn btn-primary" data-open="g113">Prova la tavola Sì / No</button><button class="btn btn-secondary" data-nav="journal">Vai al diario</button></div>${notice}`;}
function renderJournal(){main.innerHTML=`<header class="page-header"><span class="micro">REGISTRO PERSONALE</span><h1>Diario di pratica</h1><p>Una sessione ben documentata distingue domande, osservazioni e verifiche. Le note rimangono in questo dispositivo: puoi esportarle come file.</p></header><div class="journal-layout"><section class="panel"><h3>Nuova annotazione</h3><form id="journal-form" class="form-grid"><div class="field"><label for="jdate">Data della sessione</label><input id="jdate" name="date" type="date" required value="${new Date().toLocaleDateString('en-CA')}"/></div><div class="field"><label for="jchart">Grafico utilizzato</label><select id="jchart" name="chart" required>${charts.map(c=>`<option value="${c.id}">Nº ${c.number} · ${esc(c.title)}</option>`).join('')}</select></div><div class="field"><label for="jquestion">Domanda o intenzione</label><textarea id="jquestion" name="question" maxlength="1200" placeholder="Scrivi una domanda delimitata o il tema della tua riflessione…" required></textarea></div><div class="field"><label for="jresult">Osservazione e verifica</label><textarea id="jresult" name="result" maxlength="2400" placeholder="Che cosa hai osservato? Puoi confrontarlo con fatti verificabili?"></textarea></div><div class="form-action"><button class="btn btn-primary" type="submit">Salva nel diario</button></div></form></section><section class="panel"><h3>Le tue sessioni (${state.journal.length})</h3><div id="entries">${state.journal.length?state.journal.map(x=>`<article class="entry"><div class="entry-top"><div><strong>${esc(chartById(x.chart)?.title||'Grafico non trovato')}</strong><time>${esc(x.date)}</time></div><button type="button" data-remove-entry="${esc(x.id)}">Elimina</button></div><p>${esc(x.question)}</p>${x.result?`<small>Osservazione / verifica</small><p>${esc(x.result)}</p>`:''}</article>`).join(''):'<div class="empty-state"><strong>Il diario è pronto.</strong><p>La prima registrazione apparirà qui.</p></div>'}</div><div class="journal-tools"><button class="btn btn-secondary" id="export-journal" ${state.journal.length?'':'disabled'}>↓ Esporta JSON</button><button class="btn btn-secondary" id="export-csv" ${state.journal.length?'':'disabled'}>↓ Esporta CSV</button></div></section></div>${notice}`;}
function openChart(id){let c=chartById(id);if(!c)return;const mode=c.kind==='semicircle'||c.kind==='radial';const steps=[
 'Prepara il tavolo, il pendolo e una scheda nel diario; leggi prima lo scopo specifico della tavola.',
 c.exercise,
 mode?'Sospendi il pendolo sul punto centrale e osserva il settore indicato, registrando anche esitazioni o assenza di risposta.':'Osserva la geometria, poi usa le parole riportate sulla tavola per guidare la riflessione; il pendolo è facoltativo.',
 'Registra la domanda esatta, ciò che hai osservato e almeno un fatto che puoi verificare indipendentemente.'
];
 md.innerHTML=`<header class="modal-head"><div><span class="micro">Nº ${c.number} · ${esc(c.category)}</span><h2>${esc(c.title)}</h2><p>${esc(c.purpose)}</p></div><button type="button" class="modal-close" aria-label="Chiudi" id="close-chart">×</button></header><div class="modal-grid"><div><div class="modal-graphic" id="print-graphic">${svgGraphic(c)}</div><div class="graphic-tools"><button class="btn btn-primary" data-download="${c.id}">↓ Scarica PNG</button><button class="btn btn-secondary" data-print="${c.id}">▤ Stampa / PDF</button><button class="btn btn-quiet" data-fav="${c.id}">${state.favorites.has(c.id)?'♥ Nei preferiti':'♡ Salva preferito'}</button></div><div class="print-note">Radiestesia Completa · Nº ${c.number} · ${esc(c.title)} · materiale simbolico originale</div></div><div class="guide-detail"><span class="pill">${esc(c.level)} · ${esc(c.time)} circa</span><h3>A cosa serve</h3><p>${esc(c.purpose)}</p><h3>Attività pratica</h3><p class="example">${esc(c.exercise)}</p><h3>Come usarlo</h3><ol>${steps.map(t=>`<li>${esc(t)}</li>`).join('')}</ol><h3>Domanda per il diario</h3><p>«${esc(c.question)}»</p><h3>Quali parole trovi sulla tavola?</h3><p>${c.labels.map(x=>`<span class="pill" style="margin:0 5px 6px 0;display:inline-block">${esc(x)}</span>`).join('')}</p><h3>Come interpretare</h3><p>${mode?'Considera il settore indicato come un dato dell’esercizio: confrontalo con la tua valutazione scritta e con fatti osservabili.':'Le parole sulla tavola sono punti di partenza per la riflessione, non forze o misure osservate.'}</p><p class="warning">Non utilizzare questa tavola per diagnosi, trattamenti, sicurezza, decisioni finanziarie o previsioni. Le figure sono simboliche.</p><div class="button-group"><button class="btn btn-secondary" data-studied="${c.id}">${state.studied.has(c.id)?'✓ Segnato come studiato':'✓ Segna come studiato'}</button><button class="btn btn-quiet" data-journal-chart="${c.id}">Apri il diario →</button></div></div></div>`;
 modal.showModal();}
function setView(view){state.view=view;state.category='Tutte';state.query='';state.sort='number';state.limit=18;render();window.scrollTo({top:0,behavior:'instant'});}
function render(){document.querySelectorAll('[data-view]').forEach(el=>{el.classList.toggle('active',el.dataset.view===state.view);if(el.dataset.view===state.view)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current')});if(state.view==='home')home();else if(state.view==='library')library(false);else if(state.view==='favorites')library(true);else if(state.view==='guide')guide();else if(state.view==='journal')renderJournal();}
function rerenderKeepFocus(){const sel=document.activeElement?.id;const pos=sel==='search-chart'?document.activeElement.selectionStart:0;let from=window.scrollY;render();if(sel==='search-chart'){let t=document.getElementById('search-chart');t?.focus();try{t?.setSelectionRange(pos,pos)}catch{}}window.scrollTo(0,from);}
function toggleFav(id){if(state.favorites.has(id))state.favorites.delete(id);else state.favorites.add(id);save('favorites',[...state.favorites]);if(modal.open){let btn=md.querySelector('.graphic-tools [data-fav]');if(btn)btn.textContent=state.favorites.has(id)?'♥ Nei preferiti':'♡ Salva preferito';}if(state.view==='library'||state.view==='favorites'||state.view==='home')rerenderKeepFocus();toast(state.favorites.has(id)?'Grafico aggiunto ai preferiti.':'Grafico rimosso dai preferiti.');}
function downloadBlob(blob,filename){const u=URL.createObjectURL(blob);let a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function downloadGraphic(id){const c=chartById(id);if(!c)return;const raw=svgGraphic(c).replace('<svg ','<svg ');const svgBlob=new Blob([raw],{type:'image/svg+xml;charset=utf-8'});const temp=URL.createObjectURL(svgBlob);let im=new Image();im.onload=()=>{let canvas=document.createElement('canvas');canvas.width=1920;canvas.height=2130;let ctx=canvas.getContext('2d');ctx.drawImage(im,0,0,canvas.width,canvas.height);URL.revokeObjectURL(temp);canvas.toBlob(blob=>{if(blob){downloadBlob(blob,`radiestesia-grafico-${c.number}.png`);toast('Grafico PNG pronto.')}else toast('Impossibile esportare il PNG.')},'image/png')};im.onerror=()=>{URL.revokeObjectURL(temp);downloadBlob(svgBlob,`radiestesia-grafico-${c.number}.svg`);toast('PNG non disponibile: tavola SVG salvata.')};im.src=temp;}
function csvEscape(v){return '"'+String(v??'').replaceAll('"','""')+'"'}
function exportJournal(format){let output,typ,name;if(format==='csv'){output=['Data,Grafico,Domanda,Osservazione'].concat(state.journal.map(x=>[x.date,chartById(x.chart)?.title||'',x.question,x.result].map(csvEscape).join(','))).join('\r\n');typ='text/csv;charset=utf-8';name='diario-radiestesia.csv';output='\uFEFF'+output;}else{output=JSON.stringify(state.journal,null,2);typ='application/json;charset=utf-8';name='diario-radiestesia.json';}downloadBlob(new Blob([output],{type:typ}),name);}
function openHelp(){smc.innerHTML=`<button class="modal-close" id="close-help" style="float:right" aria-label="Chiudi">×</button><span class="micro">COME FUNZIONA</span><h2 style="margin-top:15px">Il tuo spazio di studio</h2><p class="soft">Non serve alcuna registrazione: apri il link e scegli una delle 121 tavole. Le figure possono essere scaricate e stampate. Il diario, i preferiti e il progresso sono salvati solo nel browser di questo dispositivo.</p><div class="notice"><strong>Privacy.</strong> Se cancelli i dati del browser, usi la navigazione privata o cambi dispositivo, potresti perdere le note. Esporta il diario periodicamente.</div><div class="button-group"><button class="btn btn-primary" data-help-nav="guide">Leggi il metodo</button><button class="btn btn-secondary" data-help-nav="library">Vedi i grafici</button></div>`;sm.showModal();}
function navAfterModal(v){if(modal.open)modal.close();if(sm.open)sm.close();setView(v)}
document.addEventListener('click',event=>{
 const t=event.target;
 const view=t.closest('[data-view]');if(view){setView(view.dataset.view);return;}
 const nav=t.closest('[data-nav]');if(nav){navAfterModal(nav.dataset.nav);return;}
 const open=t.closest('[data-open]');if(open){openChart(open.dataset.open);return;}
 const favorite=t.closest('[data-fav]');if(favorite){event.stopPropagation();toggleFav(favorite.dataset.fav);return;}
 const category=t.closest('[data-category]');if(category){state.category=category.dataset.category;state.limit=18;rerenderKeepFocus();return;}
 const sort=t.closest('#sort-chart');if(sort){state.sort=state.sort==='number'?'title':'number';state.limit=18;rerenderKeepFocus();return;}
 if(t.closest('#load-more')){state.limit+=18;rerenderKeepFocus();return;}
 const dl=t.closest('[data-download]');if(dl){downloadGraphic(dl.dataset.download);return;}
 const print=t.closest('[data-print]');if(print){window.print();return;}
 const studied=t.closest('[data-studied]');if(studied){const id=studied.dataset.studied;state.studied.add(id);save('studied',[...state.studied]);studied.textContent='✓ Segnato come studiato';toast('Progresso aggiornato.');return;}
 const journal=t.closest('[data-journal-chart]');if(journal){const id=journal.dataset.journalChart;navAfterModal('journal');document.getElementById('jchart').value=id;document.getElementById('jquestion').focus();return;}
 const remove=t.closest('[data-remove-entry]');if(remove){if(confirm('Eliminare definitivamente questa annotazione?')){state.journal=state.journal.filter(v=>v.id!==remove.dataset.removeEntry);save('journal',state.journal);renderJournal();}return;}
 if(t.closest('#export-journal')){exportJournal('json');return;}
 if(t.closest('#export-csv')){exportJournal('csv');return;}
 if(t.closest('#close-chart')){modal.close();return;}
 if(t.closest('#close-help')){sm.close();return;}
 const helpnav=t.closest('[data-help-nav]');if(helpnav){navAfterModal(helpnav.dataset.helpNav);return;}
 if(t.closest('#help-button')){openHelp();return;}
});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-open][role="button"]')){e.preventDefault();openChart(e.target.dataset.open)}});
let searchTimeout;
document.addEventListener('input',e=>{if(e.target.id==='search-chart'){clearTimeout(searchTimeout);state.query=e.target.value;state.limit=18;searchTimeout=setTimeout(()=>rerenderKeepFocus(),170)}});
document.addEventListener('submit',e=>{if(e.target.id!=='journal-form')return;e.preventDefault();let f=e.target;let item={id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,date:f.elements.date.value,chart:f.elements.chart.value,question:f.elements.question.value.trim(),result:f.elements.result.value.trim()};if(!item.question){toast('Scrivi una domanda o un’intenzione.');return;}state.journal.unshift(item);if(save('journal',state.journal)){renderJournal();toast('Annotazione salvata nel diario.')}});
modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});sm.addEventListener('click',e=>{if(e.target===sm)sm.close()});
if(charts.length!==121)console.warn(`Trovate ${charts.length} tavole; attese 121.`);
render();
if('serviceWorker' in navigator&&location.protocol.startsWith('http')){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
})();
