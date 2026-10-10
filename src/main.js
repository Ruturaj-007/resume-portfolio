(function(){
  var root=document.documentElement,bar=document.getElementById('progress'),btn=document.querySelector('.menu-btn'),nav=document.getElementById('nav');
  var clamp=function(v,a,b){return Math.min(b,Math.max(a,v))};
  var pb=document.querySelector('[data-print]');if(pb){pb.hidden=false;pb.addEventListener('click',function(){window.print()})}
  /* progress bar + menu */
  var story=document.getElementById('story'),pin=root.classList.contains('pin')&&story;
  var sc=null;
  function onScroll(){var h=root,m=h.scrollHeight-h.clientHeight;bar.style.width=(m>0?h.scrollTop/m*100:0)+'%';if(pin&&!sc)sc=requestAnimationFrame(function(){sc=null;frame()})}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);
  btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
  nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');btn.setAttribute('aria-expanded','false')}});
  addEventListener('keydown',function(e){if(e.key==='Escape'){nav.classList.remove('open');btn.setAttribute('aria-expanded','false')}});

  /* ---------- scroll-driven story ---------- */
  var chaps=[],stage,fill,dots,n=0;
  function hex(h){h=h.replace('#','');return[0,2,4].map(function(i){return parseInt(h.substr(i,2),16)})}
  function init(){
    stage=story.querySelector('.stage');fill=story.querySelector('.rail-fill');dots=[].slice.call(story.querySelectorAll('.dot'));
    chaps=[].slice.call(story.querySelectorAll('.chap')).map(function(el){
      var words=[];
      [].forEach.call(el.querySelectorAll('.split'),function(s){
        var txt=s.textContent.trim();s.setAttribute('aria-label',txt);s.textContent='';
        txt.split(/\s+/).forEach(function(w,i,a){var sp=document.createElement('span');sp.className='word';sp.setAttribute('aria-hidden','true');sp.textContent=w+(i<a.length-1?' ':'');s.appendChild(sp);words.push(sp)});
      });
      return{el:el,text:el.querySelector('.chap-text'),mock:el.querySelector('.mock'),words:words,bg:hex(el.getAttribute('data-bg')||'#F7F7F5')};
    });
    n=chaps.length;frame();
  }
  function frame(){
    var r=story.getBoundingClientRect(),dist=story.offsetHeight-innerHeight;
    var p=clamp(-r.top/dist,0,1),f=p*n;
    chaps.forEach(function(c,i){
      var t=f-i,vis=t>=0&&t<=1&&r.top<innerHeight&&r.bottom>0;
      if(!vis){c.el.style.opacity=0;c.el.style.pointerEvents='none';return}
      var inA=i===0?1:clamp(t/.12,0,1),outA=i===n-1?1:clamp((1-t)/.12,0,1),a=Math.min(inA,outA);
      c.el.style.opacity=a;c.el.style.pointerEvents='auto';
      var rev=clamp(t/(i===0?.35:.5),0,1),W=c.words.length;
      c.words.forEach(function(w,k){var s=k/W*.7,v=clamp((rev-s)/.3,0,1);w.style.opacity=v;w.style.transform='translateY('+((1-v)*16)+'px)'});
      var ex=i===n-1?0:clamp((t-.88)/.12,0,1);
      c.text.style.transform='translateY('+(-ex*18)+'px)';
      if(c.mock){var e1=1-Math.pow(1-clamp(t/.5,0,1),3),sc2=.9+.1*e1+ex*.04;
        c.mock.style.transform='translateY('+((.5-clamp(t,0,1))*36)+'px) scale('+sc2+')'}
    });
    var pos=clamp(f-.5,0,n-1),a0=Math.floor(pos),b0=Math.min(a0+1,n-1),m=pos-a0,A=chaps[a0].bg,B=chaps[b0].bg;
    stage.style.background='rgb('+[0,1,2].map(function(k){return Math.round(A[k]+(B[k]-A[k])*m)}).join(',')+')';
    fill.style.height=(p*100)+'%';
    var cur=Math.min(Math.floor(f),n-1);
    dots.forEach(function(d,i){d.classList.toggle('done',f>=i);d.classList.toggle('on',i===cur)});
  }
  if(pin)init();

  /* reveal + active nav */
  if(!('IntersectionObserver' in window)){document.querySelectorAll('.reveal').forEach(function(s){s.classList.add('in')});return}
  var r=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');r.unobserve(x.target)}})},{threshold:.08});
  document.querySelectorAll('.reveal').forEach(function(s){r.observe(s)});
  var links=[].slice.call(document.querySelectorAll('nav a'));
  var a=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){links.forEach(function(l){var on=l.getAttribute('href')==='#'+x.target.id;l.classList.toggle('active',on);on?l.setAttribute('aria-current','true'):l.removeAttribute('aria-current')})}})},{rootMargin:'-40% 0px -55% 0px'});
  document.querySelectorAll('main section[id]').forEach(function(s){a.observe(s)});
})();
