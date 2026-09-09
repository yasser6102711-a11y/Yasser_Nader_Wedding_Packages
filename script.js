const total=6;
const pages=Array.from({length:total},(_,i)=>`images/page-${i+1}.webp`);
const book=document.getElementById('book'), current=document.getElementById('pageCurrent'), nextLayer=document.getElementById('pageNext'), under=document.getElementById('pageUnder');
const counter=document.getElementById('counter'),dots=document.getElementById('dots'),prev=document.getElementById('prev'),next=document.getElementById('next'),hint=document.getElementById('hint'),viewer=document.getElementById('viewer');
let index=0,busy=false,zoom=1,startX=0,startY=0,dragging=false;
for(let i=0;i<total;i++){const d=document.createElement('button');d.className='dot';d.setAttribute('aria-label',`الصفحة ${i+1}`);d.onclick=()=>go(i);dots.appendChild(d)}
const dotEls=[...dots.children];
function setBg(el,src){el.style.backgroundImage=`url("${src}")`}
function render(){
 setBg(current,pages[index]);
 setBg(nextLayer,pages[Math.min(index+1,total-1)]);
 setBg(under,pages[Math.max(index-1,0)]);
 counter.textContent=`${index+1} / ${total}`;dotEls.forEach((d,i)=>d.classList.toggle('active',i===index));
 prev.disabled=index===0;next.disabled=index===total-1;
}
function animate(dir){
 if(busy || (dir>0&&index>=total-1)||(dir<0&&index<=0)) return;
 busy=true;
 if(dir>0){setBg(nextLayer,pages[index+1]);current.classList.add('flipping-next');nextLayer.classList.add('fade-in')}
 else{setBg(under,pages[index-1]);current.classList.add('flipping-prev');under.style.zIndex=2;nextLayer.style.zIndex=1}
 setTimeout(()=>{
   index+=dir; current.className='page-current'; nextLayer.className='page-next'; under.className='page-under'; under.style.zIndex='';nextLayer.style.zIndex='';render();busy=false;
 },620)
}
function go(i){if(i===index||busy||i<0||i>=total)return; const dir=i>index?1:-1; if(Math.abs(i-index)===1) animate(dir); else {index=i;render()}}
prev.onclick=()=>animate(-1);next.onclick=()=>animate(1);
function onDown(e){if(busy)return; const p=e.touches?e.touches[0]:e;startX=p.clientX;startY=p.clientY;dragging=true}
function onUp(e){if(!dragging||busy)return;dragging=false;const p=e.changedTouches?e.changedTouches[0]:e;const dx=p.clientX-startX,dy=p.clientY-startY;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.15){ if(dx<0)animate(1); else animate(-1)}}
viewer.addEventListener('touchstart',onDown,{passive:true});viewer.addEventListener('touchend',onUp,{passive:true});
viewer.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')onDown(e)});viewer.addEventListener('pointerup',e=>{if(e.pointerType==='mouse')onUp(e)});
window.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')animate(1); if(e.key==='ArrowRight')animate(-1); if(e.key==='Home')go(0);if(e.key==='End')go(total-1);if(e.key==='+'||e.key==='=')setZoom(zoom+.1);if(e.key==='-')setZoom(zoom-.1);if(e.key==='Escape'&&document.fullscreenElement)document.exitFullscreen()});
function setZoom(z){zoom=Math.max(0.85,Math.min(1.55,z));document.documentElement.style.setProperty('--zoom',zoom)}
document.getElementById('zoomIn').onclick=()=>setZoom(zoom+.1);document.getElementById('zoomOut').onclick=()=>setZoom(zoom-.1);
document.getElementById('fullscreen').onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()};
setTimeout(()=>hint.style.opacity='0',3500);render();
