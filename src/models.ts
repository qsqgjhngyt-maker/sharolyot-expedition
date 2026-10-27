import * as THREE from 'three';
import type {Character} from './data';
const mats=new Map<string,THREE.MeshStandardMaterial>();
export function material(color:number,metal=0,rough=.65){const key=`${color}/${metal}/${rough}`;let m=mats.get(key);if(!m){m=new THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough});mats.set(key,m);}return m;}
export function mesh(geometry:THREE.BufferGeometry,mat:THREE.Material,parent:THREE.Object3D,x=0,y=0,z=0){const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
const ball=new THREE.SphereGeometry(1,24,16), cube=new THREE.BoxGeometry(1,1,1);
export function sphere(p:THREE.Object3D,c:number,x:number,y:number,z:number,sx:number,sy=sx,sz=sx){const m=mesh(ball,material(c),p,x,y,z);m.scale.set(sx,sy,sz);return m;}
export function box(p:THREE.Object3D,c:number,x:number,y:number,z:number,w:number,h:number,d:number){const m=mesh(cube,material(c),p,x,y,z);m.scale.set(w,h,d);return m;}
export function rod(p:THREE.Object3D,c:number,a:THREE.Vector3,b:THREE.Vector3,r=.06){const d=b.clone().sub(a);const m=mesh(new THREE.CylinderGeometry(r,r,d.length(),10),material(c),p);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
export function ring(p:THREE.Object3D,c:number,x:number,y:number,z:number,r:number,tube:number){return mesh(new THREE.TorusGeometry(r,tube,8,48),material(c,.45,.32),p,x,y,z);}
export function glow(p:THREE.Object3D,c:number,x:number,y:number,z:number,w:number,h:number,d:number){const m=box(p,c,x,y,z,w,h,d);m.material=new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:1.8,roughness:.35});m.castShadow=false;return m;}
export function label(text:string,color='#e5f6f1',width=4){const canvas=document.createElement('canvas');canvas.width=768;canvas.height=128;const c=canvas.getContext('2d')!;c.font='600 44px Segoe UI, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle='rgba(10,23,35,.82)';c.beginPath();c.roundRect(12,12,744,104,24);c.fill();c.fillStyle=color;c.fillText(text,384,66);const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:true,transparent:true}));sprite.scale.set(width,width/6,1);return sprite;}
export function character(def:Character,scale=1){
 const g=new THREE.Group();g.userData.character=def.id;
 const body=sphere(g,def.color,0,1.04,0,.85,.83,.79);
 const faceZ=.69;
 if(def.kind==='penguin'){sphere(g,0xe9eee2,0,.94,.42,.63,.65,.43);sphere(g,0xa65d34,0,1.82,0,.68,.27,.63);for(const x of [-.34,.34]){ring(g,0x713e27,x,1.79,.51,.22,.07);sphere(g,0x94d5df,x,1.79,.53,.17,.17,.07);}}
 if(def.kind==='rabbit'){for(const x of [-.36,.36]){const e=sphere(g,def.color,x,2.02,-.03,.23,.8,.21);e.rotation.z=-x*.5;const inner=sphere(g,0x9fe9ee,x,2.07,.13,.115,.54,.04);inner.rotation.z=-x*.5;}box(g,0xfffcdf,0,.78,.82,.23,.23,.08);}
 if(def.kind==='hedgehog'){for(let i=0;i<11;i++){const a=(i/10)*Math.PI;const s=mesh(new THREE.ConeGeometry(.28,.67,5),material(def.accent),g,Math.cos(a)*.75,1.12+Math.sin(a)*.85,-.25);s.rotation.z=a-Math.PI/2;}for(const x of [-.3,.3]){ring(g,0x4a2558,x,1.23,.77,.27,.045);}rod(g,0x4a2558,new THREE.Vector3(-.05,1.25,.81),new THREE.Vector3(.05,1.25,.81),.025);}
 if(def.kind==='pig'){sphere(g,def.accent,0,1.02,.76,.27,.19,.12);for(const x of [-.1,.1])sphere(g,0x8d3c66,x,1.03,.87,.03);for(const x of [-.62,.62]){const ear=mesh(new THREE.ConeGeometry(.23,.42,3),material(def.color),g,x,1.75,0);ear.rotation.z=-x*.7;}for(let i=0;i<4;i++)sphere(g,def.accent,-.18+i*.15,1.85+i*.035,-.08,.18);sphere(g,0xffebd1,.35,2.03,0,.13);}
 if(def.kind==='sheep'){for(let i=0;i<16;i++){const a=i/16*Math.PI*2;sphere(g,def.color,Math.cos(a)*.7,1.06+Math.sin(a)*.7,-.15,.24);}for(const x of [-.67,.67]){const r=ring(g,def.accent,x,1.58,0,.22,.1);r.rotation.y=.3;}}
 if(def.kind==='moose'){for(const sign of [-1,1]){rod(g,def.accent,new THREE.Vector3(sign*.48,1.68,0),new THREE.Vector3(sign*.87,2.45,-.03),.09);for(let i=0;i<3;i++)rod(g,def.accent,new THREE.Vector3(sign*(.62+i*.12),1.98+i*.2,0),new THREE.Vector3(sign*(1.05+i*.07),2.03+i*.27,0),.065);}sphere(g,0xe78c3b,0,.99,.84,.26,.22,.2);}
 if(def.kind==='owl'||def.kind==='crow'){for(const x of [-.29,.29])sphere(g,def.kind==='owl'?0xe1b3d2:0xc6d9e5,x,1.25,.65,.34,.4,.15);const beak=mesh(new THREE.ConeGeometry(.23,.46,4),material(0xf0b54f),g,0,.96,.93);beak.rotation.x=Math.PI/2;if(def.kind==='owl'){sphere(g,0xe69f66,0,1.87,0,.49,.22,.48);sphere(g,0xf4d9be,.18,2.04,0,.16);}else{box(g,0x4b2a67,0,.55,.76,.4,.12,.12);}}
 if(def.kind==='bear'){for(const x of [-.62,.62])sphere(g,def.color,x,1.73,-.02,.28);sphere(g,0xf4be76,0,.91,.69,.46,.35,.17);mesh(new THREE.CylinderGeometry(.43,.65,.1,28),material(0xf1d37a),g,0,1.88,0);mesh(new THREE.CylinderGeometry(.31,.34,.24,24),material(0xeac772),g,0,2.03,0);}
 if(def.kind==='robot'){body.material=material(def.color,.65,.25);const visor=sphere(g,0x27576a,0,1.23,.62,.65,.34,.18);visor.material=material(0x285264,.55,.2);rod(g,0x8dcbd4,new THREE.Vector3(0,1.7,0),new THREE.Vector3(0,2.15,0),.05);sphere(g,0xe97159,0,2.2,0,.13);}
 for(const x of [-.28,.28]){if(def.kind!=='robot')sphere(g,0xfffbed,x,1.27,faceZ,.235,.285,.13);sphere(g,def.kind==='robot'?0x91ffff:0x1b273b,x,1.27,faceZ+.105,.095,.14,.045);sphere(g,0xffffff,x-.025,1.32,faceZ+.148,.029);}
 if(!['pig','moose','owl','crow'].includes(def.kind))sphere(g,def.kind==='penguin'?0xeea047:0x664164,0,1.01,.82,.12,.09,.12);
 const smile=new THREE.EllipseCurve(0,0,.22,.115,Math.PI,Math.PI*2,false,0);const smileGeo=new THREE.BufferGeometry().setFromPoints(smile.getPoints(16).map(p=>new THREE.Vector3(p.x,p.y+.86,.79)));g.add(new THREE.Line(smileGeo,new THREE.LineBasicMaterial({color:0x57415b})));
 const feet:THREE.Mesh[]=[];for(const x of [-.43,.43]){feet.push(sphere(g,def.kind==='penguin'?0xf2a444:def.accent,x,.22,.18,.31,.19,.43));const arm=sphere(g,def.color,Math.sign(x)*.86,.95,0,.21,.4,.21);arm.rotation.z=Math.sign(x)*.4;}
 g.userData.feet=feet;g.scale.setScalar(scale);return g;
}
export function animateCharacter(g:THREE.Group,t:number,moving:boolean){g.position.y=moving?Math.abs(Math.sin(t*9))*.1:Math.sin(t*2)*.025;const feet=g.userData.feet as THREE.Mesh[];feet?.forEach((f,i)=>f.position.z=.18+(moving?Math.sin(t*9+i*Math.PI)*.18:0));}
export function ship(){
 const g=new THREE.Group(),gold=0xcba94c,trim=0x79653a;
 const hull=sphere(g,gold,0,0,0,5,4.7,5);hull.material=material(gold,.55,.32);
 const dome=mesh(new THREE.SphereGeometry(4.93,48,24,0,Math.PI*2,0,Math.PI/2),new THREE.MeshPhysicalMaterial({color:0x94e3e1,metalness:.2,roughness:.18,clearcoat:1,transparent:true,opacity:.84}),g,0,.5,0);dome.scale.y=.91;
 for(const y of [.1,.65,-.45]){const r=ring(g,y===.1?trim:gold,0,y,0,5.04,.13);r.rotation.x=Math.PI/2;}
 for(let i=0;i<10;i++){const a=i/10*Math.PI*2;const port=new THREE.Group();g.add(port);port.position.set(Math.sin(a)*4.97,.08,Math.cos(a)*4.97);port.rotation.y=a;ring(port,0xe5c76e,0,0,0,.59,.13);const glass=sphere(port,0x8fdae2,0,0,.06,.49,.49,.19);glass.material=material(0x8fdae2,.65,.18);}
 for(const a of [-.8,.8]){const arc=new THREE.EllipseCurve(0,0,4.99,4.5,0,Math.PI,false,0);const points=arc.getPoints(40).map(p=>new THREE.Vector3(p.x,p.y+.5,0));const frame=mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),40,.08,8,false),material(gold,.6,.3),g);frame.rotation.y=a;}
 const door=box(g,trim,0,-2,-4.2,2.3,2.5,.18);door.rotation.x=.4;box(g,0xd9be75,0,-1.9,-4.38,1.9,2.1,.1);
 for(const x of [-3.1,3.1]){const eng=mesh(new THREE.CylinderGeometry(.7,.85,2.9,20),material(0x526272,.65,.3),g,x,-1.4,3.5);eng.rotation.x=Math.PI/2;const e=glow(g,0x77e6ec,x,-1.4,5.05,.9,.9,.08);e.geometry=new THREE.CircleGeometry(.53,24);const flame=sphere(g,0x9ffaff,x,-1.4,5.4,.4,.4,.8);flame.material=new THREE.MeshBasicMaterial({color:0x8cffff,transparent:true,opacity:.6});flame.userData.flame=true;}
 for(const x of [-2.6,2.6])for(const z of [-1.8,1.8]){rod(g,0x7a7e7e,new THREE.Vector3(x,-3.1,z),new THREE.Vector3(x,-5,z),.16);const wheel=mesh(new THREE.CylinderGeometry(.47,.47,.4,16),material(0x303644),g,x,-4.9,z);wheel.rotation.z=Math.PI/2;}
 rod(g,gold,new THREE.Vector3(0,3.8,0),new THREE.Vector3(0,6.1,.3),.09);sphere(g,0xf59e64,0,6.2,.3,.19);
 return g;
}
export function seedRandom(seed=13){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
// A screen texture is drawn in code; no copyrighted image assets are used.
export function instrumentTexture(accent:number,title:string){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=192;const c=canvas.getContext('2d')!;c.fillStyle='#102a38';c.fillRect(0,0,512,192);const color='#'+accent.toString(16).padStart(6,'0');c.strokeStyle=color;c.fillStyle=color;c.lineWidth=2;c.font='600 20px Segoe UI';c.fillText(title.toUpperCase(),20,32);c.globalAlpha=.32;for(let x=20;x<500;x+=30){c.beginPath();c.moveTo(x,53);c.lineTo(x,170);c.stroke();}for(let y=50;y<190;y+=30){c.beginPath();c.moveTo(20,y);c.lineTo(490,y);c.stroke();}c.globalAlpha=1;c.beginPath();for(let x=20;x<310;x+=3){const y=110+Math.sin(x*.065)*18+Math.sin(x*.03)*12;if(x===20)c.moveTo(x,y);else c.lineTo(x,y);}c.stroke();c.beginPath();c.arc(405,113,47,0,Math.PI*2);c.moveTo(350,113);c.lineTo(460,113);c.moveTo(405,58);c.lineTo(405,168);c.stroke();c.font='12px Segoe UI';c.fillText('СИСТЕМЫ В НОРМЕ / 100%',24,177);const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;return tex;}
