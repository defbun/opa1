/* ===== Персонаж и диалог ===== */
const character = document.getElementById("character");
const charImg = document.getElementById("char-img");
const dialogueBox = document.getElementById("dialogue");
const skipBtn = document.getElementById("skip");
const CHARACTER_CLOSED = "images/character-closed.png";
const CHARACTER_OPEN = "images/character-open.png";

const dialogues = [
  "Привет! Я твой персонаж.",
  "Добро пожаловать на мой сайт!",
  "Давай познакомимся поближе..."
];

let currentDialogue = 0;
let isTyping = false;
let dialogueStarted = false;
let dialogueEnded = false;
let audio = new Audio("sounds/type-sound.mp3");
audio.volume = 0.2;

document.addEventListener("keydown", startDialogue);

function startDialogue() {
  if (dialogueStarted || dialogueEnded) return;
  dialogueStarted = true;

  character.style.opacity = "1";
  character.style.transform = "translateX(-50%)";
  setTimeout(() => {
    dialogueBox.style.display = "block";
    showDialogue(dialogues[currentDialogue]);
  }, 1200);
}

function showDialogue(text) {
  if (isTyping) return;
  isTyping = true;
  dialogueBox.innerHTML = "";
  let i = 0;
  function typing() {
    if (i < text.length) {
      dialogueBox.innerHTML += text[i];
      audio.currentTime = 0;
      audio.play().catch(()=>{});
      charImg.src = (charImg.src.includes("closed")) ? CHARACTER_OPEN : CHARACTER_CLOSED;
      i++;
      setTimeout(typing, 60);
    } else {
      charImg.src = CHARACTER_CLOSED;
      isTyping = false;
    }
  }
  typing();
}

document.addEventListener("keydown", (e)=>{
  if(!dialogueStarted || dialogueEnded) return;
  if((e.key === "Enter" || e.key===" ") && !isTyping && dialogueBox.style.display==="block"){
    currentDialogue++;
    if(currentDialogue<dialogues.length) showDialogue(dialogues[currentDialogue]);
    else endDialogue();
  }
});

skipBtn.addEventListener("click", ()=>{
  if(dialogueEnded) return;
  currentDialogue=dialogues.length;
  endDialogue();
});

function endDialogue(){
  if(dialogueEnded) return;
  dialogueEnded=true;
  dialogueBox.style.opacity="0";
  character.style.opacity="0";
  skipBtn.style.display="none";
  setTimeout(()=>{ dialogueBox.style.display="none"; startCMDSequence(); }, 800);
}

/* ===== CMD и загрузка ===== */
const cmd = document.getElementById("cmd");
const cmdText = document.getElementById("cmd-text");
const xpLogo = document.getElementById("xp-logo");
const xpBar = document.getElementById("xp-bar");
const xpProgress = document.getElementById("xp-progress");

function startCMDSequence(){
  const lines = [
    "Starting Windows XP...",
    "Loading drivers...",
    "Initializing hardware...",
    "Checking memory... OK",
    "Loading network services...",
    "System boot successful."
  ];

  cmd.style.display="block";
  cmdText.innerHTML="";
  let i=0;
  function typeLine(){
    if(i<lines.length){
      let line=lines[i]+"\n", j=0;
      function typeChar(){
        if(j<line.length){
          cmdText.innerHTML+=line[j]; j++;
          setTimeout(typeChar, 15);
        } else {
          i++;
          if(i===4) setTimeout(typeLine,600);
          else setTimeout(typeLine,50);
        }
      }
      typeChar();
    } else {
      cmd.style.display="none";
      xpLogo.style.display="block";
      xpBar.style.display="block";
      fillProgress();
    }
  }
  typeLine();
}

function fillProgress(progress=0){
  if(progress>100){
    xpLogo.style.display="none";
    xpBar.style.display="none";
    startWindowsSimulation();
    return;
  }
  xpProgress.style.width=progress+"%";
  let delay=20+Math.random()*80;
  setTimeout(()=>fillProgress(progress+2), delay);
}

/* ===== Рабочий стол ===== */
const desktop=document.getElementById("desktop");
const windowsContainer=document.getElementById("windows-container");

function startWindowsSimulation(){
  desktop.style.display="block";
  const icons=document.querySelectorAll(".icon");
  let zIndexCounter=100;
  const openedWindows={};

  icons.forEach(icon=>{
    icon.addEventListener("dblclick", ()=>{
      const id=icon.id;
      if(openedWindows[id]) return; // нельзя открыть дважды
      openWindow(icon.querySelector("span").innerText, id);
    });

    // drag & drop для сетки отключаем, т.к grid фиксирует позиции
  });

  function openWindow(title, id){
    const win=document.createElement("div");
    win.classList.add("window");
    win.style.top="50px";
    win.style.left="50px";
    win.style.zIndex=++zIndexCounter;

    win.innerHTML=`
      <div class="window-header">
        <span>${title}</span>
        <span class="window-close">X</span>
      </div>
      <div class="window-content">Содержимое ${title}</div>
    `;
    windowsContainer.appendChild(win);
    openedWindows[id]=win;

    const header=win.querySelector(".window-header");
    const closeBtn=header.querySelector(".window-close");
    closeBtn.addEventListener("click", ()=>{
      win.remove();
      delete openedWindows[id];
    });

    // Перетаскивание окна
    header.addEventListener("mousedown",(e)=>{
      if(e.target===closeBtn) return;
      let shiftX=e.clientX - win.getBoundingClientRect().left;
      let shiftY=e.clientY - win.getBoundingClientRect().top;
      function moveAt(pageX,pageY){ win.style.left=pageX-shiftX+"px"; win.style.top=pageY-shiftY+"px"; }
      function onMouseMove(event){ moveAt(event.pageX,event.pageY); }
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup",()=>{ document.removeEventListener("mousemove",onMouseMove); },{once:true});
      win.style.zIndex=++zIndexCounter;
    });
    header.ondragstart=()=>false;
  }
}

window.onload=()=>{ /* персонаж запускается только после нажатия */ };
