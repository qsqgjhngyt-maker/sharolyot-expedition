export type Quest='meet'|'calibrate'|'fly'|'sample'|'return'|'done';
export type Mode='space'|'interior'|'surface'|'eva';
export interface Save {version:1;character:string;quest:Quest;souvenir:boolean;elapsed:number;ship:[number,number,number];yaw:number;pitch:number;target:number;landed:string|null}
export const QUESTS:Record<Quest,{title:string;detail:string;step:string}>={
meet:{title:'Знакомство с экипажем',detail:'Зайдите в корабль [F] и поговорите с Пином в рубке.',step:'01 / 06'},
calibrate:{title:'Настроить навигацию',detail:'Найдите бирюзовый научный терминал в рубке и нажмите E.',step:'02 / 06'},
fly:{title:'Курс на Лазурную',detail:'Выйдите в режим полёта [F]. Подлетите к Лазурной и нажмите L для посадки.',step:'03 / 06'},
sample:{title:'Первый контакт с планетой',detail:'Выйдите на поверхность [G] и возьмите светящийся кристалл [E].',step:'04 / 06'},
return:{title:'Доставить образец',detail:'Вернитесь на корабль [F] и передайте образец Лосяшу в рубке [E].',step:'05 / 06'},
done:{title:'Открытие состоялось!',detail:'Образец изучен. Исследуйте корабль, поговорите с экипажем и откройте другие миры.',step:'06 / 06'}};
export function advanceQuest(current:Quest,event:string):Quest{const t:Partial<Record<Quest,[string,Quest]>>={meet:['pin','calibrate'],calibrate:['terminal','fly'],fly:['land:azure','sample'],sample:['crystal:azure','return'],return:['losyash','done']};const n=t[current];return n?.[0]===event?n[1]:current;}
export interface Rect{x:number;z:number;w:number;d:number}
export const WALK_AREAS:Rect[]=[{x:0,z:-10,w:26,d:22},{x:0,z:24,w:8,d:48},{x:0,z:54,w:14,d:12},{x:0,z:48,w:8,d:4},...Array.from({length:5},(_,i)=>[{x:-4,z:8+i*9,w:3,d:3},{x:4,z:8+i*9,w:3,d:3}]).flat(),...Array.from({length:5},(_,i)=>[{x:-10,z:8+i*9,w:12,d:8},{x:10,z:8+i*9,w:12,d:8}]).flat()];
export function canWalk(x:number,z:number):boolean{return WALK_AREAS.some(r=>x>r.x-r.w/2+.35&&x<r.x+r.w/2-.35&&z>r.z-r.d/2+.35&&z<r.z+r.d/2-.35);}
export function schedulePhase(elapsed:number,index:number):number{return Math.floor((elapsed+index*7)/36)%3;}
export function validateSave(value:unknown,ids:string[]):Save|null{if(!value||typeof value!=='object')return null;const s=value as Save;if(s.version!==1||!ids.includes(s.character)||!Object.hasOwn(QUESTS,s.quest)||typeof s.souvenir!=='boolean'||!Number.isFinite(s.elapsed)||s.elapsed<0||!Array.isArray(s.ship)||s.ship.length!==3||!s.ship.every(n=>Number.isFinite(n)&&Math.abs(n)<10000)||!Number.isFinite(s.yaw)||!Number.isFinite(s.pitch)||!Number.isInteger(s.target)||s.target<0||s.target>2||![null,'azure','lilac'].includes(s.landed))return null;return s;}

