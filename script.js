
(function(){
"use strict";
var $=function(s){return document.querySelector(s)},$$=function(s){return [].slice.call(document.querySelectorAll(s))};
var reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var touch=!(window.matchMedia&&window.matchMedia("(hover:hover)").matches);
$("#yr").textContent=new Date().getFullYear();

/* ---------- preloader ---------- */
var pc=$("#pcount"),n=0;
var pi=setInterval(function(){
  n+=Math.floor(Math.random()*9)+4; if(n>=100){n=100;clearInterval(pi);
    setTimeout(function(){ $("#pre").classList.add("gone"); startReel(); },260);}
  pc.textContent=n;
},70);

/* ---------- reel ---------- */
var reel=$("#reel"),rls=$$("#reel .rl"),rbar=$("#rbar"),rmark=$("#rmark"),wash=$("#wash"),ended=false,tm=[];
var HOLD=[1950,1100,1100,820,820,1020,1400,1750,1800,2300,2200];
function endReel(){
  if(ended)return; ended=true; tm.forEach(clearTimeout);
  reel.classList.add("done"); document.body.classList.remove("lock");
  setTimeout(function(){ if(reel.parentNode)reel.parentNode.removeChild(reel); fire(); },1200);
}
function startReel(){
  if(reduced){
    rls.forEach(function(e){e.classList.add("on");e.style.position="relative";e.style.fontSize="19px";e.style.margin="5px 0";});
    rmark.classList.add("on"); $("#skip").textContent="ENTER"; return;
  }
  document.body.classList.add("lock");
  var t=300,total=0; HOLD.forEach(function(h){total+=h;});
  rls.forEach(function(el,i){
    tm.push(setTimeout(function(){
      el.classList.add("on");
      var w=el.getAttribute("data-w")||"109,74,255";
      wash.style.background="radial-gradient(ellipse 74% 62% at "+(20+i*6)+"% "+(30+(i%3)*14)+"%,rgba("+w+",.34),transparent 62%)";
    },t));
    tm.push(setTimeout(function(){el.classList.remove("on");},t+HOLD[i]-230));
    t+=HOLD[i];
  });
  tm.push(setTimeout(function(){rmark.classList.add("on");},t));
  tm.push(setTimeout(endReel,t+1900));
  var st=Date.now(),dur=t+1900;
  var iv=setInterval(function(){var p=Math.min(1,(Date.now()-st)/dur);rbar.style.width=(p*100)+"%";if(p>=1||ended)clearInterval(iv);},60);
  setTimeout(endReel,dur+5000);
  reelParticles();
}
$("#skip").addEventListener("click",endReel);
$("#snd").addEventListener("click",function(){this.textContent=this.textContent.indexOf("OFF")>-1?"SOUND ON":"SOUND OFF";});
document.addEventListener("keydown",function(e){if(e.key==="Escape"){endReel();closeM();}});

/* ---------- reel particles ---------- */
function reelParticles(){
  var c=$("#rc"); if(!c||!c.getContext)return;
  var x=c.getContext("2d"),W,H,ps=[];
  function size(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;}
  size(); window.addEventListener("resize",size);
  for(var i=0;i<70;i++)ps.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.7+.4,s:Math.random()*.35+.08,o:Math.random()*.5+.2});
  (function loop(){
    if(ended)return;
    x.clearRect(0,0,W,H);
    for(var i=0;i<ps.length;i++){var p=ps[i];p.y-=p.s;if(p.y<-6){p.y=H+6;p.x=Math.random()*W;}
      x.beginPath();x.arc(p.x,p.y,p.r,0,6.283);x.fillStyle="rgba(255,255,255,"+p.o+")";x.fill();}
    requestAnimationFrame(loop);
  })();
}

/* ---------- background hex/dot field ---------- */
(function(){
  var c=$("#field"); if(!c||!c.getContext||reduced)return;
  var x=c.getContext("2d"),W,H,pts=[],mx=-999,my=-999;
  function size(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;build();}
  function build(){
    pts=[]; var gap=Math.max(64,Math.min(96,W/16));
    for(var i=0;i<W+gap;i+=gap)for(var j=0;j<H+gap;j+=gap)pts.push({x:i,y:j,bx:i,by:j});
  }
  size(); window.addEventListener("resize",size);
  window.addEventListener("mousemove",function(e){mx=e.clientX;my=e.clientY;},{passive:true});
  (function loop(){
    x.clearRect(0,0,W,H);
    for(var i=0;i<pts.length;i++){
      var p=pts[i],dx=p.bx-mx,dy=p.by-my,d=Math.sqrt(dx*dx+dy*dy),f=Math.max(0,1-d/230);
      p.x+=((p.bx+dx*f*.30)-p.x)*.09; p.y+=((p.by+dy*f*.30)-p.y)*.09;
      x.beginPath();x.arc(p.x,p.y,1.1+f*1.6,0,6.283);
      x.fillStyle="rgba(139,120,255,"+(0.07+f*0.42)+")";x.fill();
    }
    requestAnimationFrame(loop);
  })();
})();

/* ---------- cursor + magnetic ---------- */
// var cur=$("#cur");
// if(!touch){
//   window.addEventListener("mousemove",function(e){cur.style.transform="translate("+e.clientX+"px,"+e.clientY+"px) translate(-50%,-50%)";},{passive:true});
//   $$("a,button,.card,.act,.tri .c").forEach(function(el){
//     el.addEventListener("mouseenter",function(){cur.classList.add("big");});
//     el.addEventListener("mouseleave",function(){cur.classList.remove("big");});
//   });
//   $$(".mag").forEach(function(b){
//     b.addEventListener("mousemove",function(e){
//       var r=b.getBoundingClientRect();
//       b.style.transform="translate("+((e.clientX-r.left-r.width/2)*.22)+"px,"+((e.clientY-r.top-r.height/2)*.32)+"px)";
//     });
//     b.addEventListener("mouseleave",function(){b.style.transform="";});
//   });
// }

/* ---------- reveals ---------- */
var ups=$$(".up");
function fire(){ups.forEach(function(el){if(el.getBoundingClientRect().top<window.innerHeight*.94)el.classList.add("in");});}
if("IntersectionObserver" in window){
  var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},
    {threshold:.1,rootMargin:"0px 0px -5% 0px"});
  ups.forEach(function(el){io.observe(el);});
}else ups.forEach(function(el){el.classList.add("in");});
setTimeout(fire,1800);

/* ---------- scramble headlines ---------- */
var CH="ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*";
function scramble(el){
  var txt=el.textContent,i=0;
  var iv=setInterval(function(){
    el.textContent=txt.split("").map(function(c,k){
      if(k<i||c===" ")return c;
      return CH[Math.floor(Math.random()*CH.length)];
    }).join("");
    i+=1.6; if(i>=txt.length){clearInterval(iv);el.textContent=txt;}
  },28);
}
if("IntersectionObserver" in window && !reduced){
  var io3=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){scramble(e.target);io3.unobserve(e.target);}});},{threshold:.6});
  $$("[data-scramble]").forEach(function(el){io3.observe(el);});
}

/* ---------- creed ---------- */
var cl=$$("#creed p");
if("IntersectionObserver" in window){
  var io2=new IntersectionObserver(function(en){en.forEach(function(e){e.target.classList.toggle("hot",e.isIntersecting);});},{threshold:.9});
  cl.forEach(function(p){io2.observe(p);});
}else cl.forEach(function(p){p.classList.add("hot");});

/* ---------- scroll engine ---------- */
var nav=$("#nav"),chn=$("#chn"),segs=$$("#prog b"),marks=$$("[data-ch]"),acc=$$("[data-accent]"),
    hgal=$("#hgal"),track=$("#track"),galc=$("#galcount"),tick=false,curAcc="#6D4AFF";
function onScroll(){
  if(tick)return; tick=true;
  requestAnimationFrame(function(){
    var y=window.pageYOffset,vh=window.innerHeight;
    var h=document.documentElement.scrollHeight-vh,p=h>0?y/h:0;
    nav.classList.toggle("solid",y>90);
    var seg=p*7;
    for(var i=0;i<segs.length;i++)segs[i].style.transform="scaleX("+Math.max(0,Math.min(1,seg-i))+")";
    var cur2=1;
    marks.forEach(function(m){if(m.getBoundingClientRect().top<=vh*.45)cur2=parseInt(m.getAttribute("data-ch"),10);});
    chn.textContent="CH 0"+cur2+" / 07";
    var a=curAcc;
    acc.forEach(function(s){var r=s.getBoundingClientRect();if(r.top<=vh*.5&&r.bottom>vh*.2)a=s.getAttribute("data-accent");});
    if(a!==curAcc){curAcc=a;document.documentElement.style.setProperty("--accent",a);}
    /* pinned gallery */
    if(hgal&&track&&window.innerWidth>900){
      var r=hgal.getBoundingClientRect(),len=hgal.offsetHeight-vh;
      if(r.top<=0&&r.bottom>=vh){
        var pr=Math.max(0,Math.min(1,(-r.top)/len));
        var max=track.scrollWidth-window.innerWidth+window.innerWidth*.12;
        track.style.transform="translateX("+(-pr*max)+"px)";
        galc.textContent=("0"+Math.min(12,Math.floor(pr*12)+1)).slice(-2)+" / 12";
      }
    }
    tick=false;
  });
}
window.addEventListener("scroll",onScroll,{passive:true});
window.addEventListener("resize",onScroll);
onScroll();

/* ---------- counters ---------- */
var done=false;
function counters(){
  if(done)return; var f=document.querySelector("[data-count]"); if(!f)return;
  if(f.getBoundingClientRect().top>window.innerHeight)return; done=true;
  $$("[data-count]").forEach(function(b){
    var to=+b.getAttribute("data-count"),v=0;
    var iv=setInterval(function(){v++;b.textContent=("0"+v).slice(-2);
      if(v>=to){clearInterval(iv);b.textContent=(to>9?to+"+":("0"+to).slice(-2));}},Math.max(45,760/to));
  });
}
window.addEventListener("scroll",counters,{passive:true});

/* ---------- menu ---------- */
var dr=$("#drawer");
$("#mb").addEventListener("click",function(){dr.classList.add("open");});
$("#dx").addEventListener("click",function(){dr.classList.remove("open");});
$$("#drawer a").forEach(function(a){a.addEventListener("click",function(){dr.classList.remove("open");});});

/* ---------- cases ---------- */
var D={
sheri:["BRAND IDENTITY","Sheri Smart","linear-gradient(135deg,#FF4B12,#7E1005)","A tech-retail name that needed to look like a decision, not an option.","A category where every competitor used the same blue and the same promises.","Own the pin — the location marker became the mark, a promise of being found.","Identity, type system, signage, packaging and environmental application.","A mark that reads at 20 metres on a wall and at 20 pixels in a feed."],
anstal:["BRAND IDENTITY","Anstal — أنستال","linear-gradient(135deg,#A81D22,#37060A)","An Arabic wordmark built to be remembered before it's read.","A crowded shelf where every name used the same generic Arabic lettering.","Draw a custom Arabic letterform with a Latin twin so both scripts speak in one voice.","Bilingual wordmark, packaging, stickers, boxes and retail collateral.","Shelf recognition from colour and letterform alone."],
sahari:["BRAND IDENTITY","Sahari Resort — منتجع صحاري","linear-gradient(135deg,#6B1B2A,#C8A15A)","Heritage without the cliché.","AlUla hospitality branding leaning on the same desert photography as everyone else.","Take the pattern, not the picture — an ornament that works on cotton, stone and screen.","Identity, ornament system, uniforms, signage and interior application.","A brand that still holds up outside a photograph."],
suqia:["BRAND IDENTITY","Suqia Charity — سقيا الخيرية","linear-gradient(135deg,#1E6FB8,#05233F)","Trust, drawn as a single drop.","A charity in Madinah needing institutional credibility without coldness.","One symbol doing two jobs — a water drop holding calligraphy inside it.","Identity, uniforms, building signage and donor-facing collateral.","A mark that reads official and human at the same time."],
movenpick:["CAMPAIGN","Mövenpick — More Than Ice Cream","linear-gradient(135deg,#3A3A3A,#070707)","A line that turned a grid into a sentence.","The brand was read as ice cream only, while the menu had far more to sell.","Write the message across posts — the grid reads as one continuous phrase.","Campaign concept, illustrated series, offer creatives and rollout.","Menu awareness beyond the core product."],
aminah:["SOCIAL MEDIA","Aminah — أمينة","linear-gradient(135deg,#17A5B0,#F2637E)","A care platform that had to feel safe before it felt clever.","A sensitive category — childcare — where tone is fragile and trust is everything.","Lead with reassurance: soft shapes, real guidance, no hard selling.","Content system, educational carousels, key visual and launch assets.","Content mothers actually saved and shared."],
baher:["SOCIAL MEDIA","Baher Store — متجر بحر","linear-gradient(135deg,#1B7FCB,#03203C)","Tech retail with a signature you can spot mid-scroll.","Product posts identical to every other electronics store in the market.","A recurring wave-and-ring device so any post is recognisable without the logo.","Product content system, price treatments and an always-on calendar.","Feed recognition from a single frame."],
vitalis:["SOCIAL MEDIA","Vitalis Violet","linear-gradient(135deg,#7B2D8E,#E8A317)","Beauty content that sells the ritual, not the bottle.","Product-only posts with no reason to stop scrolling.","Own one colour so completely that competitors can't use it.","Always-on content, offer campaigns, delivery announcements and UGC direction.","A feed that's unmistakable at thumbnail size."],
coppa:["MEDIA PRODUCTION","Coppa","linear-gradient(135deg,#8E1F4B,#111116)","Product photography with a mood, not a lightbox.","Flat, over-lit shots that made a premium product look ordinary.","Shoot dark. Let a single highlight do the selling.","Full studio production — product, food and lifestyle stills.","A library the brand still runs on."],
wehnds:["UI / UX","We Hnds","linear-gradient(135deg,#16305C,#050B18)","An engineering community, designed in Arabic first.","Professionals coordinating real projects across scattered chats and files.","Design the profile as the product — the project record is the credential.","Arabic-first RTL app design: profiles, project pages, feeds, interactions.","A platform engineers can build a reputation on."],
easystar:["UI / UX","Easy Star","linear-gradient(135deg,#1F9E86,#06302A)","Booking made obvious.","A multi-category marketplace risking a confusing first screen.","Category-first home screen — decide before you search.","App UI system, category architecture, venue detail and booking flow.","Fewer steps between intent and booking."],
web:["UI / UX","Web platforms","linear-gradient(135deg,#6D4AFF,#170E42)","Commerce, travel and consulting sites built to convert.","Template sites that looked fine and sold nothing.","Design around the one action that matters on each page.","UI design and design systems across commerce, travel and consulting.","Interfaces that behave like the brand."]};
var modal=$("#modal");
function openM(k){
  var d=D[k]; if(!d)return;
  $("#mhd").style.background=d[2]; $("#mname").textContent=d[1];
  $("#mcat").textContent=d[0]; $("#mline").textContent=d[3];
  $("#mA").textContent=d[4]; $("#mB").textContent=d[5]; $("#mC").textContent=d[6]; $("#mD").textContent=d[7];
  modal.classList.add("open"); document.body.classList.add("lock");
}
function closeM(){modal.classList.remove("open");document.body.classList.remove("lock");}
$$(".card").forEach(function(c){c.addEventListener("click",function(){openM(c.getAttribute("data-p"));});});
$("#mx").addEventListener("click",closeM);
modal.addEventListener("click",function(e){if(e.target===modal)closeM();});

/* ---------- live personalisation ---------- */
var tok=$("#tok"),f2=$("#f2");
f2.addEventListener("input",function(){
  var v=f2.value.trim();
  tok.textContent=v?v:"yours";
});

/* ---------- form ---------- */
$("#send").addEventListener("click",function(){
  var a=$("#f1").value.trim(),b=f2.value.trim(),c=$("#f3").value.trim(),nt=$("#note");
  if(!a||!b||!c){nt.textContent="Fill in all three before sending.";nt.style.color="#E24B4A";return;}
  nt.style.color="#9B84FF"; nt.textContent="Thanks "+a+". Connect this form to your inbox to receive it for real.";
});
})();




(function(){
"use strict";
var $=function(s){return document.querySelector(s)},$$=function(s){return [].slice.call(document.querySelectorAll(s))};
var reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var fine=window.matchMedia&&window.matchMedia("(hover:hover)").matches;

/* ---------- 1. reel: split lines into words so they cascade ---------- */
$$("#reel .rl").forEach(function(el){
  if(el.children.length)return;                       // skip the gradient line
  var words=el.textContent.split(" ");
  el.innerHTML=words.map(function(w,i){
    return '<span class="w" style="transition-delay:'+(i*0.075)+'s">'+w+'</span>';
  }).join(" ");
});

/* ---------- 2. creed: word-by-word, driven by scroll position ---------- */
var creed=$("#creed"),cwords=[];
if(creed){
  $$("#creed p").forEach(function(p){
    var isSig=p.classList.contains("sig");
    p.innerHTML=p.textContent.split(" ").map(function(w){
      return '<span class="cw'+(isSig?" sig":"")+'">'+w+'</span>';
    }).join(" ");
  });
  cwords=$$("#creed .cw");
}
function creedScroll(){
  if(!creed||!cwords.length)return;
  var r=creed.getBoundingClientRect(),vh=window.innerHeight;
  var p=(vh*0.85-r.top)/(r.height*0.72);
  p=Math.max(0,Math.min(1,p));
  var upTo=Math.floor(p*cwords.length*1.08);
  for(var i=0;i<cwords.length;i++){
    var on=i<upTo;
    if(on!==cwords[i]._on){ cwords[i]._on=on; cwords[i].classList.toggle("lit",on); }
  }
}

/* ---------- 3. letter stagger on the closing headline ---------- */
(function(){
  var big=document.querySelector(".final .big");
  if(!big)return;
  var tok=$("#tok");
  var lead=big.childNodes;
  // wrap only the plain text nodes in letters, leave #tok alone
  for(var i=0;i<lead.length;i++){
    var nd=lead[i];
    if(nd.nodeType===3&&nd.textContent.trim()){
      var frag=document.createDocumentFragment();
      nd.textContent.split("").forEach(function(ch,k){
        var s=document.createElement("span");
        s.className="lt"; s.style.transitionDelay=(k*0.028)+"s";
        s.textContent=ch===" "?"\u00A0":ch;
        frag.appendChild(s);
      });
      big.replaceChild(frag,nd);
    }
  }
  big.classList.add("split");
  if("IntersectionObserver" in window){
    var o=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");o.unobserve(e.target);}});},{threshold:.35});
    o.observe(big);
  }else big.classList.add("in");
})();

/* ---------- 4. cursor trail ring ---------- */
// var ring=$("#ring"),rx=0,ry=0,tx=0,ty=0;
// if(fine&&ring){
//   window.addEventListener("mousemove",function(e){tx=e.clientX;ty=e.clientY;},{passive:true});
//   (function loop(){
//     rx+=(tx-rx)*0.14; ry+=(ty-ry)*0.14;
//     ring.style.transform="translate("+rx+"px,"+ry+"px) translate(-50%,-50%)";
//     requestAnimationFrame(loop);
//   })();
//   $$("a,button,.card,.act,.tri .c,input,textarea").forEach(function(el){
//     el.addEventListener("mouseenter",function(){ring.classList.add("big");});
//     el.addEventListener("mouseleave",function(){ring.classList.remove("big");});
//   });
// }

/* ---------- 5. 3D tilt on cards ---------- */
if(fine&&!reduced){
  $$(".card,.tri .c").forEach(function(el){
    var p=el.parentNode;
    el.classList.add("tilt");
    if(p&&!p.classList.contains("tiltwrap")){ el.style.perspective="1100px"; }
    el.addEventListener("mousemove",function(e){
      var r=el.getBoundingClientRect();
      var cx=(e.clientX-r.left)/r.width-0.5, cy=(e.clientY-r.top)/r.height-0.5;
      el.style.transform="perspective(1100px) rotateY("+(cx*8)+"deg) rotateX("+(-cy*8)+"deg) translateY(-6px)";
    });
    el.addEventListener("mouseleave",function(){ el.style.transform=""; });
  });
}

/* ---------- 6. floating preview that follows the cursor on service rows ---------- */
var fl=$("#follow"),fll=$("#followlbl"),acts=$$(".act");
var ART=[
  ["linear-gradient(135deg,#6D4AFF,#241663)","FIND"],
  ["linear-gradient(135deg,#E9A23B,#A63F22)","FACE"],
  ["linear-gradient(135deg,#C2417A,#4E0F2E)","TELL"],
  ["linear-gradient(135deg,#1E8FA8,#08303F)","TRAVEL"]
];
if(fine&&fl){
  acts.forEach(function(a,i){
    a.addEventListener("mouseenter",function(){
      fl.style.background=ART[i%4][0]; fll.textContent=ART[i%4][1]; fl.classList.add("on");
    });
    a.addEventListener("mouseleave",function(){ fl.classList.remove("on"); });
    a.addEventListener("mousemove",function(e){
      fl.style.left=e.clientX+"px"; fl.style.top=e.clientY+"px";
    });
  });
}

/* ---------- 7. scroll velocity: skew + marquee drag ---------- */
var last=window.pageYOffset,vel=0;
var skews=[],mqrows=$$(".mqr"),mqbg=$$(".mqbg div");
function collectSkews(){
  skews=$$(".creed p, .tri .c, .stats div, .cities div, .mq, .acts");
  skews.forEach(function(e){e.classList.add("sk");});
}
collectSkews();
mqrows.concat(mqbg).forEach(function(r){ r.style.willChange="transform"; });

/* ---------- 8. progress ring + stat pop + master scroll ---------- */
var pring=$("#pringfg"),statB=$$(".stats b"),popped=false,tick=false;
function master(){
  if(tick)return; tick=true;
  requestAnimationFrame(function(){
    var y=window.pageYOffset, vh=window.innerHeight;
    vel=y-last; last=y;
    var v=Math.max(-4,Math.min(4,vel*0.06));
    if(!reduced) skews.forEach(function(e){ e.style.transform="skewY("+v*0.5+"deg)"; });
    if(!reduced) mqrows.forEach(function(r,i){
      var base=r.classList.contains("rev")?1:-1;
      r.style.animationDuration=Math.max(14,(r.classList.contains("rev")?50:40)-Math.abs(vel)*0.55)+"s";
      void base;
    });
    var h=document.documentElement.scrollHeight-vh, p=h>0?y/h:0;
    if(pring) pring.style.strokeDashoffset=(69.1*(1-p)).toFixed(1);
    creedScroll();
    if(!popped&&statB.length){
      var r0=statB[0].getBoundingClientRect();
      if(r0.top<vh*0.85){
        popped=true;
        statB.forEach(function(b,i){
          setTimeout(function(){ b.classList.add("pop"); setTimeout(function(){b.classList.remove("pop");},420); },700+i*160);
        });
      }
    }
    tick=false;
  });
}
window.addEventListener("scroll",master,{passive:true});
window.addEventListener("resize",master);
master();
setTimeout(creedScroll,2200);

/* ---------- 9. draw-lines under section headings ---------- */
$$(".pad h2.lg, .galhead h2").forEach(function(h){ h.classList.add("draw"); });
if("IntersectionObserver" in window){
  var od=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");od.unobserve(e.target);}});},{threshold:.5});
  $$(".draw").forEach(function(e){od.observe(e);});
}else $$(".draw").forEach(function(e){e.classList.add("in");});

/* ---------- 10. parallax on marker numbers ---------- */
var nums=$$(".marker .num");
window.addEventListener("scroll",function(){
  if(reduced)return;
  var vh=window.innerHeight;
  nums.forEach(function(nm){
    var r=nm.getBoundingClientRect();
    if(r.top<vh&&r.bottom>0){
      var d=(r.top+r.height/2-vh/2)/vh;
      nm.style.letterSpacing=(-0.07+d*0.012)+"em";
    }
  });
},{passive:true});
})();
