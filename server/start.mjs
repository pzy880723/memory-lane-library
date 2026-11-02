import {readFile} from 'node:fs/promises';
import {createBookServer} from './book.mjs';
const config=JSON.parse(await readFile(process.env.BOOK_CONFIG||'/data/config.json','utf8'));
const app=await createBookServer({site:process.env.BOOK_SITE||'/app/site',dataDir:process.env.BOOK_DATA||'/data',...config});
await app.listen(Number(process.env.PORT||8080));
console.log('Self-hosted book service listening');
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>{void app.close().then(()=>process.exit());});
