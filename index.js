/* Folio 1.3.8 — dedicated SVG watermark layer */
(() => {
'use strict';
const KEY='folio_theme', TEMPLATE='third-party/Folio_by_GPT.Gemini';
const DEFAULTS={palette:'ink-night',backgroundUrl:'',backgroundOpacity:.22,fontScale:1.06,lineHeight:1.95,measure:40,paragraphGap:.75,charFont:'noto-serif',userFont:'noto-sans',pageNumbers:true,openingPage:true,rules:true,watermark:true,watermarkOpacity:.6};
const PALETTES={
'ink-night':{body:'#E0DCD4',em:'#9C978F',accent:'#E87046',quote:'#F6F3ED',panel:'rgba(27,26,24,.97)',chat:'rgba(20,19,18,.96)',shadow:'rgba(0,0,0,.45)',border:'rgba(224,220,212,.14)',tick:'#141312'},
'warm-paper':{body:'#231F20',em:'#57524B',accent:'#7A5C2C',quote:'#0E0C0D',panel:'#F3F0E9',chat:'#FAF8F3',shadow:'rgba(40,30,20,.16)',border:'rgba(35,31,32,.34)',tick:'#FAF8F3'},
'mist-water':{body:'#263C40',em:'#60777A',accent:'#5B9AA3',quote:'#17383E',panel:'rgba(225,243,241,.96)',chat:'rgba(242,251,249,.97)',shadow:'rgba(35,76,78,.14)',border:'rgba(65,125,130,.22)',tick:'#F2FBF9'},
'sakura':{body:'#49353D',em:'#896E78',accent:'#BD8297',quote:'#35242B',panel:'rgba(248,237,241,.97)',chat:'rgba(255,249,250,.98)',shadow:'rgba(91,55,69,.14)',border:'rgba(154,103,123,.22)',tick:'#FFF9FA'},
'violet-archive':{body:'#E7E0F2',em:'#B7A9CC',accent:'#A98BD4',quote:'#F5EFFC',panel:'rgba(35,27,49,.97)',chat:'rgba(27,21,39,.97)',shadow:'rgba(8,4,16,.5)',border:'rgba(190,164,222,.2)',tick:'#1B1527'}};
const FONTS={'noto-serif':'var(--mz-serif)','noto-sans':'var(--mz-sans)','kaiti':'var(--mz-kai)','system-serif':'serif','system-sans':'sans-serif'};
const ctx=window.SillyTavern?.getContext?.();if(!ctx){console.warn('[Folio] ST context unavailable');return;}
const all=ctx.extensionSettings??(ctx.extensionSettings={});all[KEY]??=structuredClone(DEFAULTS);const s=all[KEY];for(const[k,v]of Object.entries(DEFAULTS))if(s[k]===undefined)s[k]=v;if(s.watermarkOpacity===.08||s.watermarkOpacity===.16)s.watermarkOpacity=.6;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,Number(v)||a));
function setVar(root,key,value,important=false){root.style.setProperty(key,value,important?'important':'');}

const WATERMARK_ID='folio-watermark-layer';
function ensureWatermarkLayer(){
 let layer=document.getElementById(WATERMARK_ID);
 if(!layer){
  layer=document.createElement('div');layer.id=WATERMARK_ID;layer.setAttribute('aria-hidden','true');
  const ns='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 420 420');svg.setAttribute('preserveAspectRatio','xMidYMid meet');
  const add=(tag,attrs)=>{const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));svg.appendChild(el);};
  add('circle',{cx:286,cy:286,r:168,'stroke-dasharray':'180 34 62 24','stroke-width':2.2});
  add('circle',{cx:286,cy:286,r:124,'stroke-dasharray':'96 28 140 42','stroke-width':1.8});
  add('circle',{cx:286,cy:286,r:78,'stroke-dasharray':'48 18','stroke-width':1.6});
  add('path',{d:'M92 286 H408 M286 84 V408','stroke-width':1.35,'stroke-dasharray':'3 7'});
  add('path',{d:'M230 326 V248 L286 294 L342 248 V326','stroke-width':2.2});
  add('path',{d:'M286 210 L294 218 L286 226 L278 218 Z M138 352 L148 362 L138 372 L128 362 Z','stroke-width':1.8});
  add('circle',{cx:138,cy:362,r:22,'stroke-dasharray':'18 10','stroke-width':1.6});
  add('circle',{cx:230,cy:248,r:3,fill:'currentColor',stroke:'none'});
  add('circle',{cx:342,cy:248,r:3,fill:'currentColor',stroke:'none'});
  layer.appendChild(svg);
 }
 const host=document.getElementById('chat')||document.body;
 if(layer.parentElement!==host)host.prepend(layer);
 return layer;
}
function apply(){
 const root=document.documentElement,p=PALETTES[s.palette]||PALETTES['ink-night'];
 const vars={'--SmartThemeBodyColor':p.body,'--SmartThemeEmColor':p.em,'--SmartThemeUnderlineColor':p.accent,'--SmartThemeQuoteColor':p.quote,'--SmartThemeBlurTintColor':p.panel,'--SmartThemeChatTintColor':p.chat,'--SmartThemeShadowColor':p.shadow,'--SmartThemeBorderColor':p.border,'--SmartThemeCheckboxTickColor':p.tick};
 Object.entries(vars).forEach(([k,v])=>setVar(root,k,v,true));const isDark=s.palette==='ink-night'||s.palette==='violet-archive';document.body.classList.toggle('folio-light', !isDark);
  setVar(root,'--mz-plate-blend','normal',true);
  setVar(root,'--mz-plate-filter',isDark?'none':'var(--mz-day-plate-filter)',true);
 setVar(root,'--folio-role-ink',p.body);setVar(root,'--folio-aside-ink',p.em);setVar(root,'--folio-reading-surface',p.chat);setVar(root,'--folio-reading-line',p.border);setVar(root,'--folio-reading-ornament',p.accent);
 setVar(root,'--mz-read-size',`calc(var(--mainFontSize,16px) * ${clamp(s.fontScale,.8,1.4)})`);
 setVar(root,'--st-mes-line-height',clamp(s.lineHeight,1.4,2.4));
 setVar(root,'--st-mes-paragraph-gap',clamp(s.paragraphGap,0,1.6)+'em');
 setVar(root,'--mz-measure',clamp(s.measure,28,60));
 setVar(root,'--mz-char-font',FONTS[s.charFont]||FONTS['noto-serif']);
 setVar(root,'--mz-user-font',FONTS[s.userFont]||FONTS['noto-sans']);
 let image='';try{const u=new URL(String(s.backgroundUrl||'').trim());if(['http:','https:'].includes(u.protocol))image=u.href;}catch{}
 const tint=s.palette==='ink-night'?'12,11,10':s.palette==='warm-paper'?'250,248,243':s.palette==='mist-water'?'242,251,249':s.palette==='violet-archive'?'27,21,39':'255,249,250';
 const alpha=clamp(s.backgroundOpacity,0,.85);
 setVar(root,'--folio-wallpaper',image?`linear-gradient(rgba(${tint},${alpha}),rgba(${tint},${alpha})),url("${image.replace(/["\\\\]/g,'')}")`:'none');
 document.body.classList.toggle('no-mesIDDisplay',!s.pageNumbers);
 document.body.classList.toggle('folio-opening-page',!!s.openingPage);
 document.body.classList.toggle('folio-rules',!!s.rules);
 const watermark=ensureWatermarkLayer();watermark.hidden=!s.watermark;
 watermark.style.opacity=String(clamp(s.watermarkOpacity,0,1));
 watermark.dataset.enabled=String(!!s.watermark);
 setVar(root,'--folio-watermark-opacity',clamp(s.watermarkOpacity,0,1));
}
function save(){apply();ctx.saveSettingsDebounced?.();}
function syncPanel(panel){
 panel.find('[data-folio-setting]').each(function(){const k=this.dataset.folioSetting;if(!(k in s))return;if(this.type==='checkbox')this.checked=!!s[k];else this.value=s[k]??'';});
 panel.find('[data-folio-output]').each(function(){const k=this.dataset.folioOutput;this.textContent=k==='watermarkOpacity'?`${Math.round(Number(s[k])*100)}%`:s[k];});
}
async function render(){const $=window.jQuery,host=$?.('#extensions_settings2');if(!$||!host?.length||$('#folio-settings').length)return;try{host.append(await ctx.renderExtensionTemplateAsync(TEMPLATE,'settings'));syncPanel($('#folio-settings'));}catch(e){console.error('[Folio] settings render failed',e);}}
function bind(){const $=window.jQuery;if(!$)return;$(document).off('.folio');$(document).on('input.folio change.folio','#folio-settings [data-folio-setting]',function(){const k=this.dataset.folioSetting;if(!(k in DEFAULTS))return;let v=this.type==='checkbox'?this.checked:this.value;if(k==='fontScale')v=clamp(v,.8,1.4);if(k==='lineHeight')v=clamp(v,1.4,2.4);if(k==='measure')v=clamp(v,28,60);if(k==='paragraphGap')v=clamp(v,0,1.6);if(k==='backgroundOpacity')v=clamp(v,0,.85);if(k==='watermarkOpacity')v=clamp(v,0,1);s[k]=v;const o=$('#folio-settings').find('[data-folio-output="'+k+'"]');if(o.length)o.text(k==='watermarkOpacity'?`${Math.round(Number(v)*100)}%`:v);save();});$(document).on('click.folio','#folio-reset',function(){Object.assign(s,structuredClone(DEFAULTS));syncPanel($('#folio-settings'));save();});}
apply();bind();render();
const mo=new MutationObserver(()=>{
 if(!document.getElementById('folio-settings'))render();
 const layer=document.getElementById(WATERMARK_ID),chat=document.getElementById('chat');
 if(chat&&layer?.parentElement!==chat)ensureWatermarkLayer();
});
if(document.body)mo.observe(document.body,{childList:true,subtree:true});
window.FolioTheme={apply,getSettings:()=>({...s}),getWatermarkStatus:()=>{const el=document.getElementById(WATERMARK_ID);return {exists:!!el,visible:!!el&&!el.hidden,opacity:el?.style.opacity??null,svg:!!el?.querySelector('svg'),parent:el?.parentElement?.id??null,rect:el?(()=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height,top:r.top,left:r.left}})():null};},reset:()=>{Object.assign(s,structuredClone(DEFAULTS));save();}};
console.info('[Folio] 1.3.8 loaded');
})();
