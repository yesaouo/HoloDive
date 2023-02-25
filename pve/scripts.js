//musicplayer
var music=document.getElementById("music");
var prevbtn=document.getElementById("prevbtn");
var playbtn=document.getElementById("playbtn");
var nextbtn=document.getElementById("nextbtn");
const audio=document.createElement("audio");
var song=1,play=false;
audio.src="../music/"+song+".mp3";
audio.volume=0.3;
audio.loop=true;
function PlayAudio(){
    audio.play();
    playbtn.style.backgroundImage="url('../music/pause.png')";
}
function PauseAudio(){
    audio.pause();
    playbtn.style.backgroundImage="url('../music/play.png')";
}
function NextAudio(){
    if(song==14)song=0;
    song++;
    audio.src="../music/"+song+".mp3";
}
function PrevAudio(){
    if(song==1)song = 8;
    song--;
    audio.src="../music/"+song+".mp3";
}
prevbtn.onclick = function(event){
    PrevAudio();
    PlayAudio();
}
nextbtn.onclick = function(event){
    NextAudio();
    PlayAudio();
}
playbtn.onclick = function(event){
    if(play)PlayAudio();
    else PauseAudio();
    play=!play;
}

var player1=document.getElementById("player1");
var player2=document.getElementById("player2");
var p1Choose=document.getElementById("player1-choose");
var p2Choose=document.getElementById("player2-choose");
var atkbtn=document.getElementById("atkbtn");
var stkbtn=document.getElementById("stkbtn");
var defbtn=document.getElementById("defbtn");
var recbtn=document.getElementById("recbtn");
var bakbtn=document.getElementById("bakbtn");
var next=document.getElementById("next");
var back=document.getElementById("back");
var win=document.getElementById("win");
var lose=document.getElementById("lose");
var text=document.getElementById("text");
var start=document.getElementById("start");
var dice=document.getElementById("dice");
var gameScreen=document.getElementById("game-screen");
var board=document.getElementById("board");
var ctx=board.getContext('2d');
const Choose=['','普通攻擊','防禦','回魔','法術攻擊'];
let charChoose = localStorage.getItem('holodive-choose').split(',');
let charObj, itemList, walletList, charList;
let Hp = [], PP = [];
let damage = [];
let aware = false;
player1.style.display="none";
player2.style.display="none";
p1Choose.style.display="none";
p2Choose.style.display="none";
atkbtn.onclick=function(){Decide(1);};
stkbtn.onclick=function(){Decide(4);};
defbtn.onclick=function(){Decide(2);};
recbtn.onclick=function(){Decide(3);};
bakbtn.onclick=function(){Back();};
next.onclick=function(){Reboot();};
back.onclick=function(){Back();};
window.onresize=()=>{RePlace();}
window.addEventListener("load",Start,false);
const acc = localStorage.getItem('tgdy-account');
const pas = localStorage.getItem('tgdy-password');

function getError(){
    alert('connection error');
    window.location.href='../index.html';
}
function arrayToInt(strArray){
    for(let i=0; i<strArray.length; i++){
        strArray[i] = parseInt(strArray[i]);
    }
    return strArray;
}
async function getItemList(){
    try {
        const response = await fetch(`/getitem?acc=${acc}&pas=${pas}`);
        return arrayToInt(JSON.parse(await response.text()));
    } catch (error) { getError(); }
}
async function getCharObj(){
    try {
        const response = await fetch(`/getchar?acc=${acc}&pas=${pas}`);
        return JSON.parse(await response.text());
    } catch (error) { getError(); }
}
async function getWalletList(){
    try {
        const response = await fetch(`/getwallet?acc=${acc}&pas=${pas}`);
        let wallet = await response.text();
        if(wallet){
            wallet = JSON.parse(wallet);
            wallet[0] = parseInt(wallet[0]);
            wallet[1] = parseInt(wallet[1]);
            return wallet;
        }else getError();
    } catch (error) { getError(); }
}
async function updateChar(){
    try {
        charObj[charChoose[0]] = charList;
        const response = await fetch(`/updatechar?acc=${acc}&pas=${pas}&data=${JSON.stringify(charObj)}`);
    } catch (error) { getError(); }
}
async function updateWallet(){
    try {
        const response = await fetch(`/updatewallet?acc=${acc}&pas=${pas}&coin=${walletList[0]}&diamond=${walletList[1]}`);
    } catch (error) { getError(); }
}

function LvUp(){
    charList[0] += 1;
    charList[1] += 10;
    walletList[0] += charList[0] * 100;
    for(let i=2;i<6;i++) charList[i] += GetRan(3) + itemList[i - 2];
    updateChar();
    updateWallet();
}
function Back(){
    updateChar();
    window.location.href='../main/index.html';
}
function GetRan(...num){
    if(num.length==1)return Math.floor(Math.random()*(num[0]))+1;
    if(num.length==2)return Math.floor(Math.random()*(num[1]-num[0]+1))+num[0];
}
function GoE0(n){
    return (n>0)? n:0;
}

function Decide(p1_choose){
    let p2_choose=GetRan(3);
    if(PP[0]<6){
        switch(PP[0]){
            case 5:
                if(GetRan(2)>1)p2_choose=1;
                break;
            case 4:
                if(GetRan(3)>1)p2_choose=1;
                break;
            case 3:
                if(GetRan(4)>1)p2_choose=1;
                break;
            default:
                p2_choose=1;
                break;
        }
    }
    if(PP[1]<6){
        switch(PP[1]){
            case 5:
                if(GetRan(6)<3)p2_choose=3;
                break;
            case 4:
                if(GetRan(6)<4)p2_choose=3;
                break;
            case 3:
                if(GetRan(6)<5)p2_choose=3;
                break;
            default:
                p2_choose=3;
                break;
        }
    }
    if(p2_choose==1){
        if(charList[5]-damage[3]>charList[3]-damage[1])p2_choose=4;
        if(aware&&damage[3]<damage[1])p2_choose=4;
        aware=true;
    }
    text.innerHTML=`你選擇${Choose[p1_choose]}，對手選擇${Choose[p2_choose]}`;
    p1Choose.style.top=`${gameScreen.clientHeight-150}px`;
    p1Choose.style.left=`${32}px`;
    p2Choose.style.top=`${gameScreen.clientHeight-150}px`;
    p2Choose.style.left=`${gameScreen.clientWidth-96}px`;
    if(p1_choose==1){
        p1Choose.style.backgroundImage="url('../img/others/atk.png')";
    }else if(p1_choose==2){
        p1Choose.style.backgroundImage="url('../img/others/def.png')";
    }else if(p1_choose==3){
        p1Choose.style.backgroundImage="url('../img/others/rec.png')";
    }else if(p1_choose==4){
        p1Choose.style.backgroundImage="url('../img/others/stk.png')";
    }
    if(p2_choose==1)p2Choose.style.backgroundImage="url('../img/others/atk.png')";
    if(p2_choose==2)p2Choose.style.backgroundImage="url('../img/others/def.png')";
    if(p2_choose==3)p2Choose.style.backgroundImage="url('../img/others/rec.png')";
    if(p2_choose==4)p2Choose.style.backgroundImage="url('../img/others/stk.png')";
    p1Choose.style.display="";
    p2Choose.style.display="";
    Animate(p1_choose,p2_choose);
}
function Animate(p1,p2){
    let p1x=parseInt(p1Choose.style.left.replace('px',''));
    let p2x=parseInt(p2Choose.style.left.replace('px',''));
    if(p2x-p1x<50)Animate2(p1,p2);
    else{
        p1Choose.style.left=`${p1x+1}px`;
        p2Choose.style.left=`${p2x-1}px`;
        setTimeout(function(){Animate(p1,p2)},1);
    }
}
function Animate2(p1,p2){
    let p1x=parseInt(p1Choose.style.left.replace('px',''));
    let p2x=parseInt(p2Choose.style.left.replace('px',''));
    if(p2x-p1x<200){
        p1Choose.style.left=`${p1x-5}px`;
        p2Choose.style.left=`${p2x+5}px`;
        setTimeout(function(){Animate2(p1,p2)},2);
    }else{
        dice.style.display="";
        setTimeout(function(){Battle(p1,p2);},2500);
    }
}
function Battle(p1,p2){
    dice.style.display="none";
    p1Choose.style.display="none";
    p2Choose.style.display="none";
    let result1=0,result2=0;
    const dice1=GetRan(6),dice2=GetRan(6);
    text.innerHTML+=`<br>擲骰中. 擲骰中.. 擲骰中...<br>你的點數是${dice1}，對手的點數是${dice2}<br>`;
    if((p1==1||p1==4)&&(p2==1||p2==4)){
        if(dice1>dice2){
            result2=GoE0(p1==1?damage[0]:damage[2])+5*(dice1-dice2);
            text.innerHTML+=`對手無法攻擊到你，而你對他造成了${result2}點傷害`;
        }
        else if(dice1<dice2){
            result1=GoE0(p2==1?-damage[1]:-damage[3])+5*(dice2-dice1);
            text.innerHTML+=`你無法攻擊到對手，而他對你造成了${result1}點傷害`;
        }else text.innerHTML+="高手過招，無人受傷";
    }
    if(p1==2&&p2==2)text.innerHTML+="無人出手，防個寂寞";
    if((p1==1||p1==4)&&p2==2){
        if(dice1>dice2){ 
            result2=GoE0(p1==1?damage[0]:damage[2]+5*(dice1-dice2)); 
            text.innerHTML+=`你對對手造成了${result2}點傷害`;
        }
        if(dice1<dice2){
            result1=GoE0(p1==1?-damage[0]:-damage[2])+5*(dice2-dice1);
            text.innerHTML+=`對手對你造成了${result1}點傷害，並回復了${result1}點血量`;
            Hp[1]+=result1;
        }
        if(dice1==dice2)text.innerHTML+=`雙方皆損失了${dice1}點能量`;
    }
    if(p1==2&&(p2==1||p2==4)){
        if(dice1<dice2){ 
            result1=GoE0(p2==1?-damage[1]:-damage[3]+5*(dice2-dice1));
            text.innerHTML+=`對手對你造成了${result1}點傷害`; 
        }
        if(dice1>dice2){ 
            result2=GoE0(p2==1?damage[1]:damage[3])+5*(dice1-dice2);
            text.innerHTML+=`你對對手造成了${result2}點傷害，並回復了${result2}點血量`; 
            Hp[0]+=result2;
        }
        if(dice1==dice2)text.innerHTML+="高手過招，無人受傷";
    }
    if(p1==3&&p2==3){text.innerHTML+=`你回復了${dice1}點能量，對手回復了${dice2}點能量`; PP[0]+=dice1*2; PP[1]+=dice2*2;}
    if(p1==2&&p2==3){text.innerHTML+=`對手回復了${dice2}點能量，你白白損失了${dice1}點能量`; PP[1]+=dice2*2;}
    if(p1==3&&p2==2){text.innerHTML+=`你回復了${dice1}點能量，對手白白損失了${dice2}點能量`; PP[0]+=dice1*2;}
    if((p1==1||p1==4)&&p2==3){ 
        result2=GoE0(p1==1?damage[0]:damage[2])+5*dice1;
        text.innerHTML+=`對手回復了${dice2}點能量，你對他造成了${result2}點傷害`; 
        PP[1]+=dice2*2;
    }
    if(p1==3&&(p2==1||p2==4)){
        result1=GoE0(p2==1?-damage[1]:-damage[3])+5*dice2;
        text.innerHTML+=`對手對你造成了${result1}點傷害，你回復了${dice1}點能量`; 
        PP[0]+=dice1*2;
    }
    Hp[0]-=result1; Hp[1]-=result2; PP[0]-=dice1; PP[1]-=dice2; charList[1]=Hp[0];
    if(Hp[0]>0&&Hp[1]>0&&PP[0]>=0&&PP[1]>=0){
        text.innerHTML+=`<br>你現在有${Hp[0]}點血量，${PP[0]}點能量<br>對手現在有${Hp[1]}點血量，${PP[1]}點能量`;
        DrawHpPP();
    }else{
        atkbtn.style.display="none";
        stkbtn.style.display="none";
        defbtn.style.display="none";
        recbtn.style.display="none";
        bakbtn.style.display="none";
        p1Choose.style.display="none";
        p2Choose.style.display="none";
        text.innerHTML+="<br>";
        if(Hp[0]<=0||PP[0]<0){
            if(Hp[0]<=0)text.innerHTML+="血量歸零,";
            if(PP[0]<0)text.innerHTML+="魔力枯竭,";
            text.innerHTML+="You Lose!";
            lose.style.display="";
            charList[1]=0;
            updateChar();
            back.style.display="";
        }else {
            text.innerHTML+="對手";
            if(Hp[1]<=0)text.innerHTML+="血量歸零,";
            if(PP[1]<0)text.innerHTML+="魔力枯竭,";
            text.innerHTML+="You Win!";
            win.style.display="";
            if(charList[0]<185){
                LvUp();
                next.style.display="";
                back.style.display="";
            }else back.style.display="";
        }
    }
}

function Reboot(){
    player1.style.backgroundImage=`url('../img/character/${charChoose[0]}/${charChoose[1]}.png')`;
    player2.style.backgroundImage=`url('enemy/enemy\ \(${charList[0]}\).png')`;
    damage=[charList[2]-charList[0]*GetRan(1,4),charList[3]-charList[0]*GetRan(1,4),charList[4]-charList[0]*GetRan(1,4),charList[5]-charList[0]*GetRan(1,4)];
    Hp[0]=charList[1];
    Hp[1]=charList[0]*10+50;
    PP=[18,15];
    text.innerHTML="";
    atkbtn.style.display="";
    stkbtn.style.display="";
    defbtn.style.display="";
    recbtn.style.display="";
    bakbtn.style.display="";
    win.style.display="none";
    lose.style.display="none";
    dice.style.display="none";
    next.style.display="none";
    back.style.display="none";
    p1Choose.style.display="none";
    p2Choose.style.display="none";
    DrawHpPP();
}
function DrawHpPP(){
    let swid=gameScreen.clientWidth;
    let shei=gameScreen.clientHeight;
    board.setAttribute("height",`${shei}px`);
    board.setAttribute("width",`${swid}px`);
    ctx.clearRect(0, 0, swid, 40);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(swid/2.5,0);
    ctx.lineTo(swid/2.5,15);
    ctx.lineTo(0,15);
    ctx.stroke();
    ctx.moveTo(swid,0);
    ctx.lineTo(swid-swid/2.5,0);
    ctx.lineTo(swid-swid/2.5,15);
    ctx.lineTo(swid,15);
    ctx.stroke();
    ctx.moveTo(0,20);
    ctx.lineTo(swid/5,20);
    ctx.lineTo(swid/5,35);
    ctx.lineTo(0,35);
    ctx.stroke();
    ctx.moveTo(swid,20);
    ctx.lineTo(swid-swid/5,20);
    ctx.lineTo(swid-swid/5,35);
    ctx.lineTo(swid,35);
    ctx.stroke();
    ctx.closePath();

    const Hpwid=swid/2.5/300;
    ctx.beginPath();
    ctx.fillStyle="#FF0000";
    ctx.moveTo(0,0);
    ctx.lineTo((Hp[0]>300?300:Hp[0])*Hpwid,0);
    ctx.lineTo((Hp[0]>300?300:Hp[0])*Hpwid,15);
    ctx.lineTo(0,15);
    ctx.fill();
    ctx.moveTo(swid,0);
    ctx.lineTo(swid-(Hp[1]>300?300:Hp[1])*Hpwid,0);
    ctx.lineTo(swid-(Hp[1]>300?300:Hp[1])*Hpwid,15);
    ctx.lineTo(swid,15);
    ctx.fill();
    ctx.closePath();
    const PPwid=swid/5/30;
    ctx.beginPath();
    ctx.fillStyle="#00DDDD";
    ctx.moveTo(0,20);
    ctx.lineTo((PP[0]>30?30:PP[0])*PPwid,20);
    ctx.lineTo((PP[0]>30?30:PP[0])*PPwid,35);
    ctx.lineTo(0,35);
    ctx.fill();
    ctx.moveTo(swid,20);
    ctx.lineTo(swid-(PP[1]>30?30:PP[1])*PPwid,20);
    ctx.lineTo(swid-(PP[1]>30?30:PP[1])*PPwid,35);
    ctx.lineTo(swid,35);
    ctx.fill();
    ctx.closePath();

    ctx.font="15px sans-serif";
    ctx.fillStyle="#00DDDD";
    ctx.fillText("Hp:"+Hp[0],0,12);
    ctx.fillText("Hp:"+Hp[1],swid-50,12);
    ctx.font="15px sans-serif";
    ctx.fillStyle="#FF0000";
    ctx.fillText("PP:"+PP[0],0,33);
    ctx.fillText("PP:"+PP[1],swid-50,33);
}
function RePlace(){
    DrawHpPP();
    let swid=gameScreen.clientWidth;
    let shei=gameScreen.clientHeight;
    music.style.top=(shei/7)+'px';
    music.style.left=(swid/2-50)+'px';
    player1.style.top=(shei-150)+'px';
    player1.style.left=(swid/5-50)+'px';
    player2.style.top=(shei-150)+'px';
    player2.style.left=(swid-70-swid/5)+'px';
}

async function Start(){
    charObj = await getCharObj();
    charList = charObj[charChoose[0]];
    itemList = await getItemList();
    walletList = await getWalletList();
    const loading=document.getElementById("loading");
    loading.style.backgroundImage='none';
    loading.innerHTML='Click anywere to enter the game.';
    loading.onclick=function(){
        Reboot();
        RePlace();
        PlayAudio();
        loading.style.display='none';
        start.style.display="none";
        player1.style.display="";
        player2.style.display="";
    }
}
