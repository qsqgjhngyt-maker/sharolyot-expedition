export class Input {
 keys=new Set<string>();pressed=new Set<string>();virtual=new Set<string>();yaw=0;pitch=.3;zoom=1;dragging=false;touchX=0;touchZ=0;lookX=0;lookY=0;
 constructor(canvas:HTMLCanvasElement){
 addEventListener('keydown',e=>{if(['Space','Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(!e.repeat)this.pressed.add(e.code);this.keys.add(e.code);});
 addEventListener('keyup',e=>this.keys.delete(e.code));addEventListener('blur',()=>this.clear());
 canvas.addEventListener('contextmenu',e=>e.preventDefault());canvas.addEventListener('pointerdown',e=>{if(e.button===2){this.dragging=true;canvas.setPointerCapture(e.pointerId);}});canvas.addEventListener('pointerup',()=>this.dragging=false);canvas.addEventListener('pointercancel',()=>this.dragging=false);canvas.addEventListener('pointermove',e=>{if(this.dragging){this.yaw-=e.movementX*.005;this.pitch=Math.max(.1,Math.min(1.1,this.pitch+e.movementY*.004));}});canvas.addEventListener('wheel',e=>{e.preventDefault();this.zoom=Math.max(.65,Math.min(1.8,this.zoom+e.deltaY*.0008));},{passive:false});
 }
 hold(code:string,down:boolean){if(down){if(!this.virtual.has(code))this.pressed.add(code);this.virtual.add(code);}else this.virtual.delete(code);}
 pulse(code:string){this.pressed.add(code);}
 axisX(){return this.keys.has('KeyD')?1:this.keys.has('KeyA')?-1:this.touchX;}
 axisZ(){return this.keys.has('KeyS')?1:this.keys.has('KeyW')?-1:this.touchZ;}
 cameraTick(dt:number){this.yaw-=this.lookX*dt*2;this.pitch=Math.max(.1,Math.min(1.1,this.pitch+this.lookY*dt*1.3));}
 has(...codes:string[]){return codes.some(c=>this.keys.has(c)||this.virtual.has(c));}tap(code:string){const v=this.pressed.has(code);this.pressed.delete(code);return v;}end(){this.pressed.clear();}clear(){this.keys.clear();this.virtual.clear();this.pressed.clear();this.dragging=false;this.touchX=0;this.touchZ=0;this.lookX=0;this.lookY=0;}
}
