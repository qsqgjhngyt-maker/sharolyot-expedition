import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {spawn} from 'node:child_process';
const root=path.resolve(fileURLToPath(new URL('./dist/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const server=http.createServer(async(req,res)=>{try{if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}const url=new URL(req.url,'http://127.0.0.1');let pathname=decodeURIComponent(url.pathname);if(pathname==='/')pathname='/index.html';const file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)&&file!==path.join(root,'index.html')){res.writeHead(403);res.end();return;}const info=await stat(file);if(!info.isFile()){res.writeHead(404);res.end();return;}const body=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':body.length,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);}catch{res.writeHead(404);res.end('File not found');}});
let port=5173;
function listen(){server.listen(port,'127.0.0.1');}
server.on('error',err=>{if(err.code==='EADDRINUSE'&&port<5183){port++;listen();}else{console.error(err.message);process.exitCode=1;}});
server.on('listening',()=>{const url=`http://127.0.0.1:${port}/`;console.log(`\nШаролёт — Дальше звёзд\n${url}\n\nОставьте это окно открытым. Ctrl+C — остановить игру.\n`);if(process.argv.includes('--open')){if(process.platform==='win32')spawn('rundll32.exe',['url.dll,FileProtocolHandler',url],{detached:true,stdio:'ignore',windowsHide:true}).unref();else console.log('Откройте адрес выше в браузере.');}});
process.on('SIGINT',()=>server.close(()=>process.exit(0)));
listen();

