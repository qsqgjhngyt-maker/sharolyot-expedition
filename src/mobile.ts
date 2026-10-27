import type {Input} from './input';
import {FloatingGestures} from './touch-gestures';
import type {FloatingGesture,GestureSide} from './touch-gestures';
import {$} from './ui';

// Start anywhere on the game view, while leaving all interactive UI alone.
const INTERACTIVE_UI='button,a,input,select,textarea,[role="dialog"],#menu,#modal,#dialogue,#touch-drawer,.toolbar,.quest,.navigation,.minimap,.suit-panel';

export class MobileControls {
 enabled=matchMedia('(any-pointer: coarse)').matches||innerWidth<700;
 private panel:HTMLDivElement;
 private actionPanel:HTMLDivElement;
 private lastMode='';
 private blocked=false;
 private gestures=new FloatingGestures();

 constructor(private input:Input,private mode:()=>string){
  this.panel=document.createElement('div');this.panel.id='touch-controls';
  this.panel.innerHTML=`<div id="move-stick" class="virtual-stick" aria-label="Левая область — движение"><span class="stick-label">ЛЕВАЯ ОБЛАСТЬ</span><i></i></div><div id="camera-stick" class="virtual-stick" aria-label="Правая область — камера"><span class="stick-label">ПРАВАЯ ОБЛАСТЬ</span><i></i></div><div class="touch-left-tools"><button data-hold="ShiftLeft" aria-label="Ускорение">⇧</button><button data-hold="KeyX" aria-label="Тормоз">Стоп</button></div><div class="touch-height"><button data-hold="Space" aria-label="Вверх">↑</button><button data-hold="ControlLeft" aria-label="Вниз">↓</button></div><div class="touch-actions"><button id="touch-interact" data-hold="KeyE" aria-label="Взаимодействие или сканирование">E</button><button id="touch-mode" data-tap="KeyF" aria-label="Переключить режим">На борт</button><button id="touch-more" aria-label="Остальные действия">⋯</button></div>`;
  $('hud').append(this.panel);
  this.actionPanel=document.createElement('div');this.actionPanel.id='touch-drawer';
  this.actionPanel.className='hidden';$('hud').append(this.actionPanel);
  this.bindGestureAreas();
  this.panel.querySelectorAll<HTMLButtonElement>('[data-hold]').forEach(b=>this.bindHold(b,b.dataset.hold!));
  this.panel.querySelectorAll<HTMLButtonElement>('[data-tap]').forEach(b=>b.onclick=()=>this.input.pulse(b.dataset.tap!));
  $('touch-more').onclick=()=>{
   this.cancelGestures();this.actionPanel.classList.toggle('hidden');this.renderDrawer();
  };
  const zoom=document.createElement('div');zoom.className='touch-zoom';
  zoom.innerHTML='<button aria-label="Приблизить камеру">+</button><button aria-label="Отдалить камеру">−</button>';
  this.panel.append(zoom);
  zoom.querySelectorAll('button').forEach((b,i)=>b.onclick=()=>this.input.zoom=Math.max(.65,Math.min(1.8,this.input.zoom+(i?.15:-.15))));
  this.apply();
  addEventListener('resize',()=>{
   this.cancelGestures();
   if(matchMedia('(any-pointer: coarse)').matches||innerWidth<700){this.enabled=true;this.apply();}
  });
  addEventListener('blur',()=>this.cancelGestures());
  document.addEventListener('visibilitychange',()=>{if(document.hidden)this.cancelGestures();});
 }

 private bindHold(button:HTMLElement,code:string){
  const release=()=>{this.input.hold(code,false);button.classList.remove('held');};
  button.addEventListener('pointerdown',e=>{
   e.preventDefault();button.setPointerCapture(e.pointerId);
   button.classList.add('held');this.input.hold(code,true);
  });
  button.addEventListener('pointerup',release);
  button.addEventListener('pointercancel',release);
  button.addEventListener('lostpointercapture',release);
  button.addEventListener('contextmenu',e=>e.preventDefault());
 }

 private bindGestureAreas(){
  document.addEventListener('pointerdown',e=>{
   if(!this.enabled||this.blocked||e.button!==0||$('hud').classList.contains('hidden')||!this.actionPanel.classList.contains('hidden'))return;
   if(!(e.target instanceof Element)||e.target.closest(INTERACTIVE_UI))return;
   const gesture=this.gestures.begin(e.pointerId,e.clientX,e.clientY,innerWidth);
   if(!gesture)return;
   e.preventDefault();
   this.panel.setPointerCapture(e.pointerId);
   this.paintGesture(gesture);
   if(gesture.side==='move')this.applyMovement(gesture);
  },{capture:true,passive:false});

  document.addEventListener('pointermove',e=>{
   const gesture=this.gestures.update(e.pointerId,e.clientX,e.clientY);
   if(!gesture)return;
   e.preventDefault();
   this.paintGesture(gesture);
   if(gesture.side==='move')this.applyMovement(gesture);
   else{
    // Camera follows each swipe directly; holding a still thumb does not spin it.
    this.input.lookX=0;this.input.lookY=0;
    this.input.yaw-=gesture.deltaX*.0055;
    this.input.pitch=Math.max(.1,Math.min(1.1,this.input.pitch+gesture.deltaY*.004));
   }
  },{capture:true,passive:false});

  const end=(e:PointerEvent)=>{
   const side=this.gestures.end(e.pointerId);if(!side)return;
   this.resetSide(side);
   if(this.panel.hasPointerCapture(e.pointerId))this.panel.releasePointerCapture(e.pointerId);
  };
  document.addEventListener('pointerup',end,true);
  document.addEventListener('pointercancel',end,true);
  this.panel.addEventListener('lostpointercapture',end);
 }

 private applyMovement(g:FloatingGesture){
  this.input.touchX=g.axisX;this.input.touchZ=g.axisY;
  this.input.hold('KeyA',g.axisX<-.18);this.input.hold('KeyD',g.axisX>.18);
  this.input.hold('KeyW',g.axisY<-.18);this.input.hold('KeyS',g.axisY>.18);
 }
 private paintGesture(g:FloatingGesture){
  const stick=$(g.side==='move'?'move-stick':'camera-stick');
  stick.classList.add('active');
  stick.style.left=`${g.originX-55}px`;stick.style.top=`${g.originY-55}px`;
  stick.style.right='auto';stick.style.bottom='auto';
  const dx=g.x-g.originX,dy=g.y-g.originY;
  stick.querySelector<HTMLElement>('i')!.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
 }
 private resetSide(side:GestureSide){
  const stick=$(side==='move'?'move-stick':'camera-stick');
  stick.classList.remove('active');stick.removeAttribute('style');
  stick.querySelector<HTMLElement>('i')!.style.transform='translate(-50%,-50%)';
  if(side==='move'){
   this.input.touchX=0;this.input.touchZ=0;
   for(const key of ['KeyW','KeyA','KeyS','KeyD'])this.input.hold(key,false);
  }else{this.input.lookX=0;this.input.lookY=0;}
 }
 private cancelGestures(){
  const ids=[this.gestures.move?.id,this.gestures.camera?.id];
  this.gestures.cancel();this.resetSide('move');this.resetSide('camera');
  for(const id of ids)if(id!==undefined&&this.panel.hasPointerCapture(id))this.panel.releasePointerCapture(id);
 }
 private renderDrawer(){
  const mode=this.mode(),actions=mode==='space'?[['KeyR','Курс на цель'],['KeyL','Посадка / взлёт'],['KeyG','На поверхность'],['KeyV','Скафандр'],['KeyM','Атлас']]:mode==='eva'?[['KeyR','Где корабль?'],['KeyB','Аварийный возврат'],['KeyJ','Миссии']]:mode==='interior'?[['KeyG','На поверхность'],['KeyV','В открытый космос'],['KeyC','Связь с экипажем'],['KeyM','Карта экипажа']]:[['KeyF','На корабль'],['KeyJ','Миссии'],['KeyC','Связь']];
  this.actionPanel.innerHTML=`<div class="drawer-heading">ДЕЙСТВИЯ <button id="close-touch-drawer">×</button></div>${actions.map(([code,text])=>`<button data-action="${code}">${text}</button>`).join('')}${mode==='space'?'<div class="touch-pitch"><button data-pitch="ArrowUp">Нос ↑</button><button data-pitch="ArrowDown">Нос ↓</button></div>':''}`;
  this.actionPanel.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(b=>b.onclick=()=>{this.input.pulse(b.dataset.action!);this.actionPanel.classList.add('hidden');});
  this.actionPanel.querySelectorAll<HTMLButtonElement>('[data-pitch]').forEach(b=>this.bindHold(b,b.dataset.pitch!));
  $('close-touch-drawer').onclick=()=>this.actionPanel.classList.add('hidden');
 }
 toggle(){this.cancelGestures();this.enabled=!this.enabled;this.input.clear();this.apply();}
 private apply(){document.body.classList.toggle('touch-ui',this.enabled);this.panel.classList.toggle('hidden',!this.enabled);}
 update(blocked:boolean){
  if(blocked&&!this.blocked)this.cancelGestures();this.blocked=blocked;
  this.panel.classList.toggle('inactive',blocked);
  if(blocked)this.actionPanel.classList.add('hidden');
  const mode=this.mode();
  if(mode!==this.lastMode){
   this.cancelGestures();this.lastMode=mode;this.actionPanel.classList.add('hidden');
   $('touch-mode').textContent=mode==='space'?'Внутрь':mode==='interior'?'Полёт':'На борт';
   this.panel.classList.toggle('show-height',mode==='space'||mode==='eva');
  }
 }
}
