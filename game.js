/* All game text lives in story.js. This file is the game engine and maps. */

const TS=16, COLS=10, ROWS=9, W=160, H=144, S=4;
const cv=document.getElementById('game');
cv.width=W*S; cv.height=H*S;
const ctx=cv.getContext('2d');
ctx.setTransform(S,0,0,S,0,0);
ctx.imageSmoothingEnabled=false;
const FONT='"Courier New", Courier, monospace';
function R(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
function T(s,x,y,size,c,align){ctx.fillStyle=c;ctx.font='bold '+size+'px '+FONT;ctx.textAlign=align||'center';ctx.textBaseline='top';ctx.fillText(s,x,y);}
const lerp=(a,b,t)=>a+(b-a)*t;
let time=0;
const blink=()=>true;
const fill=(t,v)=>t.replace(/\{(\w+)\}/g,(_,k)=>v[k]);
const meta=k=>{const S=STORY.stages[k];return{key:k,date:S.date,title:S.title,caption:S.caption};}; // decorative animation is intentionally static

/* ---------------- characters ---------------- */
const KAT={hair:'#1c1720',shirt:'#c95b7a',long:true};
const KAT_BANGS={hair:'#1c1720',bangs:'#b3202e',shirt:'#c95b7a',long:true};
const KAT_HOODIE={hair:'#1c1720',shirt:'#8b6b52',long:true};
const DAN={hair:'#e3c063',shirt:'#3b6ea8'};
const WAITRESS={hair:'#b8743a',shirt:'#222222',apron:true};
const ink='#2b2230';

function drawChar(x,y,dir,frame,o){
  x=Math.round(x);y=Math.round(y);
  const skin='#f3c9a8',hair=o.hair,sh=o.shirt,pants=o.pants||'#3a3a4a';
  R(x+3,y+14,10,2,'rgba(0,0,0,0.2)');
  R(x+5,y+12,2,frame===1?2:3,pants);R(x+9,y+12,2,frame===2?2:3,pants);
  R(x+4,y+8,8,5,sh);R(x+3,y+9,1,3,sh);R(x+12,y+9,1,3,sh);
  R(x+3,y+12,1,1,skin);R(x+12,y+12,1,1,skin);
  if(o.apron&&dir!=='up')R(x+5,y+9,6,4,'#ffffff');
  R(x+4,y+1,8,7,skin);
  if(dir==='up'){R(x+3,y,10,8,hair);if(o.long)R(x+3,y+8,10,4,hair);}
  else if(dir==='down'){
    R(x+3,y,10,3,hair);R(x+3,y+3,1,3,hair);R(x+12,y+3,1,3,hair);
    if(o.long){R(x+2,y+2,2,9,hair);R(x+12,y+2,2,9,hair);}else R(x+5,y+3,3,1,hair);
    if(o.bangs)R(x+4,y+2,8,2,o.bangs);
    R(x+6,y+5,1,1,ink);R(x+9,y+5,1,1,ink);
  }else{
    const left=dir==='left';
    R(x+3,y,10,3,hair);
    if(left){R(x+9,y+3,4,4,hair);if(o.long)R(x+9,y+3,4,9,hair);if(o.bangs)R(x+4,y+2,5,2,o.bangs);R(x+5,y+5,1,1,ink);}
    else{R(x+3,y+3,4,4,hair);if(o.long)R(x+3,y+3,4,9,hair);if(o.bangs)R(x+7,y+2,5,2,o.bangs);R(x+10,y+5,1,1,ink);}
  }
}
function sparkle(x,y){R(x,y,3,3,'#ffd700');}
function miniBalloon(x,y,c){R(x-2,y-3,4,1,c);R(x-3,y-2,6,4,c);R(x-2,y+2,4,1,c);R(x-2,y-2,1,1,'#fff6c2');R(x,y+3,1,4,'#bbbbbb');}

/* ---------------- shared tiles ---------------- */
function wood(x,y,a,b){R(x,y,16,16,a);R(x,y+15,16,1,b);R(x+15,y,1,16,b);}
function grass(x,y){R(x,y,16,16,'#66bb6a');}
function plant(x,y){R(x+5,y+10,6,5,'#a0522d');R(x+3,y+2,10,8,'#2e8b57');}
function door(x,y,open){
  R(x+2,y,12,16,open?'#4caf50':'#8b5a2b');R(x+11,y+8,2,2,'#ffd700');
}

/* ---------------- stages ---------------- */
function nortons(){
  const f={},S=STORY.stages.nortons;
  return {...meta('nortons'),
    map:["WWWWWWWWWW","#P......P#","#..TTTT..#","#........#","#........#","#tt......#","#tt......#","#........#","####E#####"],
    start:[4,7,'up'],solid:'W#TtP',req:['mirror','ate','bag'],f,
    leaveLines:S.leaving,
    tile(ch,x,y,st){
      if(ch==='W'){R(x,y,16,16,'#5a4040');R(x+2,y+3,12,9,'#87ceeb');R(x+2,y+8,12,4,'#4682b4');return;}
      if(ch==='#'){R(x,y,16,16,'#5a4040');return;}
      wood(x,y,'#c8a27a','#b8926a');
      if(ch==='T'||ch==='t')R(x,y+1,16,14,'#ffffff');
      if(ch==='P')plant(x,y);
      if(ch==='E')door(x,y,st.done);
    },
    tileTalk:{},
    ents:[
      {c:5,r:1,npc:true,dir:'down',o:DAN,talk(){return f.bag?S.danny.afterBag:f.ate?S.danny.afterEating:S.danny.beforeEating;}},
      {c:4,r:2,req:'ate',draw(x,y){R(x+3,y+5,10,6,'#dddddd');if(!f.ate)R(x+5,y+6,6,3,'#f4a460');},
        talk(){return f.ate?S.plate.after:[...S.plate.eat,()=>{f.ate=true;}];}},
      {c:0,r:3,req:'mirror',draw(x,y){R(x+2,y+1,12,14,'#c0a060');R(x+3,y+2,10,12,'#d6eef5');R(x+5,y+4,2,6,'#ffffff');},
        talk(){return f.mirror?S.mirror.after:[...S.mirror.look,()=>{f.mirror=true;}];}},
      {c:5,r:2,pass:true,draw(x,y){R(x+3,y+5,10,6,'#dddddd');R(x+5,y+6,6,3,'#8b4513');}},
      {c:7,r:4,npc:true,dir:'left',o:WAITRESS,req:'bag',talk(){return f.bag?S.waitress.after:f.ate?[...S.waitress.giveBag,()=>{f.bag=true;}]:S.waitress.beforeEating;}}
    ]};
}

function golf(){
  const f={},S=STORY.stages.golf;
  return {...meta('golf'),
    map:["YYYYYYYYYY","Y.....fffY","Y.r...f..Y","Y.....f..Y","Y..ffff.rY","Y..f.....Y","Y..f.....E","Y.ff.....Y","YYYYYYYYYY"],
    start:[2,7,'right'],solid:'Yr',req:['gift','post','golf'],f,
    tile(ch,x,y,st){
      if(ch==='f'){R(x,y,16,16,'#43a047');return;}
      grass(x,y);
      if(ch==='Y'){R(x+6,y+10,4,6,'#8b5a2b');R(x+2,y+1,12,10,'#2e7d32');}
      if(ch==='r'){R(x+3,y+6,10,8,'#999999');}
      if(ch==='E'){R(x,y+4,16,8,'#ffffff');if(st.done)R(x+4,y+6,8,4,'#4caf50');}
    },
    tileTalk:{},
    ents:[
      {c:5,r:7,npc:true,dir:'left',o:DAN,req:'gift',draw2(x,y){if(!f.gift)R(x+13,y+5,3,3,'#fdd835');},talk(){return !f.gift?[...S.danny.gift,()=>{f.gift=true;}]:f.golf?S.danny.afterGolf:S.danny.beforeGolf;}},
      {c:4,r:3,req:'post',draw(x,y){R(x+5,y+1,6,15,'#e0a050');},
        talk(){return[...S.post.look,()=>{f.post=true;}];}},
      {c:8,r:1,req:'golf',draw(x,y){R(x+6,y+10,5,3,'#000000');R(x+8,y-7,1,18,'#ffffff');R(x+9,y-7,6,4,'#ff0000');},
        talk(){return f.golf?S.hole.after:[...S.hole.putt,()=>{f.golf=true;}];}}
    ]};
}

function margaritas(){
  const f={},S=STORY.stages.margaritas;
  return {...meta('margaritas'),
    map:["BBBBBBBBBB","#........#","#..TTT...#","#........#","#.tt..tt.#","#........#","#c......c#","#........#","####E#####"],
    start:[4,7,'up'],solid:'B#Ttc',req:['ate','dan'],f,
    leaveLines:S.leaving,
    tile(ch,x,y,st){
      if(ch==='B'){R(x,y,16,16,'#e07b39');R(x+4,y+4,8,5,['#e53935','#fdd835','#43a047','#1e88e5'][(x/16)%4]);return;}
      if(ch==='#'){R(x,y,16,16,'#d06a2a');return;}
      wood(x,y,'#d9a679','#c99669');
      if(ch==='T'||ch==='t')R(x,y+1,16,14,'#2a9d8f');
      if(ch==='c'){R(x+5,y+11,6,5,'#a0522d');R(x+6,y+2,4,10,'#2e8b57');R(x+3,y+5,3,2,'#2e8b57');R(x+10,y+6,3,2,'#2e8b57');}
      if(ch==='E')door(x,y,st.done);
    },
    tileTalk:{},
    ents:[
      {cells:[[4,0],[5,0]],draw(x,y){R(x+1,y+3,30,10,'#2a9d8f');T('MARGARITAS',x+16,y+5,5,'#ffffff');}},
      {c:4,r:2,pass:true,draw(x,y){
        R(x+3,y-10,11,16,'#29b6f6');R(x+3,y-10,11,2,'#ffffff');R(x+7,y+6,3,6,'#e0e0e0');
        R(x+11,y-20,1,10,'#ff0000');R(x+12,y-13,4,4,'#7cb342');}},
      {c:3,r:1,npc:true,dir:'down',o:DAN,req:'dan',talk(){return f.ate?[...S.danny.afterTacos,()=>{f.dan=true;}]:S.danny.beforeTacos;}},
      {c:3,r:2,req:'ate',draw(x,y){R(x+2,y+8,12,4,'#ffffff');if(!f.ate)for(let i=0;i<3;i++)R(x+3+i*4,y+5,3,4,'#f9a825');},
        talk(){return f.ate?S.tacos.after:[...S.tacos.eat,()=>{f.ate=true;}];}}
    ]};
}

function birthday(){
  const f={},S=STORY.stages.birthday;
  return {...meta('birthday'),
    map:["WWWWWWWWWW","#b......b#","#...TT...#","#........#","#s.......#","#........#","#b......b#","#........#","####E#####"],
    start:[4,7,'up'],solid:'W#Tsb',req:['card','cake','dan'],f,
    tile(ch,x,y,st){
      if(ch==='W'){R(x,y,16,16,'#f4b6c2');R(x+4,y+3,8,5,['#e53935','#fdd835','#1e88e5','#43a047'][(x/16)%4]);return;}
      if(ch==='#'){R(x,y,16,16,'#e8a0b0');return;}
      wood(x,y,'#f0dcb4','#e0cca4');
      if(ch==='T')R(x,y+1,16,14,'#ffffff');
      if(ch==='s')R(x+1,y+3,14,11,'#a0522d');
      if(ch==='b'){R(x+2,y+2,6,7,'#e53935');R(x+8,y+3,6,7,'#fdd835');R(x+5,y+9,1,6,'#888888');R(x+11,y+10,1,5,'#888888');}
      if(ch==='E')door(x,y,st.done);
    },
    tileTalk:{},
    ents:[
      {cells:[[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],draw(x,y){R(x+4,y+9,88,8,'#ffffff');T('HAPPY BIRTHDAY',x+48,y+10,6,'#e53935');}},
      {c:4,r:2,req:'cake',draw(x,y){R(x+3,y+5,12,9,'#b71c1c');R(x+3,y+5,12,2,'#ffffff');
        [5,8,11].forEach(cx=>{R(x+cx,y+1,1,4,'#ffffff');if(!f.cake)R(x+cx,y-1,1,2,'#ff9800');});},
        talk(){return f.cake?S.cake.after:[...S.cake.blowOut,()=>{f.cake=true;}];}},
      {c:1,r:4,req:'card',draw(x,y){R(x+2,y+3,7,9,'#f5deb3');R(x+9,y+5,5,7,'#8e24aa');},
        talk(){return[...S.card.open,()=>{f.card=true;}];}},
      {c:6,r:3,npc:true,dir:'left',o:DAN,req:'dan',talk(){return[...(f.cake?S.danny.afterCake:S.danny.beforeCake),()=>{f.dan=true;}];}}
    ]};
}

function coloring(){
  const f={},S=STORY.stages.coloring;
  return {...meta('coloring'),
    map:["KKKKKKKKKK","#.CCCCCC.#","#........#","#.....SS.#","#........#","#.bbb....#","#.bbb....#","#........#","####E#####"],
    start:[4,7,'up'],solid:'KC#S',req:['hoodie','colored','dan'],f,
    tile(ch,x,y,st){
      if(ch==='K'){R(x,y,16,16,'#5d4037');R(x+2,y+2,12,12,'#6d4c41');return;}
      if(ch==='#'){R(x,y,16,16,'#d8cfc0');return;}
      R(x,y,16,16,'#d2c4ac');
      if(ch==='C'){R(x,y,16,16,'#5d4037');R(x,y,16,4,'#eeeeee');}
      if(ch==='S')R(x,y+2,16,13,'#757575');
      if(ch==='b')R(x,y,16,16,'#bbdefb');
      if(ch==='E')door(x,y,st.done);
    },
    tileTalk:{},
    ents:[
      {c:7,r:3,req:'hoodie',draw(x,y){if(!f.hoodie)R(x+2,y+4,12,8,'#8b6b52');},
        talk(){return f.hoodie?S.hoodie.after:[...S.hoodie.putOn,()=>{f.hoodie=true;player.o=KAT_HOODIE;}];}},
      {c:3,r:5,req:'colored',draw(x,y){R(x+1,y+3,14,11,'#5c6bc0');R(x+3,y+5,5,7,'#ffffff');['#e53935','#fdd835','#43a047','#1e88e5'].forEach((c,i)=>R(x+9+i,y+6,1,5,c));},
        talk(){const T2=S.coloringTray;return f.colored?T2.after:!f.hoodie?T2.notComfy:[...T2.color,()=>{f.colored=true;}];}},
      {c:7,r:6,npc:true,dir:'left',o:DAN,req:'dan',talk(){return f.colored?[...S.danny.afterColoring,()=>{f.dan=true;}]:S.danny.beforeColoring;}}
    ]};
}

function trunk(){
  const f={},S=STORY.stages.trunk;
  const st={...meta('trunk'),
    map:["~~~~~~~~~~","...CCCC...","...CCCC...","...CCCC...","..........","..........","L........L","..........","=========="],
    start:[4,7,'up'],solid:'~C=L',req:['yes'],f,
    tile(ch,x,y){
      if(ch==='~'){R(x,y,16,16,'#0b1030');R(x+((x*7)%13),y+((x*3)%11)+2,1,1,'#ffffff');return;}
      if(ch==='='){R(x,y,16,16,'#777777');return;}
      R(x,y,16,16,'#333333');
      if(ch==='L'){R(x+7,y-10,2,26,'#555555');R(x+4,y-12,8,3,'#ffeb99');}
    },
    over(){
      R(54,14,52,18,'#1a1a2e');
      R(48,32,64,26,'#8b0000');
      R(50,35,10,6,'#ff0000');R(100,35,10,6,'#ff0000');
      if(f.open){
        R(62,32,36,17,'#000000');
        [[67,38],[75,37],[85,37],[93,38]].forEach(([bx,by])=>{R(bx-3,by-3,6,7,'#fdd835');});
        R(74,40,12,8,'#dddddd');R(75,41,10,6,'#444444');
        R(62,8,36,6,'#8b0000');
      }else R(62,32,36,17,'#a52a2a');
      R(46,56,68,6,'#222222');R(72,50,16,6,'#ffffff');
    },
    tileTalk:{},
    ents:[
      {c:7,r:4,npc:true,dir:'left',o:DAN,talk(){return f.yes?S.danny.after:S.danny.before;}},
      {cells:[[4,3],[5,3]],req:'yes',draw(){},talk(){
        const K=S.trunk;
        if(f.yes)return K.after;
        return[()=>{f.open=true;},...K.open,{choice:{q:K.question,yesText:K.yesButton,noTexts:K.noButtons,yes:()=>{f.yes=true;}}},...K.afterYes];}}
    ]};
  return st;
}

const STAGES=[nortons,golf,margaritas,birthday,coloring,trunk];

/* ---------------- state ---------------- */
let si=-1, st=null, held=null;
let overlayOpen=false, photoOpen=false, choiceOpen=false;
let done=[];
const player={c:0,r:0,fc:0,fr:0,t:1,moving:false,dir:'up',step:0,o:KAT};
const DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};

function tileAt(c,r){if(r<0||r>=ROWS||c<0||c>=COLS)return null;return st.map[r][c];}
function cellsOf(e){return e.cells||[[e.c,e.r]];}
function entAt(c,r){return st.ents.find(e=>cellsOf(e).some(([a,b])=>a===c&&b===r));}
function blocked(c,r){const t=tileAt(c,r);if(t===null)return true;if(st.solid.includes(t))return true;return !!entAt(c,r);}
function left(){return st.req.filter(k=>!st.f[k]).length;}

/* ---------------- dialog ---------------- */
let dq=[], dlg=null;
function wrap(s,n){const out=[];let cur='';for(const w of s.split(' ')){if((cur?cur+' ':'').length+w.length>n){out.push(cur);cur=w;}else cur=cur?cur+' '+w:w;}if(cur)out.push(cur);return out;}
function talk(items){dq.push(...items);if(!dlg&&!photoOpen&&!choiceOpen)nextItem();}
function nextItem(){
  while(dq.length){
    const it=dq.shift();
    if(typeof it==='function'){it();continue;}
    if(typeof it==='string'){const lines=wrap(it,30),pages=[];for(let i=0;i<lines.length;i+=3)pages.push(lines.slice(i,i+3));dlg={pages,pi:0,n:0};return;}
    if(it.photo){openPhoto(PHOTOS[it.photo]||it.photo,it.caption);return;}
    if(it.choice){openChoice(it.choice);return;}
  }
  dlg=null;onDialogEnd();
}
function advance(){
  const page=dlg.pages[dlg.pi],len=page.join('').length;
  if(dlg.n<len){dlg.n=len;return;}
  dlg.pi++;dlg.n=0;
  if(dlg.pi>=dlg.pages.length){dlg=null;nextItem();}
}
function onDialogEnd(){
  if(!st)return;
  const was=st.done;
  st.done=left()===0;
  updateHud();
  if(st.done&&!was){
    if(si===STAGES.length-1)setTimeout(finale,900);
    else talk([STORY.ui.allDone]);
  }
}
function drawDialog(){
  if(!dlg)return;
  R(2,102,156,40,'#000000');R(3,103,154,38,'#ffffff');
  let n=Math.floor(dlg.n);
  dlg.pages[dlg.pi].forEach((ln,i)=>{const s=ln.slice(0,Math.max(0,n));n-=ln.length;T(s,8,107+i*11,7,'#000000','left');});
  if(dlg.n>=dlg.pages[dlg.pi].join('').length)T('v',150,131,7,'#000000','left');
}

/* ---------------- photo & choice ---------------- */
const photoEl=document.getElementById('photo'),photoImg=document.getElementById('photoImg'),photoCap=document.getElementById('photoCap');
function openPhoto(src,cap){photoOpen=true;held=null;photoImg.src=src;photoImg.alt=cap||'';photoCap.textContent=cap||'';photoEl.classList.remove('hidden');}
function closePhoto(){if(!photoOpen)return;photoOpen=false;photoEl.classList.add('hidden');nextItem();}
document.getElementById('photoClose').onclick=closePhoto;
photoEl.addEventListener('click',e=>{if(e.target===photoEl)closePhoto();});

const ov=document.getElementById('overlay');
function overlay(html,btn,cb){
  overlayOpen=true;held=null;
  ov.innerHTML=html+`<button class="pix" id="ovBtn">${btn}</button>`;
  ov.classList.remove('hidden');
  const b=document.getElementById('ovBtn');b.focus({preventScroll:true});
  b.onclick=()=>{ov.classList.add('hidden');overlayOpen=false;b.blur();cb();};
}
function openChoice(c){
  choiceOpen=true;held=null;let no=0;
  ov.innerHTML=`<h2>${c.q}</h2><div class="row"><button class="pix" id="yesBtn">${c.yesText}</button><button class="pix" id="noBtn">${c.noTexts[0]}</button></div>`;
  ov.classList.remove('hidden');
  const y=document.getElementById('yesBtn'),n=document.getElementById('noBtn');
  y.onclick=()=>{ov.classList.add('hidden');choiceOpen=false;c.yes();nextItem();};
  n.onclick=()=>{no++;y.style.fontSize=(11+no*4)+'px';if(no>=c.noTexts.length)n.remove();else n.textContent=c.noTexts[no];};
}

/* ---------------- HUD ---------------- */
const heartsEl=document.getElementById('hearts'),tasksEl=document.getElementById('tasks');
function updateHud(){
  heartsEl.textContent=st?`${STORY.ui.stageWord} ${si+1}/${STAGES.length}`:'';
  tasksEl.textContent=st?`${STORY.ui.foundWord} ${st.req.length-left()}/${st.req.length}`:'';
}

/* ---------------- flow ---------------- */
function loadStage(i){
  si=i;st=STAGES[i]();st.done=false;dq=[];dlg=null;
  const [c,r,d]=st.start;Object.assign(player,{c,r,fc:c,fr:r,t:1,moving:false,dir:d});
  player.o=i<3?KAT_BANGS:KAT;
  updateHud();
}
function intro(i){
  loadStage(i);
  const u=STORY.ui;
  overlay(`<div class="lvl">${u.stageWord} ${i+1} / ${STAGES.length}</div><div class="date">${st.date}</div><h2>${st.title}</h2><p>${st.caption}</p><p class="small">${u.stageHint}</p>`,u.playButton,()=>{});
}
function leaveStage(){
  if(st.leaveLines&&!st.leaving){st.leaving=true;talk([...st.leaveLines,()=>leaveStage()]);return;}
  done[si]=true;updateHud();
  const sv=STORY.stages[st.key].souvenir,u=STORY.ui;
  const next=()=>intro(si+1);
  if(sv)overlay(`<div class="lvl">${u.souvenirLabel}</div><p>${sv}</p><p class="small">${u.souvenirNote}</p>`,u.nextButton,next);
  else next();
}
function title(){
  si=-1;st=null;done=[];updateHud();
  const u=STORY.ui;
  overlay(`<h2>${u.titleHeading}</h2><p>${u.titleText}</p><p class="small">${u.titleControls}</p>`,u.startButton,()=>intro(0));
}
function finale(){
  done[si]=true;updateHud();
  const u=STORY.ui;
  overlay(`<div class="lvl">${u.finaleLabel}</div><h2>${u.finaleHeading}</h2><p>${u.finaleLines.join('<br>')}</p><p>${u.signoff}</p>`,u.againButton,title);
}

/* ---------------- movement & interaction ---------------- */
function tryMove(dir){
  player.dir=dir;
  const [dc,dr]=DIRS[dir],nc=player.c+dc,nr=player.r+dr,t=tileAt(nc,nr);
  if(t==='E'&&!st.done){held=null;const n=left();talk([STORY.ui.exitLocked]);return;}
  if(t!=='E'&&blocked(nc,nr))return;
  player.fc=player.c;player.fr=player.r;player.c=nc;player.r=nr;player.t=0;player.moving=true;player.step^=1;
}
function interact(){
  const [dc,dr]=DIRS[player.dir],c=player.c+dc,r=player.r+dr;
  let e=entAt(c,r);
  const t0=tileAt(c,r);
  if((!e||e.pass)&&(e||'Tt'.includes(t0||'x'))){const b=entAt(c+dc,r+dr);if(b&&b.npc)e=b;}
  if(e&&e.talk){
    if(e.npc)e.dir={up:'down',down:'up',left:'right',right:'left'}[player.dir];
    talk(e.talk());return;
  }
  const t=tileAt(c,r);
  if(t&&st.tileTalk[t])talk([st.tileTalk[t]]);
}
function pressA(){
  if(photoOpen){closePhoto();return;}
  if(overlayOpen||choiceOpen||!st)return;
  if(dlg){advance();return;}
  if(!player.moving)interact();
}

/* ---------------- input ---------------- */
const KEYS={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
addEventListener('keydown',e=>{
  if(KEYS[e.code]){if(overlayOpen||choiceOpen)return;e.preventDefault();held=KEYS[e.code];return;}
  if(['Space','Enter','KeyZ','KeyX'].includes(e.code)){
    if((overlayOpen||choiceOpen)&&!photoOpen)return;
    e.preventDefault();if(!e.repeat)pressA();return;
  }
  if(e.code==='Escape'&&photoOpen)closePhoto();
});
addEventListener('keyup',e=>{if(KEYS[e.code]===held)held=null;});
const dpad=document.querySelector('.dpad'),dbtn={};
dpad.querySelectorAll('button').forEach(b=>dbtn[b.dataset.dir]=b);
let padId=null;
function padDir(e){
  const r=dpad.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
  if(Math.hypot(dx,dy)<10)return null;
  return Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
}
function setPad(d){held=d;for(const k in dbtn)dbtn[k].classList.toggle('held',k===d);}
dpad.addEventListener('pointerdown',e=>{e.preventDefault();padId=e.pointerId;try{dpad.setPointerCapture(e.pointerId);}catch(_){}setPad(padDir(e));});
dpad.addEventListener('pointermove',e=>{if(e.pointerId===padId)setPad(padDir(e));});
const padUp=e=>{if(e.pointerId===padId){padId=null;setPad(null);}};
dpad.addEventListener('pointerup',padUp);dpad.addEventListener('pointercancel',padUp);
dpad.addEventListener('contextmenu',e=>e.preventDefault());
document.getElementById('aBtn').addEventListener('pointerdown',e=>{e.preventDefault();pressA();});
document.getElementById('photoClose').textContent=STORY.ui.closePhoto;
cv.addEventListener('pointerdown',e=>{e.preventDefault();pressA();});

/* ---------------- loop ---------------- */
function update(dt){
  if(!st||overlayOpen||photoOpen||choiceOpen)return;
  if(dlg){dlg.n+=dt*45;return;}
  if(player.moving){
    player.t+=dt/0.17;
    if(player.t>=1){player.t=1;player.moving=false;if(tileAt(player.c,player.r)==='E'){leaveStage();return;}}
  }
  if(!player.moving&&held&&!dlg)tryMove(held);
}
function drawTitleArt(){
  R(0,0,W,H,'#222222');
  const HT=["..XXX...XXX..",".XOOOX.XOOOX.","XOOOOOXOOOOOX","XOOOOOOOOOOOX",".XOOOOOOOOOX.","..XOOOOOOOX..","...XOOOOOX...","....XOOOX....",".....XOX.....","......X......"];
  const c=6,x0=80-39,y0=36,beat=Math.sin(time*3)>0.4;
  HT.forEach((row,r)=>[...row].forEach((ch,k)=>{if(ch!=='.')R(x0+k*c,y0+r*c,c,c,'#e53935');}));
}
function draw(){
  ctx.clearRect(0,0,W,H);
  if(!st){drawTitleArt();return;}
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)st.tile(st.map[r][c],c*TS,r*TS,st);
  if(st.over)st.over();
  const list=st.ents.map(e=>({r:cellsOf(e)[0][1],e}));
  const pr=lerp(player.fr,player.r,player.t);
  list.push({r:pr,p:true});
  list.sort((a,b)=>a.r-b.r);
  for(const it of list){
    if(it.p){
      const px=lerp(player.fc,player.c,player.t)*TS,py=pr*TS;
      const frame=player.moving?(player.t<0.5?(player.step?1:2):0):0;
      drawChar(px,py-1,player.dir,frame,player.o);
    }else{
      const e=it.e,[c,r]=cellsOf(e)[0],x=c*TS,y=r*TS;
      if(e.o)drawChar(x,y-1,e.dir,0,e.o);
      if(e.draw)e.draw(x,y);
      if(e.draw2)e.draw2(x,y);
      if(e.req&&!st.f[e.req]&&blink(1.2))sparkle(x+12,y-3);
    }
  }
  drawDialog();
}
let last=performance.now();
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;update(dt);draw();requestAnimationFrame(loop);}
title();
requestAnimationFrame(loop);
