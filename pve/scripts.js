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
//controller
var atkbtn=document.getElementById("atkbtn");
var stkbtn=document.getElementById("stkbtn");
var defbtn=document.getElementById("defbtn");
var recbtn=document.getElementById("recbtn");
var bakbtn=document.getElementById("bakbtn");
var next=document.getElementById("next");
var back=document.getElementById("back");
atkbtn.onclick=function(){Decide(1);};
stkbtn.onclick=function(){Decide(4);};
defbtn.onclick=function(){Decide(2);};
recbtn.onclick=function(){Decide(3);};
bakbtn.onclick=function(){Back();};
next.onclick=function(){Reboot();};
back.onclick=function(){Back();};
function Back(){
    localStorage.setItem(`yesa-${charchoose[0]}`,charstatus);
    window.location.href='../index.html';
}
//random
function GetRan(...num){
    if(num.length==1)return Math.floor(Math.random()*(num[0]))+1;
    if(num.length==2)return Math.floor(Math.random()*(num[1]-num[0]+1))+num[0];
}
//game
var charchoose=LocalCheck();
var charstatus=localStorage.getItem(`yesa-${charchoose[0]}`).split(',');
var charitem=localStorage.getItem('yesa-item').split(',');

var win=document.getElementById("win");
var lose=document.getElementById("lose");
var text=document.getElementById("text");
var Hp=[parseInt(charstatus[1]),parseInt(charstatus[0])*10+50];
var PP=[18,15];
var aware=false;
const Choose=['','普通攻擊','防禦','回魔','法術攻擊'];
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
        if(parseInt(charstatus[5])-damage[3]>parseInt(charstatus[3])-damage[1])p2_choose=4;
        if(aware&&damage[3]<damage[1])p2_choose=4;
        aware=true;
    }
    text.innerHTML=`你選擇${Choose[p1_choose]}，對手選擇${Choose[p2_choose]}`;
    player1_choose.style.top=`${screen.clientHeight-150}px`;
    player1_choose.style.left=`${32}px`;
    player2_choose.style.top=`${screen.clientHeight-150}px`;
    player2_choose.style.left=`${screen.clientWidth-96}px`;
    if(p1_choose==1){
        player1_choose.style.backgroundImage="url('../img/others/atk.png')";
    }else if(p1_choose==2){
        player1_choose.style.backgroundImage="url('../img/others/def.png')";
    }else if(p1_choose==3){
        player1_choose.style.backgroundImage="url('../img/others/rec.png')";
    }else if(p1_choose==4){
        player1_choose.style.backgroundImage="url('../img/others/stk.png')";
    }
    if(p2_choose==1)player2_choose.style.backgroundImage="url('../img/others/atk.png')";
    if(p2_choose==2)player2_choose.style.backgroundImage="url('../img/others/def.png')";
    if(p2_choose==3)player2_choose.style.backgroundImage="url('../img/others/rec.png')";
    if(p2_choose==4)player2_choose.style.backgroundImage="url('../img/others/stk.png')";
    player1_choose.style.display="";
    player2_choose.style.display="";
    Animate(p1_choose,p2_choose);
}
function Animate(p1,p2){
    let p1x=parseInt(player1_choose.style.left.replace('px',''));
    let p2x=parseInt(player2_choose.style.left.replace('px',''));
    if(p2x-p1x<50)Animate2(p1,p2);
    else{
        player1_choose.style.left=`${p1x+1}px`;
        player2_choose.style.left=`${p2x-1}px`;
        setTimeout(function(){Animate(p1,p2)},1);
    }
}
function Animate2(p1,p2){
    let p1x=parseInt(player1_choose.style.left.replace('px',''));
    let p2x=parseInt(player2_choose.style.left.replace('px',''));
    if(p2x-p1x<200){
        player1_choose.style.left=`${p1x-5}px`;
        player2_choose.style.left=`${p2x+5}px`;
        setTimeout(function(){Animate2(p1,p2)},2);
    }else{
        dice.style.display="";
        setTimeout(function(){Battle(p1,p2);},2500);
    }
}
function GoE0(n){
    if(n>0)return n;
    else return 0;
}
function Battle(p1,p2){
    dice.style.display="none";
    player1_choose.style.display="none";
    player2_choose.style.display="none";
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
    Hp[0]-=result1; Hp[1]-=result2; PP[0]-=dice1; PP[1]-=dice2; charstatus[1]=Hp[0];
    if(Hp[0]>0&&Hp[1]>0&&PP[0]>=0&&PP[1]>=0){
        text.innerHTML+=`<br>你現在有${Hp[0]}點血量，${PP[0]}點能量<br>對手現在有${Hp[1]}點血量，${PP[1]}點能量`;
        DrawHpPP();
    }else{
        atkbtn.style.display="none";
        stkbtn.style.display="none";
        defbtn.style.display="none";
        recbtn.style.display="none";
        bakbtn.style.display="none";
        player1_choose.style.display="none";
        player2_choose.style.display="none";
        text.innerHTML+="<br>";
        if(Hp[0]<=0||PP[0]<0){
            if(Hp[0]<=0)text.innerHTML+="血量歸零,";
            if(PP[0]<0)text.innerHTML+="魔力枯竭,";
            text.innerHTML+="You Lose!";
            lose.style.display="";
            charstatus[1]='0';
            localStorage.setItem(`yesa-${charchoose[0]}`,charstatus);
            back.style.display="";
        }else {
            text.innerHTML+="對手";
            if(Hp[1]<=0)text.innerHTML+="血量歸零,";
            if(PP[1]<0)text.innerHTML+="魔力枯竭,";
            text.innerHTML+="You Win!";
            win.style.display="";
            if(parseInt(charstatus[0])<185){
                LvUp();
                next.style.display="";
                back.style.display="";
            }else back.style.display="";
        }
    }
}

var damage;
function Reboot(){
    player1.style.backgroundImage=`url('../img/character/${charchoose[0]}/${charchoose[1]}.png')`;
    player2.style.backgroundImage=`url('enemy/enemy\ \(${charstatus[0]}\).png')`;
    const lv=parseInt(charstatus[0]);
    damage=[parseInt(charstatus[2])-lv*GetRan(1,4),parseInt(charstatus[3])-lv*GetRan(1,4),parseInt(charstatus[4])-lv*GetRan(1,4),parseInt(charstatus[5])-lv*GetRan(1,4)];
    Hp[0]=parseInt(charstatus[1]);
    Hp[1]=parseInt(lv*10+50);
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
    player1_choose.style.display="none";
    player2_choose.style.display="none";
    DrawHpPP();
}
//start
var start=document.getElementById("start");
var dice=document.getElementById("dice");
var player1_choose=document.getElementById("player1-choose");
var player2_choose=document.getElementById("player2-choose");
//screen
var screen=document.getElementById("screen");
var board=document.getElementById("board");
var ctx=board.getContext('2d');
function DrawHpPP(){
    var swid=screen.clientWidth;
    var shei=screen.clientHeight;
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
    var swid=screen.clientWidth;
    var shei=screen.clientHeight;
    music.style.top=(shei/7)+'px';
    music.style.left=(swid/2-50)+'px';
    player1.style.top=(shei-150)+'px';
    player1.style.left=(swid/5-50)+'px';
    player2.style.top=(shei-150)+'px';
    player2.style.left=(swid-70-swid/5)+'px';
}
window.onresize=()=>{
    RePlace();
}
//load
player1.style.display="none";
player2.style.display="none";
player1_choose.style.display="none";
player2_choose.style.display="none";

function LocalCheck(){
    var localchoose=localStorage.getItem('yesa-choose');
    if(localchoose){
        return localchoose.split(',');
    }else{
        var tmp=['TokinoSora','1'];
        localStorage.setItem('yesa-choose',tmp);
        var localchar=localStorage.getItem('yesa-TokinoSora');
        if(!localchar)localStorage.setItem('yesa-TokinoSora',[1,100,GetRan(10,20),GetRan(5,10),GetRan(10,20),GetRan(5,10)]);
        var localitem=localStorage.getItem('yesa-item');
        if(!localitem)localStorage.setItem('yesa-item',[0,0,0,0,0,0,0,0,0,0]);
        return tmp;
    }
}

function Start(){
    const loading=document.getElementById("loading");
    loading.style.backgroundImage='none';
    loading.innerHTML='Click anywere to enter the game.';
    loading.onclick=function(){
        Reboot();
        RePlace();
        DrawHpPP();
        PlayAudio();
        loading.style.display='none';
        start.style.display="none";
        player1.style.display="";
        player2.style.display="";
    }
}
window.addEventListener("load",Start,false);

function LvUp(){
    charstatus[0]=parseInt(charstatus[0])+1;
    charstatus[1]=parseInt(charstatus[1])+10;
    for(var i=2;i<6;i++){
        charstatus[i]=parseInt(charstatus[i])+GetRan(3)+parseInt(charitem[i+1]);
    }
    localStorage.setItem(`yesa-${charchoose[0]}`,charstatus);
    charitem[0]=parseInt(charitem[0])+parseInt(charstatus[0])*100;
    localStorage.setItem('yesa-item',charitem);
}