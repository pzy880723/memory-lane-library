import http from 'node:http';
import {readFile, writeFile, mkdir, rename, stat, realpath, readdir, unlink} from 'node:fs/promises';
import {resolve, join, extname, sep} from 'node:path';
import {createHash, randomBytes, scryptSync, timingSafeEqual} from 'node:crypto';

const digest = value => createHash('sha256').update(value).digest('hex');
const stable = value => value === null || typeof value !== 'object' ? JSON.stringify(value) : Array.isArray(value) ? `[${value.map(stable).join(',')}]` : `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stable(value[k])}`).join(',')}}`;
const failure = (status, message) => Object.assign(new Error(message), {status});
const MIME = {'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.pdf':'application/pdf','.pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation','.json':'application/json'};
export function passwordHash(password, salt = randomBytes(16).toString('hex')) {return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;}
function checkPassword(password, hashes) {return hashes.some(value => {const [salt, hash] = value.split(':'); const actual=scryptSync(password,salt,64);const expected=Buffer.from(hash,'hex');return actual.length===expected.length && timingSafeEqual(actual,expected);});}
async function readJson(path, fallback) {try{return JSON.parse(await readFile(path,'utf8'));}catch(e){if(e.code==='ENOENT')return fallback;throw e;}}
async function atomic(path, bytes) {await mkdir(resolve(path,'..'),{recursive:true});const temp=path+'.'+randomBytes(8).toString('hex')+'.tmp';await writeFile(temp,bytes,{mode:0o600,flag:'wx'});await rename(temp,path);}
async function body(req, max=20*1024*1024) {const chunks=[];let size=0;for await(const b of req){size+=b.length;if(size>max)throw failure(413,'文件过大');chunks.push(b);}return Buffer.concat(chunks);}
async function jsonBody(req) {try{return JSON.parse((await body(req)).toString());}catch(e){if(e.status)throw e;throw failure(400,'无效请求');}}

export async function createBookServer(options) {
  const {site, dataDir, passwordHashes, secureCookie=true, slideCount=39, release='book-selfhosted-20261102-r1'}=options;
  if(!passwordHashes?.length)throw new Error('Editor password hashes required');
  await mkdir(dataDir,{recursive:true});
  const contentPath=join(dataDir,'content.json'),sessionPath=join(dataDir,'sessions.json');
  let content=await readJson(contentPath,{version:1,updatedAt:new Date().toISOString(),slides:{}});
  const sessions=await readJson(sessionPath,{}),attempts=new Map();
  let writes=Promise.resolve(), renders=Promise.resolve(), renderer;
  const inflight=new Map();
  const locked=fn=>{const next=writes.then(fn);writes=next.catch(()=>{});return next;};
  const revision=()=>digest(JSON.stringify(content));
  const exportHash=()=>digest(`${release}|n=${slideCount}|${stable(content.slides)}`);
  const authorized=req=>{const token=req.headers.cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith('book_session='))?.slice(13);return token && sessions[digest(token)]>Date.now();};
  const requireEditor=req=>{if(!authorized(req))throw failure(401,'请先进入内容编辑');};
  const cookie=(token,age)=>`book_session=${token}; Path=/api/book; HttpOnly; SameSite=Strict; Max-Age=${age}${secureCookie?'; Secure':''}`;
  function send(res,status,value,headers={}) {const bytes=Buffer.isBuffer(value)?value:Buffer.from(JSON.stringify(value));res.writeHead(status,{'content-type':Buffer.isBuffer(value)?'application/octet-stream':'application/json; charset=utf-8','cache-control':'no-store',...headers});res.end(bytes);}
  async function file(res,root,relative) {
    const path=resolve(root,relative);if(!path.startsWith(resolve(root)+sep))throw failure(404,'文件不存在');
    let actual;try{actual=await realpath(path);}catch{throw failure(404,'文件不存在');}
    if(!actual.startsWith((await realpath(root))+sep)||(await stat(actual)).isDirectory())throw failure(404,'文件不存在');
    send(res,200,await readFile(actual),{'content-type':MIME[extname(actual)]||'application/octet-stream','cache-control':actual.endsWith('.html')?'no-store':'public, max-age=31536000, immutable'});
  }
  const server=http.createServer(async(req,res)=>{
    res.setHeader('X-Book-Backend','101-selfhosted');res.setHeader('X-Book-Release',release);
    res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self'; connect-src 'self'; frame-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'");
    try {
      const url=new URL(req.url,'http://localhost'),path=url.pathname;
      if(!['GET','HEAD'].includes(req.method) && req.headers.origin) {
        const allowed=new Set([options.origin,`http://${req.headers.host}`]);
        if(!allowed.has(req.headers.origin))throw failure(403,'来源不允许');
      }
      if(path==='/api/book/health')return send(res,200,{ok:true,backend:'selfhosted',release,slideCount});
      if(path==='/api/book/session'&&req.method==='GET')return send(res,authorized(req)?200:401,{authenticated:!!authorized(req)});
      if(path==='/api/book/login'&&req.method==='POST') {
        if(!req.headers['content-type']?.startsWith('application/json'))throw failure(400,'无效请求');
        const ip=req.socket.remoteAddress,prior=attempts.get(ip);
        if(prior?.count>=8&&prior.until>Date.now())throw failure(429,'尝试过多，请稍后再试');
        const {password}=await jsonBody(req);
        if(typeof password!=='string'||password.length>200||!checkPassword(password.trim(),passwordHashes)){attempts.set(ip,{count:(prior?.until>Date.now()?prior.count:0)+1,until:Date.now()+600000});throw failure(401,'密码不正确');}
        attempts.delete(ip);const token=randomBytes(32).toString('hex');sessions[digest(token)]=Date.now()+43200000;
        for(const k of Object.keys(sessions))if(sessions[k]<Date.now())delete sessions[k];
        await locked(()=>atomic(sessionPath,JSON.stringify(sessions)));
        return send(res,200,{authenticated:true},{'set-cookie':cookie(token,43200)});
      }
      if(path==='/api/book/logout'&&req.method==='POST') {
        const token=req.headers.cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith('book_session='))?.slice(13);
        if(token){delete sessions[digest(token)];await locked(()=>atomic(sessionPath,JSON.stringify(sessions)));}
        return send(res,200,{authenticated:false},{'set-cookie':cookie('',0)});
      }
      if(path==='/api/book/content'&&req.method==='GET') {
        const v=url.searchParams.get('version');let data=content;
        if(v){if(!/^[a-f0-9]{64}$/.test(v))throw failure(400,'无效版本');data=await readJson(join(dataDir,'render-snapshots',v+'.json'),null);if(!data)throw failure(404,'版本不存在');}
        return send(res,200,{data,revision:digest(JSON.stringify(data))});
      }
      if(path==='/api/book/content'&&req.method==='PUT') {
        requireEditor(req);const next=await jsonBody(req);
        if(next.version!==1||!next.slides||Array.isArray(next.slides)||typeof next.slides!=='object')throw failure(400,'无效内容');
        const result=await locked(async()=>{
          if(req.headers['if-match']!==revision())throw failure(409,'内容已在其他窗口更新，请刷新后再修改');
          await atomic(join(dataDir,'snapshots',Date.now()+'-'+revision()+'.json'),JSON.stringify(content));
          const updated={...next,updatedAt:new Date().toISOString()};await atomic(contentPath,JSON.stringify(updated));content=updated;
          const snapshots=(await readdir(join(dataDir,'snapshots'))).sort();for(const name of snapshots.slice(0,-50))await unlink(join(dataDir,'snapshots',name));
          return {data:content,revision:revision()};
        });return send(res,200,result);
      }
      if(path==='/api/book/images'&&req.method==='POST') {
        requireEditor(req);const bytes=await body(req),type=req.headers['content-type']?.split(';')[0];
        const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'}[type];
        const valid=ext==='jpg'?bytes.subarray(0,3).equals(Buffer.from([255,216,255])):ext==='png'?bytes.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')):ext==='gif'?bytes.subarray(0,3).toString()==='GIF':ext==='webp'&&bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP';
        if(!valid)throw failure(400,'请选择JPG、PNG、WebP或GIF图片');
        const name='editor-images/uploads/'+randomBytes(20).toString('hex')+'.'+ext;await atomic(join(dataDir,'storage',name),bytes);
        return send(res,200,{url:'/book-files/'+name});
      }
      if(path==='/api/book/exports/version'&&req.method==='GET') {
        const hash=exportHash(),target=join(dataDir,'render-snapshots',hash+'.json');
        await mkdir(resolve(target,'..'),{recursive:true});try{await writeFile(target,JSON.stringify(content),{flag:'wx',mode:0o600});}catch(e){if(e.code!=='EEXIST')throw e;}
        return send(res,200,{hash,total:slideCount});
      }
      if(path==='/api/book/exports/cache'&&req.method==='GET') {
        const type=url.searchParams.get('type'),hash=url.searchParams.get('hash');
        if(!['pdf','pptx'].includes(type)||!/^[a-f0-9]{64}$/.test(hash))throw failure(400,'无效导出');
        const name=`exports/current/${hash}.${type}`;let exists=false;try{exists=(await stat(join(dataDir,'storage',name))).isFile();}catch{}
        return send(res,200,{url:exists?'/book-files/'+name:null});
      }
      const exported=path.match(/^\/api\/book\/exports\/(pdf|pptx)\/([a-f0-9]{64})$/);
      if(exported&&req.method==='PUT') {
        requireEditor(req);const [,type,hash]=exported;
        if(!await readJson(join(dataDir,'render-snapshots',hash+'.json'),null))throw failure(404,'版本不存在');
        const bytes=await body(req,100*1024*1024);
        if(type==='pdf'?!bytes.subarray(0,5).equals(Buffer.from('%PDF-')):!bytes.subarray(0,2).equals(Buffer.from('PK')))throw failure(400,'无效导出文件');
        const name=`exports/current/${hash}.${type}`;await atomic(join(dataDir,'storage',name),bytes);return send(res,200,{url:'/book-files/'+name});
      }
      if(path==='/api/book/render'&&req.method==='POST') {
        const input=await jsonBody(req),{index,hash}=input;
        if(Object.keys(input).some(k=>!['index','hash'].includes(k))||!Number.isInteger(index)||index<1||index>slideCount||!/^[a-f0-9]{64}$/.test(hash))throw failure(400,'无效页面');
        if(!await readJson(join(dataDir,'render-snapshots',hash+'.json'),null))throw failure(404,'版本不存在');
        const target=join(dataDir,'renders',hash,index+'.jpg');let bytes;
        try{bytes=await readFile(target);}catch(e){if(e.code!=='ENOENT')throw e;}
        if(!bytes){
          const key=hash+'/'+index;
          if(!inflight.has(key)){
            const task=renders.then(async()=>{
              if(!options.render&&!renderer){const {createRenderer}=await import('./render.mjs');renderer=await createRenderer(`http://127.0.0.1:${server.address().port}`);}
              const image=Buffer.from(await (options.render||renderer.render)(index,hash));await atomic(target,image);return image;
            });renders=task.catch(()=>{});inflight.set(key,task);task.finally(()=>inflight.delete(key)).catch(()=>{});
          }bytes=await inflight.get(key);
        }return send(res,200,bytes,{'content-type':'image/jpeg'});
      }
      if(path.startsWith('/api/'))throw failure(404,'接口不存在');
      if(req.method!=='GET'&&req.method!=='HEAD')throw failure(405,'方法不允许');
      if(path.startsWith('/book-files/'))return await file(res,join(dataDir,'storage'),decodeURIComponent(path.slice(12)));
      const name=path==='/'||/^\/print\/\d+$/.test(path)?'index.html':decodeURIComponent(path.slice(1));
      return await file(res,site,name);
    }catch(e){if(!res.headersSent)send(res,e.status||500,{error:e.status?e.message:'服务暂时不可用'});else res.end();if(!e.status)console.error(e);}
  });
  server.requestTimeout=180000;
  return {server,listen:(port,host='0.0.0.0')=>new Promise(resolve=>server.listen(port,host,resolve)),close:async()=>{await renderer?.close();await new Promise(resolve=>server.close(resolve));}};
}
