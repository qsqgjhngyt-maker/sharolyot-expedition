import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FloatingGestures} from '../src/touch-gestures.ts';

test('movement starts at the thumb anywhere in the left half, without jumping',()=>{
 const g=new FloatingGestures();const touch=g.begin(1,310,300,844)!;
 assert.equal(touch.side,'move');assert.equal(touch.originX,310);assert.equal(touch.originY,300);
 assert.equal(touch.axisX,0);assert.equal(touch.axisY,0);
 const moved=g.update(1,310,270)!;assert.equal(moved.axisX,0);assert.ok(moved.axisY<-.6);
});
test('each finger keeps its role across the middle and can be released independently',()=>{
 const g=new FloatingGestures();g.begin(1,160,350,844);g.begin(2,650,270,844);
 assert.equal(g.update(1,600,350)!.side,'move');
 assert.equal(g.update(2,300,270)!.side,'camera');
 assert.equal(g.end(2),'camera');assert.ok(g.move);assert.equal(g.camera,null);
 assert.equal(g.end(1),'move');assert.equal(g.move,null);
});
test('long movement drags carry the origin and allow a comfortable immediate reversal',()=>{
 const g=new FloatingGestures();g.begin(1,90,400,844);const forward=g.update(1,90,220)!;
 assert.equal(forward.axisY,-1);assert.equal(forward.originY,262);
 const neutral=g.update(1,90,262)!;assert.equal(neutral.axisY,0);
 assert.ok(g.update(1,90,290)!.axisY>0);
});
test('camera uses incremental swipe deltas and stops changing when a thumb is held still',()=>{
 const g=new FloatingGestures();g.begin(2,700,350,844);
 const swipe=g.update(2,675,360)!;assert.equal(swipe.deltaX,-25);assert.equal(swipe.deltaY,10);
 const held=g.update(2,675,360)!;assert.equal(held.deltaX,0);assert.equal(held.deltaY,0);
});
test('extra fingers cannot steal controls, cancellation resets both roles and allows reuse',()=>{
 const g=new FloatingGestures();g.begin(1,100,400,844);g.begin(2,700,400,844);
 assert.equal(g.begin(3,200,350,844),null);assert.equal(g.begin(1,700,400,844),null);
 assert.equal(g.end(3),null);g.cancel();assert.equal(g.move,null);assert.equal(g.camera,null);
 assert.ok(g.begin(3,200,350,844));assert.equal(g.update(1,50,50),null);
});
