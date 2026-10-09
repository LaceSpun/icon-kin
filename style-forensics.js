'use strict';
/* Icon Kin supplemental Style Forensics 0.2.2: measured SVG evidence, not designer intent. */
(function(){
const originalSVG=iconSVG, originalDNA=viewDNA, originalRefs=viewReferences, originalControl=ruleControl;
const color=function(v){
 v=String(v||'').trim().toLowerCase();
 if(/^#[0-9a-f]{3}$/i.test(v))return '#'+[...v.slice(1)].map(c=>c+c).join('');
 if(/^#[0-9a-f]{6}$/i.test(v))return v;
 const named={white:'#ffffff',black:'#000000',transparent:null};if(v in named)return named[v];
 const m=v.match(/^rgba?\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)/i);
 return m?'#'+m.slice(1,4).map(n=>Math.min(255,+n).toString(16).padStart(2,'0')).join(''):null;
};
const majority=function(a){
 const m=new Map();a.filter(v=>v!==null&&v!==undefined&&v!=='').forEach(v=>m.set(v,(m.get(v)||0)+1));
 return [...m].sort((a,b)=>b[1]-a[1])[0]?.[0]??null;
};
function prop(el,name){
 for(let n=el;n&&n.nodeType===1;n=n.parentElement){
  const style=n.getAttribute('style')||'';
  const value=style.match(new RegExp('(?:^|;)\\s*'+name+'\\s*:\\s*([^;]+)','i'));
  if(value)return value[1].trim();
  const attr=n.getAttribute(name);if(attr!==null)return attr;
 }
 return null;
}
function inspectSvg(raw){
 const doc=new DOMParser().parseFromString(raw,'image/svg+xml'), root=doc.documentElement;
 if(doc.querySelector('parsererror')||root.localName.toLowerCase()!=='svg')return {error:'Invalid SVG XML'};
 const vb=(root.getAttribute('viewBox')||'').trim(), parts=vb.split(/[\s,]+/).map(Number);
 const w=parts.length===4&&parts.every(Number.isFinite)?parts[2]:parseFloat(root.getAttribute('width'))||64;
 const h=parts.length===4&&parts.every(Number.isFinite)?parts[3]:parseFloat(root.getAttribute('height'))||64;
 const grad=[...root.querySelectorAll('linearGradient,radialGradient')].map(g=>({id:g.getAttribute('id'),colors:[...g.querySelectorAll('stop')].map(x=>color(prop(x,'stop-color')||'#000')).filter(Boolean)}));
 const drawables=[...root.querySelectorAll('path,rect,circle,ellipse,line,polygon,polyline')].filter(x=>!x.closest('defs,mask,clipPath,symbol'));
 const strokes=[],fills=[],widths=[],caps=[],joins=[];let tile=null;
 for(const el of drawables){
  const tag=el.localName.toLowerCase(),fill=prop(el,'fill'),stroke=prop(el,'stroke');
  if(tag==='rect'){
   const ww=parseFloat(el.getAttribute('width'))||w,hh=parseFloat(el.getAttribute('height'))||h;
   const x=parseFloat(el.getAttribute('x'))||0,y=parseFloat(el.getAttribute('y'))||0;
   if(ww*hh>=w*h*.65&&Math.abs(x)<=w*.15&&Math.abs(y)<=h*.15&&!tile){
     const id=/url\(\s*['"]?#([^)\s'"]+)/i.exec(fill||'')?.[1];
     const g=id?grad.find(q=>q.id===id):null;
     tile={type:g?'gradient':(color(fill)?'solid':'unknown'),gradient:g||null,solid:color(fill),radius:parseFloat(el.getAttribute('rx')||el.getAttribute('ry'))||0,sourceWidth:w};
     continue;
   }
  }
  const sc=color(stroke),fc=color(fill),sw=parseFloat(prop(el,'stroke-width'));
  if(sc)strokes.push(sc);if(fc)fills.push(fc);if(Number.isFinite(sw)&&sw>0)widths.push(sw);
  const cap=prop(el,'stroke-linecap'),join=prop(el,'stroke-linejoin');if(cap)caps.push(cap);if(join)joins.push(join);
 }
 const foregroundColor=majority(strokes)||majority(fills);
 const secondaryForeground=[...new Set([...fills,...strokes])].find(x=>x!==foregroundColor)||null;
 return {viewBox:vb||'unknown',shapeCount:drawables.length,dominantStroke:majority(strokes),dominantFill:majority(fills),
  foregroundColor,secondaryForeground,strokeWidth:majority(widths),linecap:majority(caps),linejoin:majority(joins),
  backgroundDetected:!!tile,backgroundType:tile?.type||'undetected',
  backgroundGradient:tile?.gradient||null,backgroundRadius:tile?tile.radius*64/Math.max(1,tile.sourceWidth):null,
  backgroundSolid:tile?.solid||null,gradientCount:grad.length,
  observation:'Evidence: measurable XML properties with inline/presentation inheritance. CSS classes, path-defined tiles, optical design and intent are not reliably inferred.'};
}
analyzeSvg=inspectSvg;
Object.assign(RULE_META,{
 tileMode:['Background tile','text','Measurable solid or gradient tile'],
 tileStart:['Gradient start','color','First measured color stop'],
 tileEnd:['Gradient end','color','Last measured color stop'],
 tileRadius:['Tile corner radius','number','Approximate corner radius normalized to a 64-unit frame'],
 tileSolid:['Tile solid color','color','Measured flat tile color']
});
Object.assign(DEFAULT_RULES,{tileMode:'none',tileStart:'#8239ec',tileEnd:'#d9459a',tileRadius:16,tileSolid:'#863ad0'});
iconSVG=function(concept,variant='balanced',style=activeStyle()){
 const base=originalSVG(concept,variant,style),mode=style.tileMode;
 if(!base||(mode!=='gradient'&&mode!=='solid'))return base;
 const radius=Math.max(0,Math.min(18,Number(style.tileRadius)||0));
 const fill=mode==='solid'?colorText(style.tileSolid||'#863ad0'):'url(#ik-tile)';
 const defs=mode==='gradient'?'<defs><linearGradient id="ik-tile" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="'+colorText(style.tileStart||'#8239ec')+'"/><stop offset="100%" stop-color="'+colorText(style.tileEnd||'#d9459a')+'"/></linearGradient></defs>':'';
 return base.replace(/(<svg\b[^>]*>)/,'$1'+defs+'<rect width="64" height="64" rx="'+radius+'" fill="'+fill+'"/>');
};
ruleControl=function(k,r){
 if(k!=='tileMode')return originalControl(k,r);
 const lock=r.status==='locked',opt=['none','gradient','solid'].map(v=>'<option '+(r.value===v?'selected':'')+'>'+v+'</option>').join('');
 return '<div class="rule"><div class="rule-heading"><strong>Background tile</strong><span class="chip '+ruleStatus(r.status)+'">'+esc(r.status)+'</span></div><p class="sub tiny">None, gradient, or solid</p><select data-rule="tileMode" '+(lock?'disabled':'')+'>'+opt+'</select><details class="rule-details"><summary>Evidence and confidence</summary><p>'+esc(r.source)+' · '+esc(r.confidence)+'</p><p>'+esc(r.evidence)+'</p></details><div class="row rule-actions"><button class="small" data-act="rulestatus" data-id="tileMode" data-value="approved" '+(lock?'disabled':'')+'>Approve</button><button class="small" data-act="rulestatus" data-id="tileMode" data-value="rejected" '+(lock?'disabled':'')+'>Reject</button><button class="small" data-act="rulestatus" data-id="tileMode" data-value="'+(lock?'approved':'locked')+'">'+(lock?'Unlock':'Lock')+'</button></div></div>';
};
extractDNA=function(){
 if(!p.references.length)return toast('Import references first.');
 const readings=p.references.filter(r=>r.type==='svg'&&r.source).map(r=>({ref:r,s:inspectSvg(r.source)})).filter(x=>!x.s.error);
 if(!readings.length)return toast('No parseable SVG sources; raster style extraction is manual.');
 snapshot('Before reference forensics');
 readings.forEach(x=>{x.ref.stats=x.s;});
 const evidence={};const pairs=key=>readings.map(x=>[x.s[key],x.ref.name]).filter(x=>x[0]!=null&&x[0]!=='');
 function set(key,pp,note,inferred){
  if(!pp.length)return; const val=majority(pp.map(x=>x[0]));
  if(val===null)return;
  const old=p.styleDNA.rules[key];
  if(old?.status==='locked'||(old?.source==='Manual refinement'&&old.status==='approved'))return;
  const support=pp.filter(x=>x[0]===val).map(x=>x[1]);
  p.styleDNA.rules[key]=newRule(key,val,inferred?'Inferred role from measured structure':'Observed SVG evidence',
   inferred?'interpretation':support.length===pp.length?'high':'mixed','provisional',
   support.length+'/'+pp.length+' applicable source(s) agree: '+support.join(', ')+'. '+note);
  evidence[key]=support;
 }
 set('strokeColor',pairs('foregroundColor'),'Primary paint of drawable foreground, not large tile rectangles.');
 set('accentColor',pairs('secondaryForeground'),'Secondary foreground paint; backgrounds excluded.');
 set('strokeWidth',pairs('strokeWidth'),'Measured inherited stroke width.');
 set('linecap',pairs('linecap'),'Measured inherited line ending.');
 set('linejoin',pairs('linejoin'),'Measured inherited line join.');
 const tiles=readings.filter(x=>x.s.backgroundDetected);
 if(tiles.length){
  set('tileMode',tiles.map(x=>[x.s.backgroundType,x.ref.name]).filter(x=>['solid','gradient'].includes(x[0])),'Large-rectangle classification is an inference; review before approval.',true);
  set('tileRadius',tiles.map(x=>[Math.min(18,Math.round(x.s.backgroundRadius*4)/4),x.ref.name]).filter(x=>Number.isFinite(x[0])),'Normalized rounded-rectangle radius; confirm optical equivalence.',true);
  set('tileStart',tiles.map(x=>[x.s.backgroundGradient?.colors[0],x.ref.name]).filter(x=>x[0]),'First gradient stop; complex gradients may not translate exactly.');
  set('tileEnd',tiles.map(x=>[x.s.backgroundGradient?.colors.at(-1),x.ref.name]).filter(x=>x[0]),'Last gradient stop; direction simplified to diagonal.');
  set('tileSolid',tiles.map(x=>[x.s.backgroundSolid,x.ref.name]).filter(x=>x[0]),'Solid tile color.');
 }
 p.styleDNA.forensics={date:now(),referenceCount:p.references.length,svgCount:readings.length,
  observed:readings.map(x=>({id:x.ref.id,name:x.ref.name,foreground:x.s.foregroundColor,stroke:x.s.strokeWidth,tile:x.s.backgroundType,gradient:x.s.backgroundGradient?.colors||[],radius:x.s.backgroundRadius})),
  proposed:Object.keys(evidence),limitations:['CSS class declarations are not fully resolved','Optical relationships and symbolic meaning remain human-reviewed','Path-defined backgrounds may be missed']};
 record('dna.forensics','Proposed '+Object.keys(evidence).length+' style rules from '+readings.length+' SVG sources with explicit evidence.',readings.map(x=>x.ref.id));
 render();toast('Proposed '+Object.keys(evidence).length+' provisional rules. Review Style DNA.');
};
const forensicsPanel=function(){
 const f=p.styleDNA.forensics;
 if(!f)return '<div class="pane"><h3>Measured design evidence</h3><p class="sub">To discover gradient tiles and foreground roles in these imported references, tap “Re-extract from references”. Existing default values are not proof of the original design rules.</p></div>';
 const rows=f.observed.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+esc(x.foreground||'unknown')+'</td><td>'+esc(x.stroke??'unknown')+'</td><td>'+esc(x.tile)+'</td><td>'+esc(x.gradient.join(' → ')||'none')+'</td></tr>').join('');
 return '<div class="pane"><h3>Measured design evidence</h3><p class="sub">'+f.svgCount+' SVGs reviewed · '+f.proposed.length+' provisional rules · missing values remain unknown.</p><details open><summary>Inspect each reference</summary><div style="overflow-x:auto"><table style="width:100%;text-align:left;border-spacing:10px"><thead><tr><th>Reference</th><th>Foreground</th><th>Stroke</th><th>Background</th><th>Gradient colors</th></tr></thead><tbody>'+rows+'</tbody></table></div></details><p class="sub tiny">This is measured SVG structure and cautious role inference, not confirmed designer intent or full semantic style extraction.</p></div>';
};
viewDNA=function(){return originalDNA().replace('<div class="design-layout">',forensicsPanel()+'<div class="design-layout">');};
viewReferences=function(){return originalRefs().replace('<div class="pane"><h3>Evidence boundary</h3>',forensicsPanel()+'<div class="pane"><h3>Evidence boundary</h3>');};
render();
})();