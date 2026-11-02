import puppeteer from 'puppeteer-core';

export async function createRenderer(origin) {
  const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-background-networking']});
  return {
    async render(index,hash) {
      const page=await browser.newPage();
      try {
        await page.setViewport({width:1920,height:1080,deviceScaleFactor:2});
        await page.setRequestInterception(true);
        page.on('request',r=>{if(r.url().startsWith(origin+'/')||/^(data|blob):/.test(r.url()))void r.continue();else void r.abort();});
        await page.goto(`${origin}/print/${index}?v=${hash}`,{waitUntil:'domcontentloaded',timeout:90000});
        await page.waitForSelector('body[data-ready="1"]',{timeout:90000});
        const broken=await page.evaluate(()=>Array.from(document.images).filter(i=>!i.complete||!i.naturalWidth).map(i=>i.alt));
        if(broken.length)throw new Error('Unloaded images: '+broken.join(', '));
        return await page.screenshot({type:'jpeg',quality:92,fullPage:false});
      }finally{await page.close();}
    },
    close:()=>browser.close(),
  };
}
