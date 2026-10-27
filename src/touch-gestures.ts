export type GestureSide = 'move' | 'camera';
export interface FloatingGesture {
 id:number; side:GestureSide;
 originX:number; originY:number;
 x:number; y:number;
 axisX:number; axisY:number;
 deltaX:number; deltaY:number;
}

/** One independent finger per half; crossing the middle never changes its role. */
export class FloatingGestures {
 move:FloatingGesture|null=null;
 camera:FloatingGesture|null=null;
 readonly radius:number; readonly deadZone:number; constructor(radius=42,deadZone=.12){this.radius=radius;this.deadZone=deadZone;}
 begin(id:number,x:number,y:number,width:number):FloatingGesture|null {
  if(this.find(id))return null;
  const side:GestureSide=x<width/2?'move':'camera';
  if(this[side])return null;
  const gesture={id,side,originX:x,originY:y,x,y,axisX:0,axisY:0,deltaX:0,deltaY:0};
  this[side]=gesture;
  return gesture;
 }
 find(id:number):FloatingGesture|null {
  return this.move?.id===id?this.move:this.camera?.id===id?this.camera:null;
 }
 update(id:number,x:number,y:number):FloatingGesture|null {
  const g=this.find(id);if(!g)return null;
  g.deltaX=x-g.x;g.deltaY=y-g.y;g.x=x;g.y=y;
  const dx=x-g.originX,dy=y-g.originY,distance=Math.hypot(dx,dy);
  // Follow long drags so the player can comfortably reposition their thumb.
  if(distance>this.radius){
   g.originX=x-dx/distance*this.radius;
   g.originY=y-dy/distance*this.radius;
  }
  const strength=distance<=this.radius*this.deadZone?0:
   Math.min(1,(distance/this.radius-this.deadZone)/(1-this.deadZone));
  g.axisX=distance?dx/distance*strength:0;
  g.axisY=distance?dy/distance*strength:0;
  return g;
 }
 end(id:number):GestureSide|null {
  const g=this.find(id);if(!g)return null;
  this[g.side]=null;return g.side;
 }
 cancel(){this.move=null;this.camera=null;}
}

