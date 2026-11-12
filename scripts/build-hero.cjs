// Usage: NODE_PATH=<sharp installation> FFMPEG_BIN=ffmpeg node scripts/build-hero.cjs <mitten.mp4>
// The character is extracted from the supplied video, then choreographed locally.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const sharp = require('sharp');
const video = process.argv[2];
if (!video || !fs.existsSync(video)) throw new Error('Pass the original Mitten video path.');
const temp = fs.mkdtempSync(path.join(os.tmpdir(),'yuli-hero-'));
const out = path.resolve(__dirname,'../assets');
const fps = 25, duration = 14, count = fps * duration;
const ff = process.env.FFMPEG_BIN || 'ffmpeg';
const run = args => {
  const r = spawnSync(ff,['-hide_banner','-loglevel','error',...args],{encoding:'utf8'});
  if (r.status !== 0) throw new Error(r.stderr || String(r.error));
};
const clamp = x => Math.max(0,Math.min(1,x));
const mix = (a,b,p) => a+(b-a)*p;
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
// Motion token from animate: cubic-bezier(.77,0,.175,1).
function ease(p) {
  p=clamp(p);
  const curve=(t,a,b)=>3*(1-t)*(1-t)*t*a+3*(1-t)*t*t*b+t*t*t;
  let lo=0,hi=1;
  for(let n=0;n<18;n++) {const mid=(lo+hi)/2;if(curve(mid,.77,.175)<p)lo=mid;else hi=mid;}
  return curve((lo+hi)/2,0,1);
}
const progress = (t,a,b) => ease((t-a)/(b-a));
// Integrate the easing as velocity: a short acceleration, steady running,
// then a short deceleration. This avoids racing through source poses mid-run.
const travelTable=[0];
for(let i=1;i<=600;i++) {
  const p=(i-.5)/600,edge=.16;
  const velocity=p<edge?ease(p/edge):p>1-edge?1-ease((p-1+edge)/edge):1;
  travelTable.push(travelTable[i-1]+velocity/600);
}
const travelProgress=(t,a,b)=>{
  const k=clamp((t-a)/(b-a))*600,lo=Math.floor(k),hi=Math.min(600,lo+1);
  return mix(travelTable[lo],travelTable[hi],k-lo)/travelTable[600];
};
const textWidth = s => [...s].reduce((n,c)=>n+(/[\u3400-\u9fff]/.test(c)?18:10.8),0);
const rows = [
  {start:0,text:'yuli@studio ~ % load capabilities',prompt:true},
  {start:.6,text:'[OK] /product      产品定义 · 场景拆解'},
  {start:2.25,text:'[OK] /interaction  交互设计 · Agent 体验'},
  {start:5.05,text:'[OK] /prototype    AI coding · 原型开发'},
  {start:6.3,text:'[OK] /hardware     实体交互 · 硬件探索'},
  {start:10.7,text:'yuli@studio ~ % explore projects',prompt:true},
];
let sprites;
function terminalAt(t) {
  const reset=t>=13.1;
  const visible=reset?[rows[0]]:rows.filter(r=>r.start<=t);
  const active=visible.length-1;
  const first=Math.max(0,active-2);
  const since=t-visible[active].start;
  const offset=active>2?(first-1+progress(since,0,.32))*32:0;
  const opacity=t<12.7?1:t<13.1?1-progress(t,12.7,13.1):progress(t,13.1,13.5);
  let cursorX=54,cursorY=250;
  const lines=visible.slice(first).map((r,j)=>{
    const i=first+j;
    const full=r.start===0 || reset;
    const text=full?r.text:r.text.slice(0,Math.floor(r.text.length*clamp((t-r.start)/.65)));
    const y=250+i*32-offset;
    if(i===active){cursorX=54+textWidth(text)+8;cursorY=y-15;}
    return `<text x="54" y="${y}" opacity="${r.prompt?.55:1}">${escape(text)}</text>`;
  }).join('');
  // The cursor becomes a tiny toy: the cat catches it, then it returns and loads the next row.
  const chase=progress(t,3.75,4.35)*(1-progress(t,4.8,5.02));
  cursorX=mix(cursorX,535,chase);
  cursorY=mix(cursorY,306,chase);
  const pulse=1-Math.abs(2*clamp((t-4.57)/.38)-1);
  const blink=.55+.45*(.5+.5*Math.cos(t*Math.PI*2));
  const sparkle=t>=4.57&&t<=4.95?`<g stroke="#c66a43" stroke-width="1.5" opacity="${pulse}"><path d="M528 299l-5 -4 M548 300l5 -4 M548 321l5 4 M529 321l-5 4"/></g>`:'';
  return `<g opacity="${opacity}" clip-path="url(#terminal)"><g xml:space="preserve" font-family="Menlo,monospace,PingFang SC" font-size="18" fill="#171717">${lines}</g><rect x="${cursorX}" y="${cursorY}" width="8" height="18" rx="1" fill="${chase>.1?'#c66a43':'#171717'}" opacity="${blink}"/>${sparkle}</g>`;
}
function catAt(t) {
  const outbound=travelProgress(t,1.35,3.75);
  const inbound=travelProgress(t,7.35,9.75);
  const visit=outbound-inbound;
  const ground=mix(419,346,visit),scale=mix(.872,.45,visit);
  let pose='idle',poseBlend=0,angle=0;
  const going=t>=1.35&&t<3.75,returning=t>=7.35&&t<9.75;
  if(going||returning) {
    const p=going?outbound:inbound;
    // Advance actual source poses with distance, so the paws settle as the cat slows down.
    // Play consecutive hops forward/backward: the tail now retraces its arc
    // continuously instead of snapping between the original clip endpoints.
    const cycle=(p*5)%2;
    pose=Math.round((cycle<=1?cycle:2-cycle)*13);
    poseBlend=Math.min(progress(p,0,.06),1-progress(p,.94,1));
    angle=(going?-1:1)*4*Math.sin(Math.PI*p);
  }
  const tap=progress(t,4.15,4.6)*(1-progress(t,4.8,5.25));
  const turnOut=progress(t,6.85,7.3);
  const turnHome=progress(t,9.8,10.25);
  const facing=turnOut-turnHome;
  // Keep the mirrored ears inside the right edge, including while turning.
  const cx=mix(1015,620,visit)-70*facing*(1-visit);
  // One opaque silhouette turns through its narrow side; no doubled face.
  const squeeze=Math.max(.12,Math.abs(Math.cos(facing*Math.PI)));
  const breathe=1+.002*(1-Math.cos(t*Math.PI*2/duration));
  const wrap=(href,opacity,mirror)=>`<g opacity="${opacity}" transform="scale(${mirror?-1:1} 1)"><image x="-290" y="-590" width="580" height="610" href="${href}"/></g>`;
  const image=(href,opacity)=>wrap(href,opacity,facing>=.5);
  const base=sprites.tap||sprites.idle;
  const body=image(sprites.idle,(1-poseBlend)*(1-tap))+image(base,(1-poseBlend)*tap)+(typeof pose==='number'?image(sprites.run[pose],poseBlend):'');
  return `<ellipse cx="${cx-20*scale}" cy="${ground+1}" rx="${105*scale}" ry="${5*scale}" fill="#292825" opacity=".11"/><g transform="translate(${cx} ${ground}) rotate(${angle}) scale(${scale*squeeze} ${scale*breathe})">${body}</g>`;
}
function svgAt(time) {
  const t=time%duration;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="426" viewBox="0 0 1200 426">
  <rect width="1200" height="426" fill="#f2f1ed"/>
  <text x="54" y="38" font-family="Arial,sans-serif" font-size="15" letter-spacing="2.1" fill="#333">YULi — PRODUCT × AI</text>
  <g font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="82" letter-spacing="-3.4" fill="#101010"><text x="50" y="121">Beyond the</text><text x="50" y="201">chatbox.</text></g>
  <defs><clipPath id="terminal"><rect x="52" y="228" width="700" height="96"/></clipPath></defs>
  ${terminalAt(t)}${catAt(t)}
  <text x="54" y="394" font-family="Menlo,monospace" font-size="12" fill="#7b7a75" letter-spacing="1.2">PRODUCT THINKING / HANDS-ON BUILDING</text>
  </svg>`;
}
(async()=>{
  fs.mkdirSync(out,{recursive:true});
  const spriteDir=process.env.MITTEN_SPRITES||path.join(temp,'sprites');
  if(!process.env.MITTEN_SPRITES) {
    const extract=spawnSync(process.env.PYTHON_BIN||'python3',[path.join(__dirname,'extract-mitten.py'),video,spriteDir],{encoding:'utf8'});
    if(extract.status!==0)throw new Error(extract.stderr||String(extract.error));
  }
  const data=name=>'data:image/png;base64,'+fs.readFileSync(path.join(spriteDir,name)).toString('base64');
  sprites={idle:data('idle-1.500.png'),run:Array.from({length:14},(_,i)=>data(`run-${String(i).padStart(2,'0')}.png`))};
  if(fs.existsSync(path.join(spriteDir,'tap-6.000.png')))sprites.tap=data('tap-6.000.png');
  for(let i=0;i<count;i++) {
    await sharp(Buffer.from(svgAt(i/fps))).resize(1000,355).png().toFile(path.join(temp,`${String(i).padStart(3,'0')}.png`));
    if(i%50===0)console.log(`Rendered ${i}/${count}`);
  }
  run(['-framerate',String(fps),'-i',path.join(temp,'%03d.png'),'-filter_complex','split[a][b];[a]palettegen=max_colors=96:stats_mode=full[p];[b][p]paletteuse=dither=none:diff_mode=rectangle[out]','-map','[out]','-loop','0','-y',path.join(out,'hero-capabilities.gif')]);
  // Static fallback keeps the cat at home and three useful capability lines readable.
  const poster=svgAt(7.0).replace(catAt(7.0),catAt(0));
  await sharp(Buffer.from(poster)).resize(1000,355).png().toFile(path.join(out,'hero-capabilities-poster.png'));
  fs.writeFileSync(path.join(out,'hero-capabilities-layout.svg'),poster);
  if(process.env.KEEP_HERO_FRAMES) console.log(`Frames: ${temp}`);else fs.rmSync(temp,{recursive:true,force:true});
  console.log(`Built ${duration}s seamless hero (${fps} fps) and reduced-motion poster.`);
})().catch(err=>{console.error(err);process.exitCode=1;});
