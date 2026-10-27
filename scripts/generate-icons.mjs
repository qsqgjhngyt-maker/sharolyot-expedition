import fs from 'node:fs';
import path from 'node:path';
import {deflateSync} from 'node:zlib';
const root=new URL('../public/',import.meta.url);
function crc32(data){let crc=0xffffffff;for(const byte of data){crc^=byte;for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return(crc^0xffffffff)>>>0;}
function chunk(type,data){const t=Buffer.from(type),size=Buffer.alloc(4),crc=Buffer.alloc(4);size.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(Buffer.concat([t,data])));return Buffer.concat([size,t,data,crc]);}
function pixel(x,y){let c=[12,29,47];const circle=(cx,cy,r)=>Math.hypot(x-cx,y-cy)<r;
 const body=circle(.5,.55,.285);if(body)c=[224,183,81];if(body&&y>.56)c=[190,145,57];if(circle(.5,.49,.274)&&y<.52)c=[132,214,216];if(Math.abs(y-.535)<.022&&Math.abs(x-.5)<.285)c=[126,98,50];for(let i=0;i<5;i++){const px=.27+i*.115;if(circle(px,.538,.027))c=[240,213,131];if(circle(px,.538,.018))c=[97,173,185];}if(Math.abs(x-.5)<.008&&y>.198&&y<.255)c=[239,207,120];if(circle(.5,.193,.015))c=[245,210,118];if(circle(.76,.22,.014)||circle(.24,.23,.009))c=[243,225,171];if(circle(.5,.55,.285)&&!circle(.5,.55,.274))c=[249,211,116];return c;}
for(const size of [180,192,512]){const data=Buffer.alloc((size*4+1)*size);for(let y=0;y<size;y++){const row=y*(size*4+1);data[row]=0;for(let x=0;x<size;x++){const rgb=[0,0,0];for(let sy=0;sy<2;sy++)for(let sx=0;sx<2;sx++){const c=pixel((x+(sx+.5)/2)/size,(y+(sy+.5)/2)/size);for(let k=0;k<3;k++)rgb[k]+=c[k]/4;}for(let k=0;k<3;k++)data[row+1+x*4+k]=Math.round(rgb[k]);data[row+1+x*4+3]=255;}}const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(size,0);ihdr.writeUInt32BE(size,4);ihdr[8]=8;ihdr[9]=6;const png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(data)),chunk('IEND',Buffer.alloc(0))]);fs.writeFileSync(new URL(`icon-${size}.png`,root),png);}
console.log('App icons: 180, 192, 512 px');
