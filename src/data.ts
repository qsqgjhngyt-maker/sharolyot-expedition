export interface Character { id:string; name:string; color:number; accent:number; kind:string; role:string; activity:string; line:string }
export const CHARACTERS: Character[] = [
{id:'krosh',name:'Крош',color:0x64cde5,accent:0x2b9ec7,kind:'rabbit',role:'Исследователь',activity:'тренируется',line:'Если планета круглая, её можно обежать! Только сначала наденем скафандр.'},
{id:'ezhik',name:'Ёжик',color:0xcf719d,accent:0x6f3f85,kind:'hedgehog',role:'Навигатор',activity:'изучает карту',line:'Я отметил безопасные орбиты. Не торопись: красота космоса любит внимательных.'},
{id:'nyusha',name:'Нюша',color:0xf4a1c3,accent:0xd94971,kind:'pig',role:'Хранительница уюта',activity:'ухаживает за цветами',line:'У каждого открытия должно быть красивое название. Лазурная — уже неплохо!'},
{id:'barash',name:'Бараш',color:0xc7a1d5,accent:0x725081,kind:'sheep',role:'Бортовой поэт',activity:'пишет стихи',line:'В иллюминаторе звезда… А рифма снова — пустота. Принесёшь мне вдохновение?'},
{id:'pin',name:'Пин',color:0x343d51,accent:0xec8247,kind:'penguin',role:'Главный инженер',activity:'проверяет двигатель',line:'Хороший корабль начинается с любопытства и исправного гаечного ключа!'},
{id:'losyash',name:'Лосяш',color:0xf5bc54,accent:0x9e5b35,kind:'moose',role:'Учёный',activity:'проводит опыт',line:'Атмосфера Лазурной рассеивает голубой свет. Образец кристалла поможет проверить нашу гипотезу.'},
{id:'sovunya',name:'Совунья',color:0x9b72bd,accent:0xd8874a,kind:'owl',role:'Бортовой врач',activity:'заваривает чай',line:'Разминка, чай и крепкий сон. Даже космическим путешественникам нужен режим.'},
{id:'karkarych',name:'Кар-Карыч',color:0x6485c6,accent:0xe5ac53,kind:'crow',role:'Хранитель историй',activity:'репетирует мелодию',line:'Однажды я уже бывал у похожей звезды… Впрочем, лучше расскажу за чаем.'},
{id:'kopatych',name:'Копатыч',color:0xc98a48,accent:0x8e542e,kind:'bear',role:'Космический садовод',activity:'выращивает зелень',line:'Ох, укуси меня пчела! Салат в невесомости растёт, а поливать всё равно надо.'},
{id:'bibi',name:'Биби',color:0xf3d151,accent:0x56bdca,kind:'robot',role:'Маленький механик',activity:'сортирует детали',line:'Бип-бип! [Все системы готовы к приключению.]'}
];
export const PLANETS = [
{id:'azure',name:'Лазурная',tag:'Океанический мир',position:[0,0,-300] as const,radius:48,color:0x2b92a3,atmosphere:0x75e2f2,landable:true},
{id:'amber',name:'Янтарь',tag:'Газовый гигант · кольца',position:[370,95,-630] as const,radius:87,color:0xdb9c76,atmosphere:0xfac99b,landable:false},
{id:'lilac',name:'Сирень',tag:'Кристаллический мир',position:[-340,-50,-560] as const,radius:59,color:0x8d79bb,atmosphere:0xc5b3ff,landable:true}
];
export const CABINS=CHARACTERS.map((character,i)=>({character,x:i%2===0?-11:11,z:8+Math.floor(i/2)*9}));
