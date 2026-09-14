const opening = document.getElementById("opening");
const enterBtn = document.getElementById("enterBtn");
const canvas = document.getElementById("petalCanvas");
const ctx = canvas.getContext("2d");
const paper = document.getElementById("poemPaper");
const poemText = document.getElementById("poemText");
const closePoem = document.getElementById("closePoem");
const mouseLight = document.getElementById("mouseLight");

const poems = [
  "云想衣裳花想容，春风拂槛露华浓。",
  "长安一片月，万户捣衣声。",
  "春风得意马蹄疾，一日看尽长安花。",
  "冲天香阵透长安，满城尽带黄金甲。",
  "长安大道连狭斜，青牛白马七香车。",
  "三月三日天气新，长安水边多丽人。"
];

let petals = [];
let W = innerWidth, H = innerHeight;

function resize(){
  W = canvas.width = innerWidth * devicePixelRatio;
  H = canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
addEventListener("resize", resize);
resize();

function makePetal(){
  return {
    x: Math.random()*innerWidth,
    y: Math.random()*innerHeight,
    r: 5 + Math.random()*7,
    rot: Math.random()*Math.PI*2,
    vx: -.25 + Math.random()*.5,
    vy: .25 + Math.random()*.9,
    vr: -.015 + Math.random()*.03,
    wobble: Math.random()*Math.PI*2,
    wobbleSpeed: .01 + Math.random()*.02,
    life: 0
  };
}
for(let i=0;i<38;i++) petals.push(makePetal());

function drawPetal(p){
  ctx.save();
  ctx.translate(p.x,p.y);
  ctx.rotate(p.rot);
  ctx.beginPath();
  ctx.moveTo(0,-p.r);
  ctx.bezierCurveTo(p.r*.9,-p.r*.7,p.r*.95,p.r*.8,0,p.r);
  ctx.bezierCurveTo(-p.r*.95,p.r*.8,-p.r*.9,-p.r*.7,0,-p.r);
  ctx.fillStyle = "rgba(207,126,128,.62)";
  ctx.fill();
  ctx.restore();
}
function animate(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  petals.forEach(p=>{
    p.life++;
    p.wobble += p.wobbleSpeed;
    p.x += p.vx + Math.sin(p.wobble)*.25;
    p.y += p.vy;
    p.rot += p.vr;
    if(p.y>innerHeight+20){Object.assign(p,makePetal(),{y:-20})}
    drawPetal(p);
  });
  requestAnimationFrame(animate);
}
animate();

function petalAt(x,y){
  let hit = -1, best = 40;
  petals.forEach((p,i)=>{
    const d = Math.hypot(x-p.x,y-p.y);
    if(d < best){best=d;hit=i}
  });
  return hit;
}
canvas.addEventListener("click", e=>{
  const i = petalAt(e.clientX,e.clientY);
  if(i>=0) showPoem(poems[Math.floor(Math.random()*poems.length)]);
});
canvas.addEventListener("touchstart", e=>{
  const t=e.touches[0]; const i=petalAt(t.clientX,t.clientY);
  if(i>=0) showPoem(poems[Math.floor(Math.random()*poems.length)]);
},{passive:true});

function showPoem(text){
  paper.classList.add("show");
  paper.setAttribute("aria-hidden","false");
  poemText.textContent="";
  let i=0;
  const timer=setInterval(()=>{
    poemText.textContent=text.slice(0,++i);
    if(i>=text.length) clearInterval(timer);
  },75);
}
function hidePoem(){paper.classList.remove("show");paper.setAttribute("aria-hidden","true")}
closePoem.addEventListener("click",hidePoem);
paper.addEventListener("click",e=>{if(e.target===paper)hidePoem()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")hidePoem()});

addEventListener("mousemove",e=>{
  mouseLight.style.left=e.clientX+"px";
  mouseLight.style.top=e.clientY+"px";
  if(Math.random()<.15){
    const ink=document.createElement("span");
    ink.className="ink";
    ink.style.left=e.clientX-15+"px";
    ink.style.top=e.clientY-15+"px";
    document.getElementById("inkLayer").appendChild(ink);
    setTimeout(()=>ink.remove(),900);
  }
});

enterBtn.addEventListener("click",()=>{
  opening.classList.add("hide");
  document.getElementById("home").scrollIntoView({behavior:"smooth"});
});

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.animate(
        [{opacity:0,transform:"translateY(28px)"},{opacity:1,transform:"translateY(0)"}],
        {duration:900,easing:"cubic-bezier(.2,.7,.2,1)",fill:"forwards"}
      );
      observer.unobserve(entry.target);
    }
  });
},{threshold:.15});
document.querySelectorAll(".content-section .section-inner,.poem-section .section-inner,.about-section .section-inner").forEach(el=>observer.observe(el));