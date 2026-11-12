// Usage: NODE_PATH=<sharp installation> FFMPEG_BIN=ffmpeg node scripts/build-hero.cjs <mitten.mp4>
// Reuses the user's supplied video; no generated replacement character.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const sharp = require('sharp');
const video = process.argv[2];
if (!video || !fs.existsSync(video)) throw new Error('Pass the original Mitten video path.');
const temp = fs.mkdtempSync(path.join(os.tmpdir(),'yuli-hero-'));
const out = path.resolve(__dirname,'../assets');
const fps = 20, count = 192;
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const capabilities = [
  '/product      产品定义 · 场景拆解',
  '/interaction  交互设计 · Agent 体验',
  '/prototype    AI coding · 原型开发',
  '/hardware     实体交互 · 硬件探索',
];
function svgAt(t) {
  const rows = [{start:0,text:'yuli@studio ~ % load capabilities',kind:'prompt'}];
  capabilities.forEach((s,i)=>rows.push({start:1+i*1.65,text:'[OK] '+s,kind:'result'}));
  rows.push({start:7.8,text:'yuli@studio ~ % explore projects',kind:'prompt'});
  const available=rows.filter(r=>r.start<=t);
  const active=available.length-1;
  const since=t-available[active].start;
  // Four-line viewport; new rows lift the older content, never move the title.
  const scroll=Math.max(0,active-3)*31;
  const ease=Math.min(1,since/.42);
  const eased=ease*ease*(3-2*ease);
  const offset=active>3 ? scroll-31+31*eased : 0;
  const lines=available.map((r,i)=>{
    const isActive=i===active;
    const fraction=Math.min(1,(t-r.start)/.72);
    const value=isActive?r.text.slice(0,Math.floor(r.text.length*fraction)):r.text;
    const y=246+i*31-offset;
    const opacity=y<243?.35:(r.kind==='prompt'?.55:1);
    const cursor=isActive&&Math.floor(t*2.5)%2===0?' ▍':'';
    return `<text x="54" y="${y}" opacity="${opacity}">${escape(value+cursor)}</text>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="426" viewBox="0 0 1200 426">
  <rect width="1200" height="426" fill="#f2f1ed"/>
  <text x="54" y="38" font-family="Arial,sans-serif" font-size="15" letter-spacing="2.1" fill="#333">YULi — PRODUCT × AI</text>
  <g font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="82" letter-spacing="-3.4" fill="#101010"><text x="50" y="121">Beyond the</text><text x="50" y="201">chatbox.</text></g>
  <defs><clipPath id="terminal"><rect x="52" y="223" width="730" height="123"/></clipPath></defs>
  <g clip-path="url(#terminal)" font-family="Menlo,monospace,PingFang SC" font-size="20" fill="#171717">${lines}</g>
  <text x="54" y="394" font-family="Menlo,monospace" font-size="12" fill="#7b7a75" letter-spacing="1.2">PRODUCT THINKING / HANDS-ON BUILDING</text>
  </svg>`;
}
(async()=>{
  fs.mkdirSync(out,{recursive:true});
  for(let i=0;i<count;i++) await sharp(Buffer.from(svgAt(i/fps))).png().toFile(path.join(temp,`${String(i).padStart(3,'0')}.png`));
  const cat="[1:v]crop=560:560:660:150,setsar=1,fps=20,scale=368:368:flags=lanczos,colorlevels=rimax=0.94:gimax=0.94:bimax=0.94,colorchannelmixer=rr=0.949:gg=0.945:bb=0.929[cat]";
  const merge="[0:v][cat]overlay=810:30:shortest=1,scale=1000:-1:flags=lanczos,format=rgb24";
  const ff=process.env.FFMPEG_BIN||'ffmpeg';
  const run=args=>{const r=spawnSync(ff,['-hide_banner','-loglevel','error',...args],{encoding:'utf8'});if(r.status!==0)throw new Error(r.stderr||String(r.error));};
  run(['-framerate',String(fps),'-i',path.join(temp,'%03d.png'),'-i',video,'-filter_complex',`${cat};${merge},split[a][b];[a]palettegen=max_colors=128:stats_mode=full[p];[b][p]paletteuse=dither=none:diff_mode=rectangle[out]`,'-map','[out]','-loop','0','-y',path.join(out,'hero-capabilities.gif')]);
  run(['-ss','7.4','-i',path.join(out,'hero-capabilities.gif'),'-frames:v','1','-update','1','-y',path.join(out,'hero-capabilities-poster.png')]);
  fs.writeFileSync(path.join(out,'hero-capabilities-layout.svg'),svgAt(5.7));
  fs.rmSync(temp,{recursive:true,force:true});
  console.log('Built 9.6-second looping hero and reduced-motion poster.');
})();
