import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createBookServer, passwordHash} from './book.mjs';

test('self-hosted editing rejects unauthorized writes, detects conflicts and persists after restart', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'book-test-'));
  const site = join(dir, 'site'); await mkdir(site); await writeFile(join(site,'index.html'), '<h1>book</h1>');
  const options = {site, dataDir:join(dir,'data'), secret:'a'.repeat(64), passwordHashes:[passwordHash('fixture-only')], secureCookie:false, render:async () => Buffer.from([255,216,255,217])};
  let app = await createBookServer(options); await app.listen(0,'127.0.0.1');
  let base = `http://127.0.0.1:${app.server.address().port}`;
  const call=(path,init={})=>fetch(base+path,init);
  try {
    assert.equal((await call('/api/book/content',{method:'PUT',body:'{}'})).status,401);
    assert.equal((await call('/api/book/login',{method:'POST',headers:{'content-type':'application/json',Origin:'https://evil.example'},body:'{"password":"fixture-only"}'})).status,403);
    const login = await call('/api/book/login',{method:'POST',headers:{'content-type':'application/json'},body:'{"password":"fixture-only"}'});
    assert.equal(login.status,200); const cookie=login.headers.get('set-cookie').split(';')[0];
    assert.equal((await call('/api/book/session',{headers:{cookie}})).status,200);
    const original=await (await call('/api/book/content')).json();
    const data={...original.data,slides:{37:{texts:{},images:{'image:id:store-wenzhou-exterior':{src:'/book-files/editor-images/fixture.jpg'}}}}};
    const save=await call('/api/book/content',{method:'PUT',headers:{cookie,'content-type':'application/json','if-match':original.revision},body:JSON.stringify(data)});
    assert.equal(save.status,200);
    assert.equal((await call('/api/book/content',{method:'PUT',headers:{cookie,'content-type':'application/json','if-match':original.revision},body:JSON.stringify(data)})).status,409);
    const snapshot=await (await call('/api/book/exports/version')).json();
    assert.equal(snapshot.hash.length,64);
    assert.equal((await call('/api/book/render',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({index:40,hash:snapshot.hash})})).status,400);
    assert.equal((await call('/api/book/render',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({index:1,hash:snapshot.hash,url:'http://169.254.169.254/'})})).status,400);
    assert.equal((await call('/api/book/render',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({index:1,hash:snapshot.hash})})).status,200);
    const png=Buffer.from('89504e470d0a1a0a','hex');
    const upload=await call('/api/book/images',{method:'POST',headers:{cookie,'content-type':'image/png'},body:png});
    assert.equal(upload.status,200); const image=await upload.json(); assert.deepEqual(Buffer.from(await (await call(image.url)).arrayBuffer()),png);
    assert.equal((await call('/api/book/images',{method:'POST',headers:{cookie,'content-type':'image/png'},body:'<script/>'})).status,400);
    assert.equal((await call('/api/book/exports/pdf/'+snapshot.hash,{method:'PUT',headers:{cookie,'content-type':'application/pdf'},body:'%PDF-fixture'})).status,200);
    assert.ok((await (await call('/api/book/exports/cache?type=pdf&hash='+snapshot.hash)).json()).url);
    await app.close(); app=await createBookServer(options); await app.listen(0,'127.0.0.1'); base=`http://127.0.0.1:${app.server.address().port}`;
    assert.deepEqual((await (await call('/api/book/content')).json()).data.slides,data.slides);
    assert.deepEqual((await (await call('/api/book/content?version='+snapshot.hash)).json()).data.slides,data.slides);
    assert.equal((await call('/api/book/session',{headers:{cookie}})).status,200);
    await call('/api/book/logout',{method:'POST',headers:{cookie}});
    assert.equal((await call('/api/book/session',{headers:{cookie}})).status,401);
  } finally {await app.close();await rm(dir,{recursive:true,force:true});}
});
