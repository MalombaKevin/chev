/* =========================================================
   Biochevin — shared site script (every page loads this)
   ========================================================= */
(function(){
'use strict';

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

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

/* ---------------- Discourage inspect / view source ----------------
   Deterrent only: blocks the right-click menu and the usual DevTools /
   view-source shortcuts. It cannot truly hide the code (browser menus,
   disabled JS or fetching the URL still reveal it). */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  const mod = e.ctrlKey || e.metaKey;
  if (
    e.key === 'F12' ||
    (mod && e.shiftKey && ['i','j','c'].includes(k)) ||   // DevTools, console, element picker
    (e.metaKey && e.altKey && ['i','j','c','u'].includes(k)) || // macOS equivalents
    (mod && ['u','s'].includes(k))                      // view source, save page
  ){ e.preventDefault(); e.stopPropagation(); }
}, true);
document.addEventListener('dragstart', e => { if(e.target.tagName === 'IMG') e.preventDefault(); });

/* ---------------- Year ---------------- */
$$('[data-year]').forEach(el=>el.textContent = new Date().getFullYear());

/* ---------------- Modal ---------------- */
const modal = $('#modal');
function openModal(html){ $('#modalBody').innerHTML = html; modal.classList.add('open'); $('#modalClose').focus(); }
function closeModal(){ modal.classList.remove('open'); }
$('#modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });

document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

/* ---------------- Chat widget (floating logo button → WhatsApp-style card) ---------------- */
const ICONS = {
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>',
  gmail: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#4caf50" d="M45 16.2l-5 2.75-5 4.75V40h7c1.657 0 3-1.343 3-3V16.2z"/><path fill="#1e88e5" d="M3 16.2l3.614 1.71L13 23.7V40H6c-1.657 0-3-1.343-3-3V16.2z"/><path fill="#e53935" d="M35 11.2 24 19.45 13 11.2 12 17l1 6.7 11 8.25 11-8.25 1-6.7z"/><path fill="#c62828" d="M3 12.298V16.2l10 7.5V11.2L9.876 8.859A4.3 4.3 0 0 0 7.298 8C4.924 8 3 9.924 3 12.298z"/><path fill="#fbc02d" d="M45 12.298V16.2l-10 7.5V11.2l3.124-2.341A4.3 4.3 0 0 1 40.702 8C43.076 8 45 9.924 45 12.298z"/></svg>'
};
const CONTACTS = [
  { cls:'x',     icon:ICONS.x,     label:'Biochevin on X', sub:'@biochevin',             href:'https://x.com/biochevin' },
  { cls:'wa',    icon:ICONS.wa,    label:'WhatsApp',       sub:'+254 759 700 444',       href:'https://wa.me/254759700444' },
  { cls:'gmail', icon:ICONS.gmail, label:'Gmail',          sub:'kevinmalomba@gmail.com', href:'mailto:kevinmalomba@gmail.com' }
];
const WELCOME = 'Welcome to Biochevin,';
const STATUS  = 'Finding Fountain of Youth';

const fab = document.createElement('button');
fab.type = 'button'; fab.className = 'chat-fab';
fab.setAttribute('aria-label', 'Chat with Biochevin'); fab.setAttribute('aria-expanded', 'false'); fab.setAttribute('aria-controls', 'chatBox');
fab.innerHTML = '<img src="assets/images/biochevin-192.png" alt="">';

const chat = document.createElement('div');
chat.className = 'chat'; chat.id = 'chatBox';
chat.setAttribute('role', 'dialog'); chat.setAttribute('aria-label', 'Biochevin chat');
chat.innerHTML = `
  <div class="chat-head">
    <img class="chat-avatar" src="assets/images/biochevin-192.png" alt="">
    <div class="chat-who"><b>Biochevin</b><span class="chat-status">${STATUS}</span></div>
    <button type="button" class="chat-close" aria-label="Close chat">×</button>
  </div>
  <div class="chat-body">
    <div class="chat-day">Today</div>
    <div class="chat-typing" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="chat-msg" hidden><span class="chat-text" aria-live="polite"></span><time class="chat-time"></time></div>
    <div class="chat-links" hidden>${CONTACTS.map(c=>`
      <a class="chat-link ${c.cls}" href="${c.href}"${c.href.startsWith('http')?' target="_blank" rel="noopener"':''}>
        <span class="chat-ic">${c.icon}</span><span><b>${c.label}</b><small>${c.sub}</small></span></a>`).join('')}
    </div>
  </div>`;
document.body.append(fab, chat);

const cStatus = $('.chat-status', chat), cTyping = $('.chat-typing', chat), cMsg = $('.chat-msg', chat),
      cText = $('.chat-text', chat), cTime = $('.chat-time', chat), cLinks = $('.chat-links', chat);
let chatTimers = [];
const later = (fn, ms) => chatTimers.push(setTimeout(fn, ms));
const stopTimers = () => { chatTimers.forEach(clearTimeout); chatTimers = []; };

function playWelcome(){
  stopTimers();
  const d = new Date();
  cTime.textContent = String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  cText.textContent = '';
  if(REDUCED){
    cTyping.hidden = true; cMsg.hidden = false; cLinks.hidden = false;
    cText.textContent = WELCOME; cStatus.textContent = STATUS; return;
  }
  cMsg.hidden = true; cLinks.hidden = true; cTyping.hidden = false;
  cStatus.textContent = 'typing…';
  later(() => {
    cTyping.hidden = true; cMsg.hidden = false; cMsg.classList.add('typing');
    [...WELCOME].forEach((ch, i) => later(() => { cText.textContent += ch; }, i * 70));
    later(() => { cMsg.classList.remove('typing'); cStatus.textContent = STATUS; cLinks.hidden = false; }, WELCOME.length * 70 + 250);
  }, 1100);
}
function openChat(){
  chat.classList.add('open'); fab.classList.add('open'); fab.setAttribute('aria-expanded', 'true');
  playWelcome(); $('.chat-close', chat).focus();
}
function closeChat(){
  chat.classList.remove('open'); fab.classList.remove('open'); fab.setAttribute('aria-expanded', 'false');
  stopTimers();
}
fab.addEventListener('click', () => chat.classList.contains('open') ? closeChat() : openChat());
$('.chat-close', chat).addEventListener('click', () => { closeChat(); fab.focus(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape' && chat.classList.contains('open')){ closeChat(); fab.focus(); } });
document.addEventListener('click', e => { if(chat.classList.contains('open') && !chat.contains(e.target) && !fab.contains(e.target)) closeChat(); });

/* ---------------- View toggles (Home, Research, Pioneers) ---------------- */
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
  // deep link: research.html#publications, pioneers.html#institutions
  const fromHash = () => { const h = location.hash.slice(1); if(views.includes(h)) show(h, false); };
  fromHash();
  window.addEventListener('hashchange', fromHash);
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

/* ---------------- Search + card modals (Pioneers) ---------------- */
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

})();
