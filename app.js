(()=>{
'use strict';
const charts=window.RC_DATA||[];
const lessons=window.RC_LESSONS||[];
const protocols=window.RC_PROTOCOLS||{};
const course=window.RC_COURSE||[];
const main=document.getElementById('main');
const modal=document.getElementById('chart-modal');
const md=document.getElementById('modal-content');
const sm=document.getElementById('simple-modal');
const smc=document.getElementById('simple-modal-content');
const categories=[...new Set(charts.map(c=>c.category))];
const KEY='rc121-v2:';
const get=(k,def)=>{try{const v=JSON.parse(localStorage.getItem(KEY+k));return v===null?def:v;}catch{return def;}};
const save=(k,v)=>{try{localStorage.setItem(KEY+k,JSON.stringify(v));return true;}catch{toast('Salvataggio locale non disponibile.');return false;}};
const state={view:'home',category:'Tutte',query:'',sort:'number',limit:18,favorites:new Set(get('favorites',[])),studied:new Set(get('studied',[])),journal:get('journal',[]),courseDone:new Set(get('courseDone',[]))};
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
 // Ogni tavola combina una composizione propria (numero, settori e simboli),
 // una grammatica visiva della categoria e parole-guida specifiche della scheda.
 const id=Number(chart.number),cx=320,cy=348;
 const ink='#172e53',gold='#bb8c3a',blue='#52779a',paper='#fffdf7';
 const rand=(v)=>((id*1103515245+v*12345)>>>0)/4294967295;
 const polar=(r,a,x=cx,y=cy)=>point(x,y,r,a);
 const ln=(a,b,color=gold,sw=1.6,dash='')=>`<line x1="${a[0].toFixed(2)}" y1="${a[1].toFixed(2)}" x2="${b[0].toFixed(2)}" y2="${b[1].toFixed(2)}" stroke="${color}" stroke-width="${sw}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
 const path=(d,color=ink,w=2,fill='none')=>`<path d="${d}" stroke="${color}" stroke-width="${w}" fill="${fill}" stroke-linejoin="round" stroke-linecap="round"/>`;
 let art='',labels=chart.labels||[];
 const family=chart.kind;
 const count=labels.length;
 const headline=chart.title;
 const titleSize=headline.length>41?18:headline.length>31?21:24;
 const titleParts=[];let run='';
 for(const w of headline.split(' ')){if((run+' '+w).trim().length>(headline.length>36?29:36)&&run){titleParts.push(run);run=w;}else run=(run+' '+w).trim();}
 if(run)titleParts.push(run);
 const posLabel=(x,y,label,sz=12)=>`<rect x="${(x-48).toFixed(1)}" y="${(y-16).toFixed(1)}" width="96" height="32" rx="11" fill="#fffdf7" stroke="#cfab69" stroke-width="1"/>${textTag(x,y+4,shorten(label,15),sz,ink,'700')}`;
 if(family==='semicircle'){
   const ox=320,oy=505,R=229,ratio=count===4?count:count;
   art+=path(`M 91 ${oy} A ${R} ${R} 0 0 1 549 ${oy}`,ink,3)+ln([84,oy],[556,oy],ink,2);
   art+=path(`M 125 ${oy} A 195 195 0 0 1 515 ${oy}`,gold,2)+path(`M 165 ${oy} A 155 155 0 0 1 475 ${oy}`,gold,1.1);
   const tickCount=count===11?10:count;
   for(let i=0;i<=tickCount;i++){
     const a=Math.PI+i*Math.PI/tickCount;
     art+=ln(polar(i%2?191:181,a,ox,oy),polar(R,a,ox,oy),i%2?gold:ink,i%2?1.3:2);
   }
   labels.forEach((s,i)=>{
     // Le etichette delle scale numeriche sono centrate sui segni graduati;
     // quelle delle tavole a scelta occupano il centro dei settori.
     const a=count===11 ? Math.PI+i*Math.PI/10: Math.PI+(i+.5)*Math.PI/count;
     const lp=polar(count===11?158:count>6?177:202,a,ox,oy);
     art+=textTag(lp[0],lp[1]+3,s,count>9?12:count>6?13:15,ink);
   });
   art+=ring(ox,oy,18,ink,2)+`<circle cx="${ox}" cy="${oy}" r="5" fill="${gold}"/>`;
   art+=textTag(320,554,'PUNTO DI LETTURA',12,blue);
 }else if(family==='radial'){
   const sectors=count,R=228,r=71;
   art+=ring(cx,cy,R,ink,2.7)+ring(cx,cy,R-11,gold,1.2)+ring(cx,cy,r,ink,2);
   const palette=['#b75b5b','#dc9a59','#e0c063','#71a183','#668fb8','#807bb8','#b27cae'];
   for(let i=0;i<sectors;i++){
     const a=-Math.PI/2+2*Math.PI*i/sectors,b=-Math.PI/2+2*Math.PI*(i+1)/sectors,mid=(a+b)/2;
     const aa=polar(r,a),bb=polar(R-12,a),cp=polar(R-12,b),dp=polar(r,b);
     const useColor=id===120||id===119;
     art+=path(`M ${aa.join(' ')} L ${bb.join(' ')} A ${R-12} ${R-12} 0 0 1 ${cp.join(' ')} L ${dp.join(' ')} A ${r} ${r} 0 0 0 ${aa.join(' ')} Z`,gold,1.3,useColor?palette[i%palette.length]+'30':'#f7eedc50');
     const pointLabel=polar((r+R)/2+12,mid);
     art+=textTag(pointLabel[0],pointLabel[1],shorten(labels[i],17),count>6?11.8:13.4,ink);
   }
   art+=`<circle cx="${cx}" cy="${cy}" r="32" fill="#fffaf0" stroke="${gold}" stroke-width="2"/>`;
   art+=`<polygon points="${symmetricStar(cx,cy,19,5+id%3)}" fill="${gold}"/>`;
 }else{
   const styleSeed=id%11; const inner=119+(id%5)*3; const outer=231;
   // Bordi e riferimenti geometrici cambiano realmente tra le tavole.
   art+=ring(cx,cy,outer,ink,2.5)+ring(cx,cy,outer-13,gold,1.2)+ring(cx,cy,inner,gold,1.35);
   for(let i=0;i<24;i++){
      const a=-Math.PI/2+i*Math.PI/12;
      art+=ln(polar(outer-(i%3?5:11),a),polar(outer,a),i%3?gold:ink,i%3?.9:1.8);
   }
   if(family==='spiral'){
      const rev=id===2||id===7?-1:1, turns=2.2+(id%8)*.25,pts=[];
      for(let n=0;n<260;n++){
        let u=n/259,a=-Math.PI/2+rev*u*Math.PI*2*turns,r=9+u*(inner-8);
        const v=polar(r,a);pts.push((n?'L ':'M ')+v[0].toFixed(2)+' '+v[1].toFixed(2));
      }
      art+=path(pts.join(' '),ink,2.8);
      const petals=3+id%5;
      for(let k=0;k<petals;k++){
        const a=k*2*Math.PI/petals+id*.17,v=polar(52+id%3*8,a);
        art+=`<circle cx="${v[0]}" cy="${v[1]}" r="${6+(k+id)%4}" fill="#d5a65c" fill-opacity=".3" stroke="${gold}"/>`;
      }
   }else if(family==='shield'){
      const tip=cy+122+id%14;
      art+=path(`M ${cx-115} ${cy-104} Q ${cx} ${cy-161} ${cx+115} ${cy-104} L ${cx+107} ${cy+40} Q ${cx+75} ${cy+103} ${cx} ${tip} Q ${cx-75} ${cy+103} ${cx-107} ${cy+40} Z`,ink,2.7,'#f6e9d13d');
      art+=path(`M ${cx-84} ${cy-73} Q ${cx} ${cy-111} ${cx+84} ${cy-73} L ${cx+76} ${cy+28} Q ${cx+45} ${cy+75} ${cx} ${cy+92} Q ${cx-45} ${cy+75} ${cx-76} ${cy+28} Z`,gold,1.7);
      const bars=1+id%4;
      for(let k=0;k<bars;k++){let y=cy-62+k*30;art+=ln([cx-48,y],[cx+48,y],k%2?gold:ink,1.5);}
      art+=`<polygon points="${polygon(cx,cy+12,20+id%12,5+id%3)}" fill="none" stroke="${ink}" stroke-width="2"/>`;
   }else if(family==='sun'){
      let rays=10+(id%7)*2;
      for(let i=0;i<rays;i++){
        let a=i*Math.PI*2/rays+(id%3)*.06;
        const ra=i%2?130:147;art+=ln(polar(ra,a),polar(ra+24+(id+i)%8,a),gold,i%2?2:3);
      }
      art+=ring(cx,cy,102+id%15,ink,2.7)+ring(cx,cy,72,gold,1.7);
      art+=`<polygon points="${symmetricStar(cx,cy,45,6+id%5,-Math.PI/2,.72)}" fill="#e7cc8c45" stroke="${ink}" stroke-width="2"/>`;
   }else if(family==='flower'){
      let petals=6+(id%6)*2;
      for(let i=0;i<petals;i++){
        let a=i*360/petals+(id%5)*3;
        art+=`<ellipse cx="${cx}" cy="${cy-79}" rx="${26+id%14}" ry="${77+id%21}" transform="rotate(${a} ${cx} ${cy})" fill="#e1caa225" stroke="${i%2?gold:ink}" stroke-width="1.45"/>`;
      }
      art+=ring(cx,cy,43,ink,2)+ring(cx,cy,25,gold,2);
   }else if(family==='grid'){
      let bw=245,bh=232,ox=cx-bw/2,oy=cy-bh/2;
      art+=`<rect x="${ox}" y="${oy}" width="${bw}" height="${bh}" rx="4" fill="#fff9ed" stroke="${ink}" stroke-width="3"/>`;
      const shifted=11+(id%5)*3;
      art+=ln([cx+shifted-22,oy],[cx+shifted-22,oy+bh],ink,2.2)+ln([ox,cy+id%17-5],[ox+bw,cy+id%17-5],gold,2.4);
      for(let i=0;i<4;i++){
        let px=cx+(i%2?72:-72),py=cy+(i<2?-63:65);
        art+=`<circle cx="${px}" cy="${py}" r="15" fill="${i%2?'#e9d8af':'#dce7f0'}" stroke="${gold}"/>`;
      }
      art+=ln([ox-15,cy],[ox+16,cy],ink,2.4);
   }else if(family==='vesica'){
      let d=48+id%21,R=109+id%23;
      art+=ring(cx-d,cy,R,ink,3)+ring(cx+d,cy,R,gold,3);
      art+=`<polygon points="${polygon(cx,cy,42+id%15,4+id%5,Math.PI/6)}" fill="#e7ce8a30" stroke="${ink}" stroke-width="2"/>`;
      art+=ln([cx-78,cy+105],[cx+78,cy+105],gold,1.6,'5 6');
   }else if(family==='star'){
      const n=5+id%6;
      art+=`<polygon points="${symmetricStar(cx,cy,149,n,-Math.PI/2,.33+id%6*.07)}" fill="#e9d39b39" stroke="${ink}" stroke-width="3"/>`;
      art+=`<polygon points="${polygon(cx,cy,81,n,Math.PI/11)}" fill="none" stroke="${gold}" stroke-width="2"/>`;
      for(let k=0;k<n;k++){let a=k*Math.PI*2/n;art+=ln(polar(66,a),polar(114,a),gold,1.2)}
   }else if(family==='lotus'){
      const petals=7+id%7;
      for(let k=0;k<petals;k++){
        art+=`<ellipse cx="${cx}" cy="${cy-88}" rx="${21+id%13}" ry="${83+id%13}" transform="rotate(${360*k/petals} ${cx} ${cy})" fill="#e8dfbd30" stroke="${ink}" stroke-width="1.7"/>`;
      }
      for(let k=0;k<Math.max(5,petals-3);k++){
        art+=`<ellipse cx="${cx}" cy="${cy-54}" rx="17" ry="52" transform="rotate(${360*k/Math.max(5,petals-3)+8} ${cx} ${cy})" fill="none" stroke="${gold}" stroke-width="1.1"/>`;
      }
      art+=ring(cx,cy,31,ink,1.7);
   }else if(family==='hex'){
      const size=59+id%22, n=4+id%4;
      for(let k=0;k<n;k++){
        art+=`<polygon points="${polygon(cx,cy,26+k*(size/n),6,Math.PI/6+(id%9)*Math.PI/36)}" fill="none" stroke="${k%2?gold:ink}" stroke-width="${k===n-1?2.6:1.5}"/>`;
      }
      for(let i=0;i<6;i++){
        const a=Math.PI*2*i/6,v=polar(109,a);art+=`<circle cx="${v[0]}" cy="${v[1]}" r="${4+id%4}" fill="#fff8e4" stroke="${gold}"/>`;
      }
   }
   // 4 indicatori di lettura individuali fuori dall'area geometrica centrale.
   // Si legge dal numero 1 in alto, in senso orario.
   let positions=[[-151,-151],[151,-151],[151,151],[-151,151]];
   if(family==='grid'){positions=[[-165,-157],[165,-157],[165,157],[-165,157]]}
   for(let i=0;i<Math.min(4,count);i++){
      const [dx,dy]=positions[i];
      art+=posLabel(cx+dx,cy+dy,`${i+1} · ${labels[i]}`,labels[i].length>13?10:11.1);
   }
   art+=`<circle cx="${cx}" cy="${cy}" r="25" fill="#fffdf7" stroke="${ink}" stroke-width="1.7"/>`;
   art+=`<text x="${cx}" y="${cy+5}" font-family="Georgia,serif" font-size="16" font-weight="bold" text-anchor="middle" fill="${ink}">${chart.number}</text>`;
 }
 const titles=titleParts.slice(0,2).map((t,i)=>`<tspan x="320" dy="${i?23:0}">${esc(t)}</tspan>`).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 710" width="640" height="710" role="img" aria-label="Tavola ${chart.number}: ${esc(chart.title)}">
 <rect width="640" height="710" fill="${paper}"/><rect x="17" y="18" width="606" height="673" rx="13" fill="none" stroke="${gold}" stroke-width="2"/>
 <text x="320" y="47" text-anchor="middle" font-size="12" font-family="Arial,sans-serif" letter-spacing="3" fill="${gold}" font-weight="bold">RADIESTESIA COMPLETA</text>
 <text x="320" y="77" text-anchor="middle" font-family="Georgia,serif" font-size="${titleSize}" fill="${ink}">${titles}</text>
 <text x="53" y="118" font-size="12" font-weight="bold" letter-spacing="1" fill="${gold}" font-family="Arial,sans-serif">TAVOLA N° ${chart.number}</text>
 ${art}
 <line x1="72" y1="637" x2="568" y2="637" stroke="${gold}" stroke-width="1.2"/>
 <text x="320" y="662" text-anchor="middle" font-size="12.3" font-weight="bold" font-family="Arial,sans-serif" letter-spacing="1.1" fill="${ink}">SCHEMA DIDATTICO ORIGINALE · ${esc(chart.category).toUpperCase()}</text></svg>`;
}

function cardsHtml(items){return `<div class="cards">${items.map(c=>`<article class="chart-card">
 <div class="chart-art" data-open="${c.id}" role="button" tabindex="0" aria-label="Apri ${esc(c.title)}">
 <span class="chart-number">Nº ${c.number}</span>${svgGraphic(c,'thumb')}<button class="fav-icon ${state.favorites.has(c.id)?'active':''}" type="button" data-fav="${c.id}" aria-label="${state.favorites.has(c.id)?'Rimuovi dai':'Aggiungi ai'} preferiti">${state.favorites.has(c.id)?'♥':'♡'}</button></div>
 <div class="chart-card-body"><span class="chip">${esc(c.category)}</span><h3>${esc(c.title)}</h3><p>${esc(c.purpose)}</p><div class="card-footer"><small>${state.studied.has(c.id)?'✓ Studiato':'◷ '+c.time}</small><button data-open="${c.id}" type="button">Apri la tavola ↗</button></div></div></article>`).join('')}</div>`}
function home(){
 const recommendations=[charts[0],charts[112],charts[113],charts[118],charts[79],charts[100]];
 main.innerHTML=`<section class="hero"><div><span class="micro">IL TUO PERCORSO, PASSO DOPO PASSO</span><h1>121 grafici.<br/><span class="gold">Un metodo da esplorare.</span></h1><p>Tavole originali stampabili, indicazioni concrete e attività guidate in italiano. Esplora i grafici, annota le tue osservazioni e ritrova quelli che usi di più.</p><div class="hero-actions"><button class="btn btn-primary" data-nav="library">Esplora i 121 grafici →</button><button class="btn btn-secondary" data-nav="guide">Inizia dal metodo</button></div></div><div class="hero-illustration"><img src="assets/icon-512.png" alt="Emblema Radiestesia Completa"/></div></section>
 <div class="statbar"><div class="stat"><i>◉</i><div><strong>${charts.length}</strong><small>tavole illustrate</small></div></div><div class="stat"><i>✧</i><div><strong>${state.studied.size}</strong><small>tavole studiate</small></div></div><div class="stat"><i>♡</i><div><strong>${state.favorites.size}</strong><small>preferiti salvati</small></div></div></div>
 <div class="study-callout"><div><span class="micro">NOVITÀ · PERCORSO GUIDATO</span><h2>Impara con 12 esercizi progressivi</h2><p>Dal pendolo alle tavole di lettura: svolgi attività verificabili e salva i progressi sul dispositivo. ${state.courseDone.size}/12 tappe completate.</p></div><button class="btn btn-primary" data-nav="guide">Apri il percorso →</button></div><div class="section-head"><div><span class="micro">SELEZIONE PER COMINCIARE</span><h2>Da dove vuoi iniziare?</h2></div><button class="text-link" data-nav="library">Biblioteca completa →</button></div>${cardsHtml(recommendations)}
 <div class="section-head"><div><span class="micro">CONTENUTO INCLUSO</span><h2>Gli strumenti dell'app</h2></div></div>
 <div class="resource-grid"><section class="resource"><div class="icon">☷</div><h3>Metodo di utilizzo</h3><p>Sette lezioni: preparazione, domande, convenzioni, lettura e verifica delle osservazioni.</p><button class="btn btn-quiet" data-nav="guide">Apri la guida →</button></section><section class="resource"><div class="icon">▤</div><h3>Diario di pratica</h3><p>Registra grafico, domanda, osservazione e verifica. I tuoi dati restano nel browser che stai usando.</p><button class="btn btn-quiet" data-nav="journal">Apri il diario →</button></section></div>${notice}`;
}
function getFiltered(favOnly=false){let set=charts.filter(c=>(!favOnly||state.favorites.has(c.id))&&(state.category==='Tutte'||c.category===state.category));let q=normalize(state.query.trim());if(q)set=set.filter(c=>normalize([c.title,c.category,c.purpose,c.exercise,...c.labels,...c.tags].join(' ')).includes(q));if(state.sort==='title')set.sort((a,b)=>a.title.localeCompare(b.title,'it'));return set;}
function filterUI(favOnly=false){return `<div class="filters"><label class="search"><span>⌕</span><input id="search-chart" aria-label="Cerca grafici" type="search" placeholder="Cerca per nome, funzione o tema…" value="${esc(state.query)}" autocomplete="off"/></label><button type="button" class="filter-btn" id="sort-chart">${state.sort==='number'?'Nº 001–121':'A–Z'} ↕</button></div><div class="filter-strip"><button class="filter-btn ${state.category==='Tutte'?'active':''}" data-category="Tutte">Tutte</button>${categories.map(cat=>`<button class="filter-btn ${state.category===cat?'active':''}" data-category="${esc(cat)}">${esc(cat)}</button>`).join('')}</div>`}
function library(favOnly=false){const set=getFiltered(favOnly);main.innerHTML=`<div class="page-header"><span class="micro">${favOnly?'LA TUA SELEZIONE':'10 CATEGORIE TEMATICHE'}</span><h1>${favOnly?'I tuoi preferiti':'Biblioteca dei 121 grafici'}</h1><p>${favOnly?'Ritrova qui le tavole che hai scelto di salvare.':'Ogni tavola include uno schema originale, uno scopo preciso, un esercizio concreto e strumenti per stampare o esportare il disegno.'}</p></div>${filterUI(favOnly)}<div class="result-count">${set.length} ${set.length===1?'grafico trovato':'grafici trovati'}${set.length>state.limit?` · primi ${state.limit} mostrati`:''}</div>${set.length?cardsHtml(set.slice(0,state.limit))+(set.length>state.limit?`<div class="load-more"><button class="btn btn-secondary" id="load-more">Mostra altri grafici (${set.length-state.limit} rimasti) ↓</button></div>`:''):`<div class="empty-state"><strong>${favOnly&&state.favorites.size===0?'Nessun preferito ancora':'Nessun grafico trovato'}</strong><p>${favOnly&&state.favorites.size===0?'Tocca il cuore su una tavola per salvarla.':'Prova un altro termine o seleziona tutte le categorie.'}</p></div>`}${notice}`;
}
function guide(){
 const done=state.courseDone.size;
 main.innerHTML=`<header class="page-header"><span class="micro">PERCORSO GUIDATO · 12 TAPPE</span><h1>Impara con metodo</h1><p>Dalla preparazione alla prima sessione documentata. Ogni tappa include un obiettivo, passi concreti, una verifica e una tavola associata.</p></header>
 <div class="course-progress"><div class="course-progress-copy"><strong>${done} di ${course.length} tappe completate</strong><span>Il tuo percorso resta salvato su questo dispositivo.</span></div><div class="progress-bar"><div style="width:${Math.round(done*100/(course.length||1))}%"></div></div></div>
 <div class="course-list">${course.map((item,i)=>`<article class="course-item ${state.courseDone.has(i)?'is-done':''}"><div class="course-top"><div class="course-number">${String(i+1).padStart(2,'0')}</div><div class="course-title"><span class="micro">TAPPA ${i+1} · ${esc(item.time)}</span><h3>${esc(item.title)}</h3><p>${esc(item.goal)}</p></div></div><details ${i===0&&!state.courseDone.has(0)?'open':''}><summary>Apri attività e verifica <span>⌄</span></summary><ol>${item.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><div class="course-test"><strong>Verifica da registrare</strong><p>${esc(item.test)}</p></div><div class="button-group"><button class="btn btn-secondary" type="button" data-open="${item.link}">Apri il grafico →</button><button class="btn ${state.courseDone.has(i)?'btn-quiet':'btn-primary'}" type="button" data-course-done="${i}">${state.courseDone.has(i)?'✓ Completata · annulla':'Segna come completata ✓'}</button></div></details></article>`).join('')}</div>
 <div class="section-head"><div><span class="micro">PER APPROFONDIRE</span><h2>7 letture essenziali</h2></div></div><section>${lessons.map((l,i)=>`<details class="lesson"><summary><span>${esc(l.title)}</span><small>${esc(l.time)}</small></summary><p>${esc(l.content)}</p></details>`).join('')}</section><div class="button-group"><button class="btn btn-secondary" data-nav="backup">Salva i tuoi progressi →</button><button class="btn btn-secondary" data-nav="journal">Apri il diario</button></div>${notice}`;
}
function renderJournal(){main.innerHTML=`<header class="page-header"><span class="micro">REGISTRO PERSONALE</span><h1>Diario di pratica</h1><p>Una sessione ben documentata distingue domande, osservazioni e verifiche. Le note rimangono in questo dispositivo: puoi esportarle come file.</p></header><div class="journal-layout"><section class="panel"><h3>Nuova annotazione</h3><form id="journal-form" class="form-grid"><div class="field"><label for="jdate">Data della sessione</label><input id="jdate" name="date" type="date" required value="${new Date().toLocaleDateString('en-CA')}"/></div><div class="field"><label for="jchart">Grafico utilizzato</label><select id="jchart" name="chart" required>${charts.map(c=>`<option value="${c.id}">Nº ${c.number} · ${esc(c.title)}</option>`).join('')}</select></div><div class="field"><label for="jquestion">Domanda o intenzione</label><textarea id="jquestion" name="question" maxlength="1200" placeholder="Scrivi una domanda delimitata o il tema della tua riflessione…" required></textarea></div><div class="field"><label for="jresult">Osservazione e verifica</label><textarea id="jresult" name="result" maxlength="2400" placeholder="Che cosa hai osservato? Puoi confrontarlo con fatti verificabili?"></textarea></div><div class="form-action"><button class="btn btn-primary" type="submit">Salva nel diario</button></div></form></section><section class="panel"><h3>Le tue sessioni (${state.journal.length})</h3><div id="entries">${state.journal.length?state.journal.map(x=>`<article class="entry"><div class="entry-top"><div><strong>${esc(chartById(x.chart)?.title||'Grafico non trovato')}</strong><time>${esc(x.date)}</time></div><button type="button" data-remove-entry="${esc(x.id)}">Elimina</button></div><p>${esc(x.question)}</p>${x.result?`<small>Osservazione / verifica</small><p>${esc(x.result)}</p>`:''}</article>`).join(''):'<div class="empty-state"><strong>Il diario è pronto.</strong><p>La prima registrazione apparirà qui.</p></div>'}</div><div class="journal-tools"><button class="btn btn-primary" data-nav="backup">Backup / ripristino</button><button class="btn btn-secondary" id="export-journal" ${state.journal.length?'':'disabled'}>↓ Esporta JSON</button><button class="btn btn-secondary" id="export-csv" ${state.journal.length?'':'disabled'}>↓ Esporta CSV</button></div></section></div>${notice}`;}
function openChart(id){
 const c=chartById(id);if(!c)return;
 const info=protocols[id];
 if(!info){toast('Scheda non disponibile.');return;}
 const list=info.steps.map((s,i)=>`<li><strong>Passo ${i+1}.</strong> ${esc(s)}</li>`).join('');
 md.innerHTML=`<header class="modal-head"><div><span class="micro">TAVOLA Nº ${c.number} · ${esc(c.category)}</span><h2>${esc(c.title)}</h2><p>${esc(c.purpose)}</p></div><button type="button" class="modal-close" aria-label="Chiudi" id="close-chart">×</button></header>
 <div class="modal-grid"><div><div class="modal-graphic" id="print-graphic">${svgGraphic(c)}</div><div class="graphic-tools"><button class="btn btn-primary" data-download="${c.id}">↓ Scarica PNG</button><button class="btn btn-secondary" data-print="${c.id}">▤ Stampa / PDF</button><button class="btn btn-quiet" data-fav="${c.id}">${state.favorites.has(c.id)?'♥ Nei preferiti':'♡ Salva preferito'}</button></div><div class="print-note">Radiestesia Completa · Nº ${c.number} · ${esc(c.title)} · materiale simbolico originale</div></div>
 <div class="guide-detail"><span class="pill">${esc(c.level)} · ${esc(c.time)} · pratica guidata</span><h3>Che cos'è e a cosa serve</h3><p>${esc(c.purpose)}</p><h3>Un esempio reale</h3><p class="example">${esc(info.scenario)}</p><h3>Prepara il materiale</h3><p>${esc(info.tools)}</p><h3>Come utilizzare questo grafico</h3><ol class="protocol-steps">${list}</ol><h3>Domanda utile per la sessione</h3><blockquote class="reading-quote">${esc(c.question)}</blockquote><h3>Lettura della tavola</h3><p>${esc(info.reading)}</p><h3>Che cosa verificare</h3><p>${esc(info.verification)}</p><h3>Nota pratica</h3><p>${esc(info.tips)}</p><p class="warning">${esc(info.safety)}</p><div class="button-group"><button class="btn btn-secondary" data-studied="${c.id}">${state.studied.has(c.id)?'✓ Segnato come studiato':'✓ Segna come studiato'}</button><button class="btn btn-quiet" data-journal-chart="${c.id}">Registra nel diario →</button></div></div></div>`;
 modal.showModal();
}
function renderBackup(){
 main.innerHTML=`<header class="page-header"><span class="micro">DATI PERSONALI · CONTROLLO LOCALE</span><h1>Backup e ripristino</h1><p>Porta con te preferiti, grafici studiati, tappe completate e annotazioni. Nessun dato viene inviato a un server: il backup è un file JSON salvato sul tuo dispositivo.</p></header>
 <div class="backup-grid"><section class="panel backup-panel"><span class="backup-symbol">↓</span><h3>Esporta tutto</h3><p>Un unico file per salvare ${state.favorites.size} preferiti, ${state.studied.size} grafici studiati, ${state.courseDone.size} tappe e ${state.journal.length} note.</p><button class="btn btn-primary" id="export-backup">Scarica il backup completo</button></section><section class="panel backup-panel"><span class="backup-symbol">↑</span><h3>Ripristina un backup</h3><p>Se hai cambiato dispositivo, importa qui il file esportato. Le informazioni vengono unite a quelle già presenti.</p><input id="backup-file" type="file" accept="application/json,.json" class="sr-only"/><button class="btn btn-secondary" id="import-backup">Scegli il file JSON</button></section></div>
 <div class="notice"><strong>Ricorda:</strong> la pubblicazione di una nuova versione sullo stesso indirizzo non cancella normalmente i dati del browser. Se svuoti la cache e i dati del sito, usi la navigazione privata o cambi browser/dispositivo, esporta prima un backup. Non caricare il file su siti pubblici: può contenere appunti personali.</div><button class="btn btn-quiet" data-nav="journal">← Torna al diario</button>`;
}
function exportBackup(){
 const packageData={app:'radiestesia-completa',format:2,exportedAt:new Date().toISOString(),favorites:[...state.favorites],studied:[...state.studied],courseDone:[...state.courseDone],journal:state.journal};
 downloadBlob(new Blob([JSON.stringify(packageData,null,2)],{type:'application/json'}),`backup-radiestesia-${new Date().toLocaleDateString('en-CA')}.json`);
 toast('Backup completo scaricato.');
}
async function importBackup(file){
 if(!file)return;
 if(file.size>3*1024*1024){toast('Backup troppo grande.');return;}
 try{
  const data=JSON.parse(await file.text());
  if(data.app!=='radiestesia-completa'||data.format!==2||!Array.isArray(data.favorites)||!Array.isArray(data.journal))throw Error('Formato non valido');
  const validChart=id=>typeof id==='string'&&!!chartById(id);
  const f=[...new Set([...state.favorites,...data.favorites.filter(validChart)])];
  const studied=[...new Set([...state.studied,...(Array.isArray(data.studied)?data.studied:[]).filter(validChart)])];
  const courseDone=[...new Set([...state.courseDone,...(Array.isArray(data.courseDone)?data.courseDone:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<course.length)])];
  const validEntry=e=>e&&typeof e==='object'&&typeof e.id==='string'&&e.id.length<100&&validChart(e.chart)&&typeof e.question==='string'&&typeof e.date==='string';
  const entries=new Map(state.journal.filter(validEntry).map(e=>[e.id,e]));
  data.journal.filter(validEntry).slice(0,1000).forEach(e=>entries.set(e.id,{id:e.id,date:e.date.slice(0,16),chart:e.chart,question:e.question.slice(0,1200),result:String(e.result||'').slice(0,2400)}));
  if(!confirm('Unire i dati del backup ai progressi già presenti in questo dispositivo?'))return;
  save('favorites',f);save('studied',studied);save('courseDone',courseDone);save('journal',[...entries.values()]);
  state.favorites=new Set(f);state.studied=new Set(studied);state.courseDone=new Set(courseDone);state.journal=[...entries.values()];
  render();toast('Backup importato correttamente.');
 }catch(err){toast('Il file non è un backup valido di questa app.');}
}
function setView(view){state.view=view;state.category='Tutte';state.query='';state.sort='number';state.limit=18;render();window.scrollTo({top:0,behavior:'instant'});}
function render(){document.querySelectorAll('[data-view]').forEach(el=>{el.classList.toggle('active',el.dataset.view===state.view);if(el.dataset.view===state.view)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current')});if(state.view==='home')home();else if(state.view==='library')library(false);else if(state.view==='favorites')library(true);else if(state.view==='guide')guide();else if(state.view==='journal')renderJournal();else if(state.view==='backup')renderBackup();}
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
 const cd=t.closest('[data-course-done]');if(cd){const i=Number(cd.dataset.courseDone);if(state.courseDone.has(i))state.courseDone.delete(i);else state.courseDone.add(i);save('courseDone',[...state.courseDone]);guide();toast('Percorso aggiornato.');return;}
 if(t.closest('#export-backup')){exportBackup();return;}
 if(t.closest('#import-backup')){document.getElementById('backup-file')?.click();return;}
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
document.addEventListener('change',e=>{if(e.target.id==='backup-file')importBackup(e.target.files?.[0]);});
document.addEventListener('submit',e=>{if(e.target.id!=='journal-form')return;e.preventDefault();let f=e.target;let item={id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,date:f.elements.date.value,chart:f.elements.chart.value,question:f.elements.question.value.trim(),result:f.elements.result.value.trim()};if(!item.question){toast('Scrivi una domanda o un’intenzione.');return;}state.journal.unshift(item);if(save('journal',state.journal)){renderJournal();toast('Annotazione salvata nel diario.')}});
modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});sm.addEventListener('click',e=>{if(e.target===sm)sm.close()});
if(charts.length!==121)console.warn(`Trovate ${charts.length} tavole; attese 121.`);
render();
if('serviceWorker' in navigator&&location.protocol.startsWith('http')){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
})();
