const $ = id => document.getElementById(id);

const feed = $("feed");
const categories = $("categories");
const ideaSheet = $("ideaSheet");
const creator = $("creator");
const camera = $("camera");

let ideas = window.REEL_IDEAS || [];
let activeIdea = null;
let selectedFilter = "none";

let cameraStream = null;
let facing = "user";

let mediaRecorder = null;
let chunks = [];
let recording = false;
let recordSeconds = 0;
let timerInterval = null;

let currentVideoURL = null;
let recordedBlob = null;

const FILTERS = [
  ["Original","none"],
  ["✨ Glow","brightness(1.12) saturate(1.15)"],
  ["🍬 Sweet","brightness(1.16) contrast(.94) saturate(1.06)"],
  ["🌸 Soft","brightness(1.10) contrast(.88) saturate(.96)"],
  ["☀️ Bright","brightness(1.20) contrast(.92)"],
  ["🔥 Warm","sepia(.22) saturate(1.25) contrast(1.05)"],
  ["❄️ Cool","hue-rotate(175deg) saturate(.85)"],
  ["⚫ B&W","grayscale(1) contrast(1.12)"],
  ["📼 Vintage","sepia(.5) contrast(1.08)"],
  ["🎬 Cinema","contrast(1.18) saturate(1.25)"],
  ["🌈 Vivid","saturate(1.45) contrast(1.08)"],
  ["🌙 Moody","brightness(.92) contrast(1.22) saturate(.85)"]
];

function toast(text){
  const el=$("toast");
  el.textContent=text;
  el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),1600);
}

function saved(){
  try{
    return JSON.parse(localStorage.getItem("rsSaved")) || [];
  }catch{
    return [];
  }
}

function saveList(list){
  localStorage.setItem("rsSaved",JSON.stringify(list));
}

const catList = ["For You",...new Set(ideas.map(x=>x.category))];

function renderCategories(){
  categories.innerHTML="";
  catList.forEach((name,i)=>{
    const b=document.createElement("button");
    b.className="category"+(i===0?" active":"");
    b.textContent=name;
    b.onclick=()=>{
      document.querySelectorAll(".category")
      .forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      renderIdeas(name==="For You"
        ? ideas
        : ideas.filter(x=>x.category===name));
    };
    categories.appendChild(b);
  });
}

function renderIdeas(list){
  feed.innerHTML="";
  const q=$("searchInput").value.trim().toLowerCase();

  list
  .filter(x=>{
    if(!q) return true;
    return (
      x.title+" "+x.hook+" "+x.category
    ).toLowerCase().includes(q);
  })
  .forEach(idea=>{
    const card=document.createElement("article");
    card.className="idea-card";

    const isSaved=saved().includes(idea.id);

    card.innerHTML=`
      <div class="idea-category">
        ${idea.emoji} ${idea.category}
      </div>

      <div class="idea-hook">
        “${idea.hook}”
      </div>

      <div class="idea-title">
        ${idea.title} • ⏱️ ${idea.duration}
      </div>

      <div class="idea-actions">
        <button class="primary use">
          ✨ Use This Idea
        </button>

        <button class="save heart">
          ${isSaved?"♥":"♡"}
        </button>
      </div>
    `;

    card.querySelector(".use").onclick=()=>openIdea(idea);

    card.querySelector(".heart").onclick=e=>{
      let s=saved();

      if(s.includes(idea.id)){
        s=s.filter(x=>x!==idea.id);
        e.currentTarget.textContent="♡";
        toast("Removed");
      }else{
        s.push(idea.id);
        e.currentTarget.textContent="♥";
        toast("Saved ❤️");
      }

      saveList(s);
    };

    feed.appendChild(card);
  });
}

function openIdea(idea){
  activeIdea=idea;

  $("detailCategory").textContent=
    idea.emoji+" "+idea.category;

  $("detailTitle").textContent=idea.title;
  $("detailHook").textContent=idea.hook;
  $("detailScript").textContent=idea.script;
  $("detailShots").textContent=idea.shots;
  $("detailCaption").textContent=idea.caption;
  $("detailTags").textContent=idea.hashtags;

  ideaSheet.classList.add("show");
}

$("closeIdea").onclick=()=>ideaSheet.classList.remove("show");

function ideaText(){
  if(!activeIdea) return "";

  return `${activeIdea.title}

HOOK:
${activeIdea.hook}

SCRIPT:
${activeIdea.script}

SHOT PLAN:
${activeIdea.shots}

CAPTION:
${activeIdea.caption}

HASHTAGS:
${activeIdea.hashtags}

Made with ReelSathi ✨`;
}

$("copyBtn").onclick=async()=>{
  try{
    await navigator.clipboard.writeText(ideaText());
    toast("Copied ✅");
  }catch{
    toast("Copy failed");
  }
};

$("shareBtn").onclick=async()=>{
  if(!activeIdea) return;

  if(navigator.share){
    try{
      await navigator.share({
        title:"ReelSathi",
        text:ideaText()
      });
    }catch{}
  }else{
    window.open(
      "https://wa.me/?text="+encodeURIComponent(ideaText()),
      "_blank"
    );
  }
};

$("createBtn").onclick=()=>{
  if(!activeIdea) return;

  ideaSheet.classList.remove("show");
  creator.classList.add("show");

  $("overlayText").textContent=activeIdea.hook;
  $("textInput").value=activeIdea.hook;
};

$("creatorBack").onclick=()=>{
  $("editorVideo").pause();
  creator.classList.remove("show");
};

function setEditorVideo(url){
  currentVideoURL=url;
  const v=$("editorVideo");
  v.src=url;
  v.load();
  $("stage").classList.add("show");
}

$("videoInput").onchange=function(){
  const file=this.files[0];
  if(!file) return;

  recordedBlob=null;

  if(currentVideoURL){
    URL.revokeObjectURL(currentVideoURL);
  }

  setEditorVideo(URL.createObjectURL(file));
};

$("textInput").oninput=function(){
  $("overlayText").textContent=
    this.value || (activeIdea ? activeIdea.hook : "Your Hook");
};

$("textSize").oninput=function(){
  $("overlayText").style.fontSize=this.value+"px";
};

$("textColor").oninput=function(){
  $("overlayText").style.color=this.value;
};

$("textPosition").onchange=function(){
  const el=$("overlayText");

  if(this.value==="top"){
    el.style.top="60px";
    el.style.bottom="auto";
    el.style.transform="none";
  }else if(this.value==="center"){
    el.style.top="50%";
    el.style.bottom="auto";
    el.style.transform="translateY(-50%)";
  }else{
    el.style.top="auto";
    el.style.bottom="70px";
    el.style.transform="none";
  }
};

function buildFilters(container,callback){
  container.innerHTML="";

  FILTERS.forEach(([name,value],index)=>{
    const b=document.createElement("button");
    b.className="filter-btn"+(index===0?" active":"");
    b.textContent=name;

    b.onclick=()=>{
      container.querySelectorAll(".filter-btn")
      .forEach(x=>x.classList.remove("active"));

      b.classList.add("active");
      callback(name,value);
    };

    container.appendChild(b);
  });
}

buildFilters($("editorFilters"),(name,value)=>{
  selectedFilter=value;
  $("editorVideo").style.filter=
    value==="none" ? "none" : value;
});

buildFilters($("cameraFilters"),(name,value)=>{
  selectedFilter=value;

  $("cameraPreview").style.filter=
    value==="none" ? "none" : value;

  $("filterName").textContent=name;
});

$("audioInput").onchange=function(){
  const file=this.files[0];
  if(!file) return;

  const audio=$("audioPlayer");
  audio.src=URL.createObjectURL(file);
  audio.style.display="block";
};

$("openCamera").onclick=startCamera;
$("cameraNav").onclick=startCamera;

async function startCamera(){
  try{
    stopStream();

    const constraints={
      audio:true,
      video:{
        facingMode:{ideal:facing},
        width:{ideal:1080},
        height:{ideal:1920}
      }
    };

    cameraStream=
      await navigator.mediaDevices.getUserMedia(constraints);

    $("cameraPreview").srcObject=cameraStream;

    /*
      Intentionally no scaleX(-1).
      Front preview is requested non-mirrored.
      Some browser/device camera implementations may still differ.
    */
    $("cameraPreview").style.transform="none";

    camera.classList.add("show");
  }
  catch(err){
    console.error(err);
    toast("Camera/Mic permission allow karein");
  }
}

function stopStream(){
  if(cameraStream){
    cameraStream.getTracks().forEach(t=>t.stop());
    cameraStream=null;
  }
}

$("cameraClose").onclick=()=>{
  if(recording) stopRecording();
  stopStream();
  camera.classList.remove("show");
};

$("cameraFlip").onclick=async()=>{
  facing=facing==="user" ? "environment" : "user";
  await startCamera();
};

function supportedMime(){
  const types=[
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4"
  ];

  for(const type of types){
    if(window.MediaRecorder &&
       MediaRecorder.isTypeSupported &&
       MediaRecorder.isTypeSupported(type)){
      return type;
    }
  }

  return "";
}

$("recordButton").onclick=()=>{
  if(recording) stopRecording();
  else startRecording();
};

function startRecording(){
  if(!cameraStream){
    toast("Camera open nahi hai");
    return;
  }

  chunks=[];
  recordSeconds=0;

  const mime=supportedMime();

  try{
    mediaRecorder=
      mime
      ? new MediaRecorder(cameraStream,{mimeType:mime})
      : new MediaRecorder(cameraStream);
  }catch(err){
    console.error(err);
    toast("Recording supported nahi");
    return;
  }

  mediaRecorder.ondataavailable=e=>{
    if(e.data && e.data.size) chunks.push(e.data);
  };

  mediaRecorder.onstop=()=>{
    recordedBlob=new Blob(
      chunks,
      {type:mediaRecorder.mimeType || "video/webm"}
    );

    if(currentVideoURL){
      URL.revokeObjectURL(currentVideoURL);
    }

    setEditorVideo(URL.createObjectURL(recordedBlob));

    stopStream();
    camera.classList.remove("show");
    creator.classList.add("show");

    $("timer").textContent="00:00";
    toast("Recorded ✅");
  };

  mediaRecorder.start(250);
  recording=true;

  $("recordButton").classList.add("recording");

  const max=Number($("recordLimit").value);

  timerInterval=setInterval(()=>{
    recordSeconds++;

    const m=String(Math.floor(recordSeconds/60))
      .padStart(2,"0");

    const s=String(recordSeconds%60)
      .padStart(2,"0");

    $("timer").textContent=`${m}:${s}`;

    if(recordSeconds>=max){
      stopRecording();
    }
  },1000);
}

function stopRecording(){
  if(!recording) return;

  recording=false;
  clearInterval(timerInterval);

  $("recordButton").classList.remove("recording");

  if(mediaRecorder &&
     mediaRecorder.state!=="inactive"){
    mediaRecorder.stop();
  }
}

/*
  Camera zoom:
  Browser/device must expose MediaStreamTrack zoom capability.
*/
let startY=null;
let zoomValue=1;

$("camera").addEventListener("pointerdown",e=>{
  if(e.target.closest(".filter-btn") ||
     e.target.closest(".camera-head") ||
     e.target.closest("select")){
    return;
  }

  startY=e.clientY;
});

$("camera").addEventListener("pointermove",async e=>{
  if(startY===null || !cameraStream) return;

  const track=cameraStream.getVideoTracks()[0];
  if(!track || !track.getCapabilities) return;

  const caps=track.getCapabilities();

  if(!caps.zoom) return;

  const delta=(startY-e.clientY)/180;

  zoomValue=Math.max(
    caps.zoom.min,
    Math.min(
      caps.zoom.max,
      zoomValue+delta*(caps.zoom.step || .1)
    )
  );

  try{
    await track.applyConstraints({
      advanced:[{zoom:zoomValue}]
    });
  }catch{}

  startY=e.clientY;
});

["pointerup","pointercancel"].forEach(type=>{
  $("camera").addEventListener(type,()=>{
    startY=null;
  });
});

/*
  Save raw recorded video.
  IMPORTANT:
  CSS preview filters/text are NOT baked into MediaRecorder output.
*/
$("downloadVideo").onclick=()=>{
  if(!recordedBlob){
    toast("Camera se video record karein");
    return;
  }

  const ext=
    recordedBlob.type.includes("mp4")
    ? "mp4"
    : "webm";

  const url=URL.createObjectURL(recordedBlob);
  const a=document.createElement("a");

  a.href=url;
  a.download=`reelsathi-${Date.now()}.${ext}`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(()=>URL.revokeObjectURL(url),5000);

  toast("Saving video ✅");
};

$("shareVideo").onclick=async()=>{
  if(!recordedBlob){
    toast("Camera se video record karein");
    return;
  }

  const ext=
    recordedBlob.type.includes("mp4")
    ? "mp4"
    : "webm";

  const file=new File(
    [recordedBlob],
    `reelsathi.${ext}`,
    {type:recordedBlob.type}
  );

  if(navigator.share &&
     navigator.canShare &&
     navigator.canShare({files:[file]})){
    try{
      await navigator.share({
        files:[file],
        title:"ReelSathi"
      });
    }catch{}
  }else{
    toast("Is browser mein file share supported nahi");
  }
};

$("surpriseBtn").onclick=()=>{
  const idea=ideas[Math.floor(Math.random()*ideas.length)];
  openIdea(idea);
};

$("savedNav").onclick=()=>{
  const s=saved();
  renderIdeas(ideas.filter(x=>s.includes(x.id)));

  window.scrollTo({top:0,behavior:"smooth"});
  toast(`${s.length} saved ideas`);
};

$("searchInput").oninput=()=>{
  renderIdeas(ideas);
};

renderCategories();
renderIdeas(ideas);
