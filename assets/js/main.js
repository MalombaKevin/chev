/* =========================================================
   Biochevin — shared site script (every page loads this)
   ========================================================= */
(function(){
'use strict';

/* Sitemap — used to build the mobile section sheets */
const SITEMAP = [
  {
    "key": "research",
    "label": "Research",
    "file": "research.html",
    "intro": "Where our science happens — the questions we ask, the studies we run and the results we share.",
    "pages": [
      {
        "file": "research-areas.html",
        "label": "Research Areas"
      },
      {
        "file": "active-studies.html",
        "label": "Active Studies"
      },
      {
        "file": "publications.html",
        "label": "Publications"
      },
      {
        "file": "research-updates.html",
        "label": "Research Updates"
      }
    ]
  },
  {
    "key": "pioneers",
    "label": "Pioneers",
    "file": "pioneers.html",
    "intro": "The scientists and institutions leading the effort to understand and slow aging.",
    "pages": [
      {
        "file": "individuals.html",
        "label": "Individuals"
      },
      {
        "file": "institutions.html",
        "label": "Institutions"
      }
    ]
  },
  {
    "key": "learn",
    "label": "Learn",
    "file": "learn.html",
    "intro": "Plain-language guides to the biology of aging and the tools used to study it.",
    "pages": [
      {
        "file": "discoveries.html",
        "label": "Discoveries"
      },
      {
        "file": "genes-pathways.html",
        "label": "Genes & Pathways"
      },
      {
        "file": "molecules.html",
        "label": "Molecules"
      },
      {
        "file": "technologies.html",
        "label": "Technologies"
      },
      {
        "file": "aging-topics.html",
        "label": "Aging Topics"
      }
    ]
  },
  {
    "key": "about",
    "label": "About",
    "file": "about.html",
    "intro": "Who we are, who we work with, and how to reach us.",
    "pages": [
      {
        "file": "mission.html",
        "label": "Mission"
      },
      {
        "file": "team.html",
        "label": "Team"
      },
      {
        "file": "partners.html",
        "label": "Partners"
      },
      {
        "file": "contact.html",
        "label": "Contact"
      }
    ]
  }
];

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

const here = document.body.dataset.page || 'index.html';

/* ---------------- DNA helix (hero backgrounds) ---------------- */
const NS = 'http://www.w3.org/2000/svg';
const helixes = [];
$$('.helix-bg').forEach(svg=>{
  svg.setAttribute('viewBox','0 0 1200 400');
  svg.setAttribute('preserveAspectRatio','xMidYMid slice');
  const g = document.createElementNS(NS,'g');
  g.setAttribute('transform','rotate(-10 600 200)');
  const nodes = [];
  for(let i=0;i<46;i++){
    const x = -90 + i*30;
    const l = document.createElementNS(NS,'line'),
          a = document.createElementNS(NS,'circle'),
          b = document.createElementNS(NS,'circle');
    l.setAttribute('x1',x); l.setAttribute('x2',x);
    l.setAttribute('stroke','rgba(147,163,189,.28)'); l.setAttribute('stroke-width','2');
    a.setAttribute('cx',x); a.setAttribute('fill','#3ddbb4');
    b.setAttribute('cx',x); b.setAttribute('fill','#f5b95a');
    g.append(l,a,b); nodes.push([l,a,b]);
  }
  svg.appendChild(g);
  helixes.push(nodes);
});
let t = 0;
function tick(){
  helixes.forEach(nodes=>nodes.forEach(([l,a,b],i)=>{
    const ang = t + i*0.32, s = Math.sin(ang), d = (Math.cos(ang)+1)/2;
    const y1 = 200 + s*120, y2 = 200 - s*120;
    l.setAttribute('y1',y1); l.setAttribute('y2',y2);
    a.setAttribute('cy',y1); a.setAttribute('r',4+d*6);     a.setAttribute('opacity',.3+d*.7);
    b.setAttribute('cy',y2); b.setAttribute('r',4+(1-d)*6); b.setAttribute('opacity',.3+(1-d)*.7);
  }));
  t += 0.012;
  if(!REDUCED && helixes.length && window.requestAnimationFrame) requestAnimationFrame(tick);
}
tick();

/* ---------------- Stat counters (home) ---------------- */
if(!REDUCED && window.requestAnimationFrame){
  $$('[data-count]').forEach(el=>{
    const end = +el.dataset.count; let n = 0; const step = Math.max(1, Math.ceil(end/60));
    const run = () => { n = Math.min(end, n+step); el.textContent = n+'+'; if(n<end) requestAnimationFrame(run); };
    run();
  });
}

/* ---------------- Year ---------------- */
$$('[data-year]').forEach(el=>el.textContent = new Date().getFullYear());

/* ---------------- Modal ---------------- */
const modal = $('#modal');
function openModal(html){ $('#modalBody').innerHTML = html; modal.classList.add('open'); $('#modalClose').focus(); }
function closeModal(){ modal.classList.remove('open'); }
$('#modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });

/* ---------------- Mobile section sheet ---------------- */
const sheet = $('#sheet'), backdrop = $('#sheetBackdrop');
let sheetKey = null;
function openSheet(key){
  const s = SITEMAP.find(x=>x.key===key); if(!s) return;
  sheetKey = key;
  const links = [{file:s.file,label:'Overview'}, ...s.pages];
  sheet.innerHTML = `<h4>${s.label}</h4><p class="muted">${s.intro}</p>
    <div class="sheet-links">${links.map(p=>`<a href="${p.file}"${p.file===here?' class="current" aria-current="page"':''}>${p.label}<span>→</span></a>`).join('')}</div>`;
  sheet.classList.add('open'); backdrop.classList.add('open');
  $$('.bottom-nav .bn').forEach(b=>b.classList.toggle('open', b.dataset.key===key));
}
function closeSheet(){
  sheetKey = null;
  sheet.classList.remove('open'); backdrop.classList.remove('open');
  $$('.bottom-nav .bn').forEach(b=>b.classList.remove('open'));
}
$$('.bottom-nav button.bn').forEach(b=>b.addEventListener('click', ()=> sheetKey===b.dataset.key ? closeSheet() : openSheet(b.dataset.key)));
backdrop.addEventListener('click', closeSheet);
document.addEventListener('keydown', e => { if(e.key==='Escape'){ closeSheet(); closeModal(); } });

/* ---------------- View toggles (Research, Pioneers) ---------------- */
$$('[data-toggle]').forEach(group=>{
  const btns = $$('[data-view]', group);
  const views = btns.map(b=>b.dataset.view);
  const show = (view, push) => {
    btns.forEach(b=>{ const on = b.dataset.view===view; b.classList.toggle('on',on); b.setAttribute('aria-selected',on); });
    views.forEach(v=>{ const p = $(`[data-panel="${v}"]`); if(p) p.hidden = v!==view; });
    if(push){ try{ history.replaceState(null,'','#'+view); }catch(e){} }
  };
  btns.forEach(b=>b.addEventListener('click', ()=>show(b.dataset.view, true)));
  // arrow keys between tabs
  group.addEventListener('keydown', e=>{
    if(e.key!=='ArrowRight' && e.key!=='ArrowLeft') return;
    const i = btns.indexOf(document.activeElement); if(i<0) return;
    const n = btns[(i + (e.key==='ArrowRight'?1:btns.length-1)) % btns.length];
    n.focus(); n.click();
  });
  // deep link: research.html#timeline, pioneers.html#institutions
  const fromHash = location.hash.slice(1);
  if(views.includes(fromHash)) show(fromHash, false);
});

/* ---------------- Active studies filter ---------------- */
$$('[data-status-filter]').forEach(bar=>{
  const list = $('[data-status-list]');
  $$('.chip', bar).forEach(c=>c.addEventListener('click', ()=>{
    $$('.chip', bar).forEach(x=>x.classList.toggle('on', x===c));
    $$('[data-status]', list).forEach(card=>card.hidden = !(c.dataset.f==='All' || card.dataset.status===c.dataset.f));
  }));
});

/* ---------------- Publications filter ---------------- */
if($('[data-pub-filter]')){
  const q = $('#pubSearch'), y = $('#pubYear'), ty = $('#pubType');
  const run = () => {
    const term = q.value.trim().toLowerCase(); let shown = 0;
    $$('[data-pub-list] .pub').forEach(r=>{
      const ok = (!y.value || r.dataset.year===y.value) && (!ty.value || r.dataset.type===ty.value) && r.dataset.text.includes(term);
      r.hidden = !ok; if(ok) shown++;
    });
    $('[data-pub-empty]').hidden = shown>0;
  };
  [q,y,ty].forEach(el=>el.addEventListener('input', run));
}

/* ---------------- Search + card modals (individuals, institutions) ---------------- */
$$('[data-search-input]').forEach(input=>{
  const scope = input.closest('section');
  input.addEventListener('input', ()=>{
    const term = input.value.trim().toLowerCase(); let shown = 0;
    $$('[data-search]', scope).forEach(c=>{ const ok = c.dataset.search.includes(term); c.hidden = !ok; if(ok) shown++; });
    const empty = $('[data-search-empty]', scope); if(empty) empty.hidden = shown>0;
  });
});
$$('[data-modal]').forEach(card=>{
  const open = () => openModal($('template', card).innerHTML);
  card.addEventListener('click', open);
  card.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); open(); } });
});

/* ---------------- Contact form ---------------- */
const form = $('#contactForm');
if(form){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const note = $('#contactNotice');
    if(!form.checkValidity()){
      note.textContent = 'Please fill in your name, a valid email and a message.';
      note.style.display = 'block'; return;
    }
    const n = form.elements.name.value.trim();
    note.textContent = `Thanks${n ? ', ' + n : ''}! We'll get back to you within 2 working days.`;
    note.style.display = 'block';
    form.reset();
  });
}

})();
