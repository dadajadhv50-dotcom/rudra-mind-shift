(() => {
"use strict";
const $ = id => document.getElementById(id);
const KEY = "rudraMindShiftSaveV1";
const defaults = {level:1,best:0,streak:0,totalCorrect:0,totalWrong:0,history:[]};
let save = loadSave(), mode="memory", round=0, score=0, correct=0, wrong=0, selected=[], current=null, locked=false, started=0;
const names={memory:"MEMORY CAPTURE",shift:"MIND SHIFT",trap:"MEMORY TRAP"};
const symbols=["◆","●","▲","✦","⬟","✚","⬢","✧","◉","✿","☼","⬡"];
function loadSave(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return {...defaults}}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(save))}catch{}updateStats()}
function updateStats(){$("levelStat").textContent=save.level;$("bestStat").textContent=save.best;$("streakStat").textContent=save.streak}
function show(id){["homePanel","gamePanel","resultPanel"].forEach(x=>$(x).classList.toggle("hidden",x!==id))}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function size(){return Math.min(9,( $("difficulty").value==="easy"?3:$("difficulty").value==="hard"?5:4)+Math.floor((round-1)/3))}
function tile(label,fn,cls=""){const b=document.createElement("button");b.type="button";b.className="tile "+cls;b.textContent=label;b.addEventListener("click",fn);$("playArea").appendChild(b);return b}
document.querySelectorAll(".mode").forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.mode;document.querySelectorAll(".mode").forEach(x=>x.classList.toggle("active",x===b))}));
$("startBtn").addEventListener("click",startGame);$("againBtn").addEventListener("click",startGame);$("homeBtn").addEventListener("click",()=>show("homePanel"));
$("backBtn").addEventListener("click",()=>{if(confirm("सेशन छोड़कर मेन्यू पर जाएँ?"))show("homePanel")});
$("resetBtn").addEventListener("click",()=>{if(confirm("सेव की गई प्रोग्रेस मिटाएँ?")){try{localStorage.removeItem(KEY)}catch{}save={...defaults};updateStats();alert("प्रोग्रेस मिटा दी गई।")}});
$("nextBtn").addEventListener("click",submit);
function startGame(){round=0;score=0;correct=0;wrong=0;show("gamePanel");nextRound()}
function nextRound(){round++;selected=[];current=null;locked=false;$("nextBtn").disabled=true;$("nextBtn").innerHTML='जवाब लॉक करें <span>→</span>';$("roundLabel").textContent="ROUND "+round;$("timerLabel").textContent="● FOCUS";$("modeLabel").textContent=names[mode];$("progressBar").style.width=((round-1)*10)+"%";$("feedback").textContent="";$("playArea").innerHTML="";started=performance.now();
 if(mode==="memory")memoryRound();else if(mode==="shift")shiftRound();else trapRound()}
function memoryRound(){const n=size(),pool=shuffle(symbols).slice(0,n);current={kind:"memory",pool,shown:true};$("questionTitle").textContent="पैटर्न याद रखें";$("questionText").textContent="चिन्हों को याद करें। ये थोड़ी देर में छिप जाएँगे।";pool.forEach(s=>tile(s,()=>{}));const delay=$("difficulty").value==="easy"?1800:$("difficulty").value==="hard"?850:1300;
 setTimeout(()=>{if(!current||current.kind!=="memory"||!current.shown||$("gamePanel").classList.contains("hidden"))return;current.shown=false;$("playArea").innerHTML="";$("questionText").textContent="अब उन्हीं चिन्हों को उसी क्रम में चुनें।";const extras=shuffle(symbols.filter(s=>!pool.includes(s))).slice(0,Math.min(3,n));current.options=shuffle([...pool,...extras]);current.options.forEach(s=>tile(s,()=>{if(locked||selected.includes(s))return;selected.push(s);const btn=[...$("playArea").children].find(x=>x.textContent===s);if(btn)btn.classList.add("selected");if(selected.length===pool.length)$("nextBtn").disabled=false}))},delay)}
function shiftRound(){const rule=round%2===0?"even":"odd";current={kind:"shift",rule};$("questionTitle").textContent="बदलता नियम: "+(rule==="even"?"सम संख्या":"विषम संख्या");$("questionText").textContent="नीचे से कोई "+(rule==="even"?"सम (Even)":"विषम (Odd)")+" नंबर चुनें।";
 for(let i=1;i<=9;i++){const b=document.createElement("button");b.type="button";b.className="number-option";b.textContent=i;b.addEventListener("click",()=>{if(locked)return;selected=[i];document.querySelectorAll(".number-option").forEach(x=>x.classList.toggle("selected",x===b));$("nextBtn").disabled=false});$("playArea").appendChild(b)}}
function trapRound(){const target=symbols[Math.floor(Math.random()*symbols.length)],pool=shuffle(symbols).slice(0,size());if(!pool.includes(target))pool[0]=target;current={kind:"trap",target};$("questionTitle").textContent="Memory Trap";$("questionText").textContent="इस चिन्ह को चुनें: "+target;shuffle(pool).forEach(s=>tile(s,()=>{if(locked)return;selected=[s];document.querySelectorAll(".tile").forEach(x=>x.classList.toggle("selected",x===[...$("playArea").children].find(y=>y.textContent===s)));$("nextBtn").disabled=false}))}
function submit(){if(locked||!current)return;locked=true;const elapsed=performance.now()-started;let ok=false;
 if(current.kind==="memory")ok=selected.length===current.pool.length&&selected.every((s,i)=>s===current.pool[i]);
 if(current.kind==="shift"){const v=selected[0];ok=typeof v==="number"&&(current.rule==="even"?v%2===0:v%2===1)}
 if(current.kind==="trap")ok=selected[0]===current.target;
 if(ok){correct++;score+=Math.max(10,100-Math.floor(elapsed/1000)*3)+Math.min(30,save.streak*2);save.streak++;$("feedback").textContent="सही जवाब! स्कोर बढ़ा।"}else{wrong++;save.streak=0;$("feedback").textContent="इस बार गलत — अगली बार ध्यान से।"}
 save.totalCorrect+=ok?1:0;save.totalWrong+=ok?0:1;$("timerLabel").textContent=(elapsed/1000).toFixed(1)+"s";$("nextBtn").disabled=false;$("nextBtn").innerHTML=round>=10?'परिणाम देखें <span>✦</span>':'अगला राउंड <span>→</span>';
 if(current.kind==="memory"){[...$("playArea").children].forEach(b=>{if(current.pool.includes(b.textContent))b.classList.add("correct")})}
 $("nextBtn").onclick=()=>{if(round>=10)finish();else nextRound();$("nextBtn").onclick=null};
}
function finish(){save.best=Math.max(save.best,score);if(correct>=7)save.level=Math.min(99,save.level+1);save.history.push({date:new Date().toISOString(),score,correct,wrong,mode});save.history=save.history.slice(-20);persist();show("resultPanel");$("finalScore").textContent=score;$("resultTitle").textContent=correct>=8?"माइंड मास्टर!":correct>=5?"अच्छा खेल!":"फिर कोशिश करें";$("resultText").textContent=`10 राउंड में ${correct} सही और ${wrong} गलत जवाब।`;$("fingerprintBars").innerHTML=[correct,wrong,Math.min(10,Math.round(score/100)),save.streak,Math.max(1,10-wrong)].map(v=>`<i style="height:${Math.max(8,v*4)}px"></i>`).join("");$("fingerprintText").textContent=correct>=7?"आपकी सटीकता मजबूत रही। कठिनाई बढ़ाकर देखें।":wrong>correct?"धीरे खेलें और पैटर्न पर ध्यान दें।":"अभ्यास जारी रखें — रणनीति बनती जा रही है।"}
updateStats();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
})();