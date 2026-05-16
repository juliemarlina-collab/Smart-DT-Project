/* Smart DT shared navigation — source-matched mock-up style */
(function(){
  var PHASES=[
    {id:'empathy',num:'01',name:'Empathy',file:'phase01-empathy.html',ico:'🎧'},
    {id:'define',num:'02',name:'Define',file:'phase02-define.html',ico:'🎯'},
    {id:'ideation',num:'03',name:'Ideation',file:'phase03-ideation.html',ico:'💡'},
    {id:'prototype',num:'04',name:'Prototype',file:'phase04-prototype.html',ico:'🛠️'},
    {id:'test',num:'05',name:'Test',file:'phase05-test.html',ico:'🧪'}
  ];
  window.PHASES = window.PHASES || PHASES;
  function ls(k){return localStorage.getItem(k)||'';}
  function set(k,v){localStorage.setItem(k,v);}
  function path(){return (location.pathname.split('/').pop()||'index.html').toLowerCase();}
  function currentSection(){
    var p=path();
    if(p.includes('dashboard')) return 'home';
    if(p.includes('progress')) return 'progress';
    if(p.includes('profile')) return 'profile';
    if(p.includes('phase')) return 'learn';
    return '';
  }
  function currentPhaseIndex(){
    var p=path();
    for(var i=0;i<PHASES.length;i++){ if(p===PHASES[i].file.toLowerCase()) return i; }
    var saved=parseInt(ls('df_current_phase')||'1',10); return Math.max(0,Math.min(4,saved-1));
  }
  function injectStyle(){
    if(document.getElementById('smartdt-nav-style')) return;
    var css=`
      :root{--navy:#081B44;--teal:#14B8A6;--tealDk:#0F766E;--tealLt:#E6FFFB;--orange:#FF6A3D;--bg:#EEF2F7;--white:#fff;--sub:#475569;--border:#E8EDF5;}
      body{padding-bottom:74px;}
      .sdt-bottom-nav{position:fixed;left:50%;bottom:0;transform:translateX(-50%);width:100%;max-width:560px;background:#fff;border-top:1px solid var(--border);display:grid;grid-template-columns:repeat(4,1fr);padding:8px 7px 10px;z-index:210;box-shadow:0 -8px 24px rgba(8,27,68,.08);}
      .sdt-nav-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;text-decoration:none;color:#94A3B8;font-size:10px;font-weight:800;border-radius:14px;padding:6px 4px;min-height:48px;-webkit-tap-highlight-color:transparent;}
      .sdt-nav-item.active{background:var(--tealLt);color:var(--tealDk);} .sdt-nav-ico{font-size:18px;line-height:1;}
      .sdt-sidebar{display:none}.sdt-phase-mini{display:flex;gap:6px;overflow-x:auto;padding:8px 16px;background:#fff;border-bottom:1px solid var(--border);scrollbar-width:none}.sdt-phase-mini::-webkit-scrollbar{display:none}
      .sdt-phase-chip{display:flex;align-items:center;gap:6px;border:1.5px solid var(--border);border-radius:99px;background:var(--bg);padding:6px 11px;text-decoration:none;color:var(--sub);font-size:10px;font-weight:800;white-space:nowrap}.sdt-phase-chip.active{background:var(--tealLt);border-color:rgba(20,184,166,.35);color:var(--tealDk)}
      @media(min-width:900px){body{padding-bottom:0}.sdt-bottom-nav{display:none}.sdt-sidebar{display:flex;position:fixed;top:0;bottom:0;left:0;width:86px;background:#fff;border-right:1px solid var(--border);z-index:220;flex-direction:column;align-items:center;padding:18px 10px;gap:12px;box-shadow:6px 0 24px rgba(8,27,68,.06)}.sdt-side-logo{width:46px;height:46px;border-radius:14px;background:var(--teal);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900}.sdt-side-link{width:58px;border-radius:16px;display:flex;flex-direction:column;align-items:center;gap:4px;text-decoration:none;color:#94A3B8;font-size:9px;font-weight:800;padding:9px 3px}.sdt-side-link.active{background:var(--tealLt);color:var(--tealDk)}.content{margin-left:auto;margin-right:auto}.fab,.fab-menu{right:calc((100vw - 560px)/2 + 20px)!important}}
      @media print{.sdt-bottom-nav,.sdt-sidebar,.sdt-phase-mini{display:none!important}body{padding-bottom:0}}
    `;
    var st=document.createElement('style'); st.id='smartdt-nav-style'; st.textContent=css; document.head.appendChild(st);
  }
  function injectBottom(){
    if(document.querySelector('.sdt-bottom-nav')) return;
    var sec=currentSection();
    var items=[['home','🏠','Home','progress.html'],['learn','📚','Learn',PHASES[currentPhaseIndex()].file],['progress','📊','Progress','progress.html'],['profile','👤','Profile','profile.html']];
    var nav=document.createElement('nav'); nav.className='sdt-bottom-nav';
    nav.innerHTML=items.map(function(it){return '<a class="sdt-nav-item '+(sec===it[0]?'active':'')+'" href="'+it[3]+'"><span class="sdt-nav-ico">'+it[1]+'</span><span>'+it[2]+'</span></a>';}).join('');
    document.body.appendChild(nav);
  }
  function injectSidebar(){
    if(document.querySelector('.sdt-sidebar')) return;
    var sec=currentSection();
    var items=[['home','🏠','Home','progress.html'],['learn','📚','Learn',PHASES[currentPhaseIndex()].file],['progress','📊','Progress','progress.html'],['profile','👤','Profile','profile.html']];
    var side=document.createElement('aside'); side.className='sdt-sidebar';
    side.innerHTML='<div class="sdt-side-logo">DT</div>'+items.map(function(it){return '<a class="sdt-side-link '+(sec===it[0]?'active':'')+'" href="'+it[3]+'"><span class="sdt-nav-ico">'+it[1]+'</span><span>'+it[2]+'</span></a>';}).join('');
    document.body.appendChild(side);
  }
  function injectPhaseMini(){
    if(!path().includes('phase') || document.querySelector('.sdt-phase-mini')) return;
    var idx=currentPhaseIndex(); set('df_current_phase', String(idx+1)); set('df_visited_'+PHASES[idx].id,'1');
    var bar=document.createElement('div'); bar.className='sdt-phase-mini';
    bar.innerHTML=PHASES.map(function(p,i){return '<a class="sdt-phase-chip '+(i===idx?'active':'')+'" href="'+p.file+'"><span>'+p.ico+'</span><span>'+p.num+' '+p.name+'</span></a>';}).join('');
    var tabs=document.querySelector('.tabs'); if(tabs && tabs.parentNode) tabs.parentNode.insertBefore(bar,tabs.nextSibling);
  }
  function fillIdentity(){
    var map={'si-name':'df_student_name','si-reg':'df_reg_no','si-class':'df_class'};
    Object.keys(map).forEach(function(id){var el=document.getElementById(id); if(el){if(!el.value && ls(map[id])) el.value=ls(map[id]); el.addEventListener('input',function(){set(map[id],el.value||'');});}});
  }
  document.addEventListener('DOMContentLoaded',function(){injectStyle();injectBottom();injectSidebar();injectPhaseMini();fillIdentity();});
})();
