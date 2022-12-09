//musicplayer
var music=document.getElementById("music");
var prevbtn=document.getElementById("prevbtn");
var playbtn=document.getElementById("playbtn");
var nextbtn=document.getElementById("nextbtn");
const audio=document.createElement("audio");
var song=1,play=true;
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

var loading=document.getElementById("loading");
var start=document.getElementById("start");
var dice=document.getElementById("dice");
var player1=document.getElementById("player1");
var player2=document.getElementById("player2");
var player1_choose=document.getElementById("player1-choose");
var player2_choose=document.getElementById("player2-choose");
var atkbtn=document.getElementById("atkbtn");
var stkbtn=document.getElementById("stkbtn");
var defbtn=document.getElementById("defbtn");
var recbtn=document.getElementById("recbtn");
var bakbtn=document.getElementById("bakbtn");
var back=document.getElementById("back");
var win=document.getElementById("win");
var lose=document.getElementById("lose");
var text=document.getElementById("text");
var screen=document.getElementById("screen");
var board=document.getElementById("board");
var ctx=board.getContext('2d');
const Choose=['','普通攻擊','防禦','回魔','法術攻擊'];
var choose=false,end=false,wol=-1;
var user=[];
atkbtn.onclick=function(){socket.emit('choose',1); choose=true; btnDisplay("none");};
stkbtn.onclick=function(){socket.emit('choose',4); choose=true; btnDisplay("none");};
defbtn.onclick=function(){socket.emit('choose',2); choose=true; btnDisplay("none");};
recbtn.onclick=function(){socket.emit('choose',3); choose=true; btnDisplay("none");};
bakbtn.onclick=function(){Back();};
back.onclick=function(){Back();};
player1.style.display="none";
player2.style.display="none";
player1_choose.style.display="none";
player2_choose.style.display="none";
function btnDisplay(d=""){
    atkbtn.style.display=d;
    stkbtn.style.display=d;
    defbtn.style.display=d;
    recbtn.style.display=d;
}
function Animate(str,n){
    let p1x=parseInt(player1_choose.style.left.replace('px',''));
    let p2x=parseInt(player2_choose.style.left.replace('px',''));
    if(p2x-p1x<50)Animate2(str,n);
    else{
        player1_choose.style.left=`${p1x+1}px`;
        player2_choose.style.left=`${p2x-1}px`;
        setTimeout(function(){Animate(str,n)},1);
    }
}
function Animate2(str,n){
    let p1x=parseInt(player1_choose.style.left.replace('px',''));
    let p2x=parseInt(player2_choose.style.left.replace('px',''));
    if(p2x-p1x<200){
        player1_choose.style.left=`${p1x-5}px`;
        player2_choose.style.left=`${p2x+5}px`;
        setTimeout(function(){Animate2(str,n)},2);
    }else{
        dice.style.display="";
        setTimeout(function(){Battle(str,n);},3000);
    }
}
function Battle(str,n){
    dice.style.display="none";
    player1_choose.style.display="none";
    player2_choose.style.display="none";
    text.innerHTML+=`擲骰中. 擲骰中.. 擲骰中...<br>你的點數是${user[0].Dice}，對手的點數是${user[1].Dice}<br>`;
    if(n==0){
        wol=0;
        bakbtn.style.display="none";
        back.style.display="";
        end=true;
    }else if(n==user[0].Id){
        wol=1;
        bakbtn.style.display="none";
        back.style.display="";
        win.style.display="";
        end=true;
        str+='<br>You Win!';
    }else if(n==user[1].Id){
        wol=-1;
        bakbtn.style.display="none";
        back.style.display="";
        lose.style.display="";
        end=true;
        str+='<br>You Lose!';
    }else btnDisplay();
    text.innerHTML+=str;
    DrawHpPP();
}
function DrawHpPP(){
    var swid=screen.clientWidth;
    var shei=screen.clientHeight;
    board.setAttribute("height",`${shei}px`);
    board.setAttribute("width",`${swid}px`);
    ctx.clearRect(0, 0, swid, 20);
    ctx.beginPath();
    ctx.fillStyle="#FF0000";
    ctx.moveTo(0,0);
    ctx.lineTo(2*user[0].Hp,0);
    ctx.lineTo(2*user[0].Hp,15);
    ctx.lineTo(0,15);
    ctx.fill();
    ctx.moveTo(swid,0);
    ctx.lineTo(swid-2*user[1].Hp,0);
    ctx.lineTo(swid-2*user[1].Hp,15);
    ctx.lineTo(swid,15);
    ctx.fill();
    ctx.closePath();
    ctx.font="15px sans-serif";
    ctx.fillStyle="#00DDDD";
    ctx.fillText("Hp:"+user[0].Hp,0,12);
    ctx.fillText("Hp:"+user[1].Hp,swid-50,12);
    ctx.clearRect(0, 20, swid,40);
    ctx.beginPath();
    ctx.fillStyle="#00DDDD";
    ctx.moveTo(0,20);
    ctx.lineTo(5*user[0].PP,20);
    ctx.lineTo(5*user[0].PP,35);
    ctx.lineTo(0,35);
    ctx.fill();
    ctx.moveTo(swid,20);
    ctx.lineTo(swid-5*user[1].PP,20);
    ctx.lineTo(swid-5*user[1].PP,35);
    ctx.lineTo(swid,35);
    ctx.fill();
    ctx.closePath();
    ctx.font="15px sans-serif";
    ctx.fillStyle="#FF0000";
    ctx.fillText("PP:"+user[0].PP,0,33);
    ctx.fillText("PP:"+user[1].PP,swid-50,33);
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
function Back(){
    localitem=localStorage.getItem('yesa-item').split(',');
    if(wol==1)localitem[1]=parseInt(localitem[1])+200;
    else if(wol==0)localitem[1]=parseInt(localitem[1])+100;
    localStorage.setItem('yesa-item',localitem);
    window.location.href='../index.html';
}
function Reboot(){
    var charch=user[0].Character.split(',').concat(user[1].Character.split(','));
    player1.style.backgroundImage=`url('character/${charch[0]}/${charch[1]}.png')`;
    player2.style.backgroundImage=`url('character/${charch[2]}/${charch[3]}.png')`;
    text.innerHTML="";
    btnDisplay();
    bakbtn.style.display="";
    win.style.display="none";
    lose.style.display="none";
    dice.style.display="none";
    back.style.display="none";
    player1_choose.style.display="none";
    player2_choose.style.display="none";
    DrawHpPP();
}
function Start(){
    Reboot();
    RePlace();
    player1.innerHTML=`<p>${user[0].Name}<p>`;
    player2.innerHTML=`<p>${user[1].Name}<p>`;
    loading.style.display='none';
    start.style.display="none";
    player1.style.display="";
    player2.style.display="";
    text.innerHTML=`你的對手是: ${user[1].Name}<br>使用的角色: ${user[1].Character.split(',')[0]} Lv: ${user[1].Lv}<br>`;
}
window.onresize=()=>{RePlace();};
window.addEventListener("DOMContentLoaded", () => {
    var name;
    socket.on("connectioned", function(id){
        myId=id;
        name=localStorage.getItem('yesa-name');
        var localchoose=localStorage.getItem('yesa-choose');
        var lchar=localStorage.getItem(`yesa-${localchoose.split(',')[0]}`).split(',');
        socket.emit("set",name,localchoose,lchar[0],lchar[2],lchar[3],lchar[4],lchar[5]);
    });
    socket.on("currentPlayers", function (players) {
        if(Object.keys(players).length==2){
            user[0]=players[1];
            user[1]=players[0];
            console.log(user);
            Start();
        }
    });
    socket.on("newPlayer", function (players) {
        user[0]=players[0];
        user[1]=players[1];
        console.log(user);
        Start();
    });
    socket.on("disconnected", function () {
        if(!end){
            choose=false,end=false,wol=-1;
            loading.style.display="";
            start.style.display="";
            player1.style.display="none";
            player2.style.display="none";
            player1_choose.style.display="none";
            player2_choose.style.display="none";
            alert("對手已離線");
            var localchoose=localStorage.getItem('yesa-choose');
            var lchar=localStorage.getItem(`yesa-${localchoose.split(',')[0]}`).split(',');
            socket.emit("set",name,localchoose,lchar[0],lchar[2],lchar[3],lchar[4],lchar[5]);
        }
    });
    socket.on("oneready", function (enemychoose) {
        if(choose)socket.emit("ready");
    });
    socket.on("battle", function (players,str,n) {
        choose=false;
        if(players[0].Id==user[0].Id){
            user[0]=players[0];
            user[1]=players[1];
        }
        else{
            user[1]=players[0];
            user[0]=players[1];
        }
        text.innerHTML=`${user[0].Name} 選擇了${Choose[user[0].Choose]}<br>${user[1].Name} 選擇了${Choose[user[1].Choose]}<br>`;
        player1_choose.style.top=`${screen.clientHeight-150}px`;
        player1_choose.style.left=`${32}px`;
        player2_choose.style.top=`${screen.clientHeight-150}px`;
        player2_choose.style.left=`${screen.clientWidth-96}px`;
        if(user[0].Choose==1)player1_choose.style.backgroundImage="url('../resources/atk.png')";
        if(user[0].Choose==2)player1_choose.style.backgroundImage="url('../resources/def.png')";
        if(user[0].Choose==3)player1_choose.style.backgroundImage="url('../resources/rec.png')";
        if(user[0].Choose==4)player1_choose.style.backgroundImage="url('../resources/stk.png')";
        if(user[1].Choose==1)player2_choose.style.backgroundImage="url('../resources/atk.png')";
        if(user[1].Choose==2)player2_choose.style.backgroundImage="url('../resources/def.png')";
        if(user[1].Choose==3)player2_choose.style.backgroundImage="url('../resources/rec.png')";
        if(user[1].Choose==4)player2_choose.style.backgroundImage="url('../resources/stk.png')";
        player1_choose.style.display="";
        player2_choose.style.display="";
        Animate(str,n);
    });
});