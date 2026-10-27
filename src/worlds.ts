import * as THREE from 'three';
import {CHARACTERS,CABINS,PLANETS} from './data';
import {box,sphere,mesh,material,glow,ring,label,character,ship,seedRandom,rod,instrumentTexture} from './models';
export interface Obstacle {x:number;z:number;w:number;d:number}
export interface Interactable {id:string;name:string;position:THREE.Vector3;radius:number}
export function lighting(scene:THREE.Scene,interior=false){scene.add(new THREE.HemisphereLight(0xc6f4ff,0x40324d,interior?2.5:1.8));const sun=new THREE.DirectionalLight(0xffe0ab,interior?3:4.3);sun.position.set(30,50,20);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-40;sun.shadow.camera.right=40;sun.shadow.camera.top=60;sun.shadow.camera.bottom=-35;sun.shadow.camera.far=160;sun.shadow.normalBias=.04;scene.add(sun);const rim=new THREE.DirectionalLight(0x75c6ff,2.3);rim.position.set(-20,8,-30);scene.add(rim);}
let skyTexture:THREE.CanvasTexture;
export function sky(scene:THREE.Scene){
 if(!skyTexture){const c=document.createElement('canvas');c.width=2048;c.height=1024;const ctx=c.getContext('2d')!;ctx.fillStyle='#080f22';ctx.fillRect(0,0,c.width,c.height);const r=seedRandom(29);for(let i=0;i<32;i++){const x=r()*2048,y=320+Math.sin(x/500)*150+r()*270;const grad=ctx.createRadialGradient(x,y,1,x,y,120+r()*220);grad.addColorStop(0,i%2?'rgba(32,78,103,.19)':'rgba(77,49,100,.17)');grad.addColorStop(1,'rgba(10,20,40,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,2048,1024);}for(let i=0;i<1800;i++){ctx.globalAlpha=.2+r()*.7;ctx.fillStyle=i%5?'#d6e9fa':'#f6d0ab';ctx.beginPath();ctx.arc(r()*2048,r()*1024,.3+r()*.9,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;skyTexture=new THREE.CanvasTexture(c);skyTexture.mapping=THREE.EquirectangularReflectionMapping;skyTexture.colorSpace=THREE.SRGBColorSpace;}
 scene.background=skyTexture;
 const random=seedRandom();const vertices=[];for(let i=0;i<2400;i++){const a=random()*Math.PI*2,u=random()*2-1,r=2200;vertices.push(Math.cos(a)*Math.sqrt(1-u*u)*r,u*r,Math.sin(a)*Math.sqrt(1-u*u)*r);}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));scene.add(new THREE.Points(geo,new THREE.PointsMaterial({color:0xc8e3ff,size:1.9,sizeAttenuation:true,transparent:true,opacity:.8})));
}
function planetTexture(index:number){const c=document.createElement('canvas');c.width=1024;c.height=512;const ctx=c.getContext('2d')!,r=seedRandom(36+index),p=PLANETS[index];ctx.fillStyle=`#${p.color.toString(16)}`;ctx.fillRect(0,0,1024,512);for(let i=0;i<140;i++){ctx.fillStyle=index===1?`rgba(${190+r()*60},${115+r()*65},${80+r()*55},.22)`:(index===0?`rgba(120,225,188,${.15+r()*.5})`:`rgba(203,154,219,${.2+r()*.4})`);ctx.beginPath();const x=r()*1024,y=r()*512;if(index===1){ctx.fillRect(0,y,1024,4+r()*18);continue;}ctx.ellipse(x,y,10+r()*74,4+r()*25,r()*Math.PI,0,Math.PI*2);ctx.fill();}for(let i=0;i<38;i++){ctx.fillStyle='rgba(239,255,250,.13)';ctx.beginPath();ctx.ellipse(r()*1024,r()*512,40+r()*100,3+r()*8,-.2,0,Math.PI*2);ctx.fill();}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
export function planet(index:number){const def=PLANETS[index],g=new THREE.Group();const m=mesh(new THREE.SphereGeometry(def.radius,64,40),new THREE.MeshStandardMaterial({map:planetTexture(index),roughness:.85}),g);m.rotation.z=.13;
 const at=new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,depthWrite:false,uniforms:{tint:{value:new THREE.Color(def.atmosphere)}},vertexShader:'varying vec3 n; varying vec3 v; void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',fragmentShader:'varying vec3 n; varying vec3 v;uniform vec3 tint;void main(){float a=pow(1.-abs(dot(normalize(n),normalize(v))),3.);gl_FragColor=vec4(tint,a*.55);}'});mesh(new THREE.SphereGeometry(def.radius*1.035,48,32),at,g);
 if(index===1){for(let i=0;i<5;i++){const r=mesh(new THREE.RingGeometry(def.radius*(1.25+i*.13),def.radius*(1.34+i*.13),100),new THREE.MeshStandardMaterial({color:i%2?0xab8f94:0xe7c5aa,side:THREE.DoubleSide,transparent:true,opacity:.65,roughness:1}),g);r.rotation.x=-1.14;r.rotation.y=.21;}}
 return g;}
export function createSpace(){const scene=new THREE.Scene();sky(scene);lighting(scene);const vessel=ship();scene.add(vessel);const planets=PLANETS.map((p,i)=>{const g=planet(i);g.position.fromArray(p.position);scene.add(g);return g;});const random=seedRandom(98);const rocks=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,0),material(0x71646f),100);const matrix=new THREE.Matrix4();for(let i=0;i<100;i++){const a=random()*Math.PI*2,r=105+random()*130;matrix.compose(new THREE.Vector3(-300+Math.cos(a)*r,(random()-.5)*60,-360+Math.sin(a)*r),new THREE.Quaternion().setFromEuler(new THREE.Euler(random()*3,random()*3,0)),new THREE.Vector3().setScalar(1+random()*3));rocks.setMatrixAt(i,matrix);}scene.add(rocks);return {scene,vessel,planets};}
export function createInterior(){
 const scene=new THREE.Scene();sky(scene);lighting(scene,true);const root=new THREE.Group();scene.add(root);const obstacles:Obstacle[]=[],interactables:Interactable[]=[];
 const floor=(x:number,z:number,w:number,d:number,c=0x526d7c)=>{box(root,0x1d3449,x,-.28,z,w,.5,d);box(root,c,x,-.015,z,w-.2,.05,d-.2);};
 function wall(x:number,z:number,w:number,d:number,h=3){const wallPanel=box(root,0x314d63,x,h/2,z,w,h,d);const cap=box(root,0x789aa7,x,h,z,w+.04,.1,d+.04);for(const part of [wallPanel,cap]){part.material=(part.material as THREE.MeshStandardMaterial).clone();(part.material as THREE.MeshStandardMaterial).transparent=true;part.userData.cameraWall=true;}obstacles.push({x,z,w:w+.28,d:d+.28});}
 const furniture=(x:number,z:number,w:number,d:number,c=0x344b60,h=1)=>{box(root,c,x,h/2,z,w,h,d);obstacles.push({x,z,w:w+.5,d:d+.5});};
 floor(0,-10,26,22);floor(0,24,8,48,0x506777);
 // The open roof is a deliberate camera cutaway. Solid walls retain door openings.
 wall(-13,-10,.3,22);wall(13,-10,.3,22);wall(-8.5,1,9,.3);wall(8.5,1,9,.3);
 box(root,0x1e364c,0,1.3,-21,26,2.6,.4);const windowMat=new THREE.MeshPhysicalMaterial({color:0x8ce1e6,transparent:true,opacity:.1,roughness:.1,metalness:.2,side:THREE.DoubleSide});mesh(new THREE.PlaneGeometry(25,4.5),windowMat,root,0,3.5,-21.2);for(const x of [-12,-6,0,6,12])box(root,0xb3bdab,x,3.7,-21,.15,4.8,.15);
 const view=planet(0);view.scale.setScalar(.48);view.position.set(8,3,-78);scene.add(view);const amber=planet(1);amber.scale.setScalar(.22);amber.position.set(-35,14,-110);scene.add(amber);
 for(let z=3;z<48;z+=4){glow(root,0x78d6d4,-3.65,.08,z,.06,.03,1.9);glow(root,0x78d6d4,3.65,.08,z,.06,.03,1.9);box(root,0x7795a2,0,.025,z,7.4,.02,.04);}
 function console(x:number,z:number,accent:number,id:string,name:string){furniture(x,z,3,1.6,0x263f54,1.1);const screen=glow(root,accent,x,1.42,z-.22,2.5,.9,.12);screen.rotation.x=-.35;screen.material=new THREE.MeshBasicMaterial({map:instrumentTexture(accent,id==='helm'?'Курс / навигация':id==='terminal'?'Научный сканер':'Инженерный журнал')});for(let i=0;i<4;i++)glow(root,i%2?0xf0c465:accent,x-.9+i*.58,1.12,z+.5,.24,.04,.15);interactables.push({id,name,position:new THREE.Vector3(x,0,z+1.7),radius:2.6});}
 console(0,-17,0x6bd9d7,'helm','Пульт пилота · управление кораблём');console(-8,-12,0x78d9d0,'terminal','Научный терминал · калибровка');console(8,-12,0xe5c177,'engineering','Инженерный журнал');
 mesh(new THREE.CylinderGeometry(2.6,3,.45,48),material(0x314e64),root,0,.45,-6);const holo=mesh(new THREE.SphereGeometry(1.1,24,16),new THREE.MeshBasicMaterial({color:0x6ae1d5,wireframe:true,transparent:true,opacity:.65}),root,0,2,-6);interactables.push({id:'atlas',name:'Голографический атлас · выбор планеты',position:new THREE.Vector3(0,0,-3),radius:2.7});obstacles.push({x:0,z:-6,w:5.6,d:5.6});
 const rubka=label('01 / РУБКА','#e9dca6',5);rubka.position.set(0,5.4,-20);root.add(rubka);
 for(const [i,cabin] of CABINS.entries()){
 const {x,z,character:def}=cabin;floor(x,z,12,8,0x627a88);const side=Math.sign(x);
 wall(x,z-4,12,.22,2.5);wall(x,z+4,12,.22,2.5);wall(side*16,z,.25,8,2.8);wall(side*4,z-2.8,.2,2.4,2.7);wall(side*4,z+2.8,.2,2.4,2.7);
 glow(root,def.color,side*4,2.7,z,.25,.18,3.2);const l=label(def.name,'#eff5e9',2.6);l.position.set(side*4,3.3,z);root.add(l);
 furniture(side*12.8,z+1.7,3.9,2.3,0x354d64,.45);box(root,def.color,side*12.8,.78,z+1.95,3.8,.45,1.65);box(root,0xe8edda,side*12.8,.91,z+.95,2.6,.22,.6);
 furniture(side*12,z-2.4,3.3,1.3,0x996e4a,.95);box(root,0xe2bf79,side*12,1.02,z-2.4,3.5,.12,1.5);
 for(let j=0;j<3;j++)box(root,j%2?def.accent:def.color,side*12-.65+j*.5,1.3,z-2.5,.22,.5,.4);
 const rug=mesh(new THREE.CylinderGeometry(2,2,.025,32),material(def.color),root,side*8,.04,z);
 rug.material=new THREE.MeshStandardMaterial({color:def.color,roughness:1,transparent:true,opacity:.25});
 const port=ring(root,0xc0b47b,side*15.8,1.9,z,1,.12);port.rotation.y=Math.PI/2;const glass=mesh(new THREE.CircleGeometry(.9,28),new THREE.MeshBasicMaterial({color:0x123a58,side:THREE.DoubleSide}),root,side*15.78,1.9,z);glass.rotation.y=Math.PI/2;
 if(['kopatych','nyusha'].includes(def.id)){mesh(new THREE.CylinderGeometry(.36,.25,.6,16),material(0xbc8158),root,side*8,.35,z-2.5);for(let j=0;j<5;j++)sphere(root,0x69b78c,side*8+Math.sin(j)*.25,1+j*.08,z-2.5,.24,.5,.2);}
 if(def.id==='pin'||def.id==='bibi')sphere(root,0x7ddce4,side*12,1.5,z-2.4,.27);
 if(i===3){const book=label('СТИХИ В НЕВЕСОМОСТИ','#dfbcf2',3.5);book.position.set(x,2.5,z-3.6);root.add(book);}
 }
 floor(0,54,14,12,0x697f8b);floor(0,48,8,4);wall(-7,54,.3,12);wall(7,54,.3,12);wall(0,60,14,.3);wall(-5.4,48,3.2,.3);wall(5.4,48,3.2,.3);
 furniture(-4,56,4,2.5,0x3a5268,.5);box(root,0xd6b877,-4,.9,56,3.8,.6,2.2);box(root,0xf1eee2,-4,1.25,55.25,2.5,.18,.65);furniture(4,56,3,1.5,0x9d795a,1);const personal=label('ВАША КАЮТА','#f5d58e',4);personal.position.set(0,3.4,49);root.add(personal);const trophy=sphere(root,0x7fe7dc,4,1.65,56,.36);trophy.visible=false;interactables.push({id:'log',name:'Личный журнал экспедиции',position:new THREE.Vector3(4,0,54),radius:2.5});
 const npcs=CHARACTERS.map((def,i)=>{const g=character(def);const title=label(def.name,`#${def.color.toString(16).padStart(6,'0')}`,2.1);title.position.y=2.9;g.add(title);root.add(g);return{def,model:g,index:i};});
 return {scene,root,npcs,obstacles,interactables,holo,trophy};
}
export function createSurface(){
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x558d9d);scene.fog=new THREE.FogExp2(0x8bbdc0,.009);lighting(scene);const terrain=new THREE.Group();scene.add(terrain);
 mesh(new THREE.CylinderGeometry(62,64,1,100),material(0x78b8af),terrain,0,-.58,0);const ocean=mesh(new THREE.PlaneGeometry(3000,3000),new THREE.MeshStandardMaterial({color:0x236b83,roughness:.35,metalness:.4}),scene,0,-1,0);ocean.rotation.x=-Math.PI/2;
 const platform=mesh(new THREE.CylinderGeometry(14,14,1,64),material(0x506a79,.2),scene,0,.05,8);const landing=ring(scene,0xf0d188,0,.58,8,10,.14);landing.rotation.x=Math.PI/2;for(const x of [-11,11])glow(scene,0x8af1de,x,.6,8,.3,.15,6);
 const vessel=ship();vessel.position.set(0,5.55,8);vessel.scale.setScalar(1.1);scene.add(vessel);
 const random=seedRandom(10);for(let i=0;i<65;i++){const a=random()*Math.PI*2,r=25+random()*34;const x=Math.cos(a)*r,z=Math.sin(a)*r;const s=mesh(new THREE.IcosahedronGeometry(1,0),material(i%2?0x84aa9c:0x447e88),terrain,x,random()*.7,z);s.scale.set(1+random()*3,1+random()*4,1+random()*3);}
 const crystal=new THREE.Group();crystal.position.set(14,.1,-13);scene.add(crystal);for(let i=0;i<5;i++){const m=mesh(new THREE.OctahedronGeometry(1),new THREE.MeshStandardMaterial({color:0x91f7df,emissive:0x3bd8b8,emissiveIntensity:.7,metalness:.25,roughness:.18}),crystal,Math.sin(i*2)*1.1,1,Math.cos(i*2)*1.1);m.scale.set(.6,1.4+random(),.6);m.rotation.z=(random()-.5)*.5;}
 const beacon=label('ОБРАЗЕЦ / E','#c5fff0',4.4);beacon.position.set(14,4.8,-13);scene.add(beacon);const moon=planet(1);moon.scale.setScalar(.8);moon.position.set(-220,190,-420);scene.add(moon);return{scene,terrain,vessel,crystal,beacon,moon,platform};
}



