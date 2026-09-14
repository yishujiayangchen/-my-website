const canvas=document.getElementById("petalCanvas");
const ctx=canvas.getContext("2d");
const mouseLight=document.querySelector(".mouse-light");
const inkLayer=document.getElementById("inkLayer");
let width,height;

function resizeCanvas(){width=canvas.width=window.innerWidth;height=canvas.height=window.innerHeight}
resizeCanvas();
window.addEventListener("resize",resizeCanvas);

const guqin=document.getElementById("guqin");
const windbell=document.getElementById("windbell");
const musicBtn=document.getElementById("musicBtn");
const musicIcon=document.getElementById("musicIcon");
const musicText=document.getElementById("musicText");
let musicPlaying=false;
guqin.volume=.45; windbell.volume=.18;

async function playMusic(){
  try{
    await guqin.play();
    await windbell.play();
    musicPlaying=true;
    musicText.textContent="听琴中";
    musicIcon.textContent="♪";
    musicBtn.classList.add("music-playing");
  }catch(error){console.log("浏览器阻止了自动播放，请点击音乐按钮。")}
}
function pauseMusic(){
  guqin.pause(); windbell.pause();
  musicPlaying=false;
  musicText.textContent="听琴";
  musicIcon.textContent="♫";
  musicBtn.classList.remove("music-playing");
}
musicBtn.addEventListener("click",()=>musicPlaying?pauseMusic():playMusic());

document.getElementById("enterBtn").addEventListener("click",()=>{
  playMusic();
  document.getElementById("story").scrollIntoView({behavior:"smooth"});
});

document.addEventListener("mousemove",e=>{
  mouseLight.style.left=e.clientX+"px";
  mouseLight.style.top=e.clientY+"px";
});

let lastInkTime=0;
document.addEventListener("mousemove",e=>{
  const now=Date.now();
  if(now-lastInkTime<90)return;
  lastInkTime=now;
  createInk(e.clientX,e.clientY);
});

function createInk(x,y){
  const ink=document.createElement("div");
  ink.className="ink";
  ink.style.left=x+"px";
  ink.style.top=y+"px";
  const size=Math.random()*20;
  ink.style.width=20+size+"px";
  ink.style.height=20+size+"px";
  inkLayer.appendChild(ink);
  setTimeout(()=>ink.remove(),1500);
}

const poems=[
  {text:"春风得意马蹄疾",author:"孟郊《登科后》"},
  {text:"一日看尽长安花",author:"孟郊《登科后》"},
  {text:"长安一片月",author:"李白《子夜吴歌》"},
  {text:"花间一壶酒",author:"李白《月下独酌》"},
  {text:"云想衣裳花想容",author:"李白《清平调》"},
  {text:"人间四月芳菲尽",author:"白居易《大林寺桃花》"},
  {text:"花开堪折直须折",author:"《金缕衣》"},
  {text:"桃李春风一杯酒",author:"黄庭坚《寄黄几复》"},
  {text:"山寺桃花始盛开",author:"白居易《大林寺桃花》"},
  {text:"愿君多采撷",author:"王维《相思》"}
];

class Petal{
  constructor(){this.reset();this.y=Math.random()*height}
  reset(){
    this.x=Math.random()*width;this.y=-30;
    this.size=Math.random()*7+4;this.speed=Math.random()*1.2+.5;
    this.wind=Math.random()*.8-.4;this.rotation=Math.random()*Math.PI*2;
    this.rotationSpeed=Math.random()*.04-.02;this.opacity=Math.random()*.45+.3;
    this.sway=Math.random()*Math.PI*2;
  }
  update(){
    this.y+=this.speed;this.sway+=.02;
    this.x+=this.wind+Math.sin(this.sway)*.35;
    this.rotation+=this.rotationSpeed;
    if(this.y>height+30)this.reset();
  }
  draw(){
    ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.rotation);
    ctx.globalAlpha=this.opacity;ctx.fillStyle="#d69a91";
    ctx.beginPath();ctx.ellipse(0,0,this.size,this.size*.58,0,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  contains(mouseX,mouseY){
    const distance=Math.sqrt(Math.pow(mouseX-this.x,2)+Math.pow(mouseY-this.y,2));
    return distance<Math.max(this.size*3,20);
  }
}

const petals=[];
const PETAL_COUNT=window.innerWidth<700?32:60;
for(let i=0;i<PETAL_COUNT;i++)petals.push(new Petal());

function showPoemPaper(){
  const paper=document.getElementById("poemPaper");
  const poemElement=document.getElementById("paperPoem");
  const authorElement=document.getElementById("paperAuthor");
  const poem=poems[Math.floor(Math.random()*poems.length)];
  poemElement.textContent="";authorElement.textContent="";
  paper.classList.remove("show");void paper.offsetWidth;paper.classList.add("show");
  let index=0;
  function typeCharacter(){
    if(index<poem.text.length){
      poemElement.textContent+=poem.text[index++];
      setTimeout(typeCharacter,180);
    }else{
      setTimeout(()=>authorElement.textContent="—— "+poem.author,500);
    }
  }
  setTimeout(typeCharacter,400);
}

function clickPetal(x,y){
  for(let i=petals.length-1;i>=0;i--){
    const petal=petals[i];
    if(petal.contains(x,y)){
      createInk(x,y);showPoemPaper();petal.reset();return true;
    }
  }
  return false;
}

canvas.addEventListener("click",e=>clickPetal(e.clientX,e.clientY));
canvas.addEventListener("touchstart",e=>{
  const touch=e.touches[0];clickPetal(touch.clientX,touch.clientY);
},{passive:true});

function animate(){
  ctx.clearRect(0,0,width,height);
  petals.forEach(petal=>{petal.update();petal.draw()});
  requestAnimationFrame(animate);
}
animate();

const sections=document.querySelectorAll(".section");
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.style.opacity="1";
      entry.target.style.transform="translateY(0)";
    }
  });
},{threshold:.15});

sections.forEach(section=>{
  section.style.opacity="0";
  section.style.transform="translateY(40px)";
  section.style.transition="opacity 1s ease, transform 1s ease";
  observer.observe(section);
});