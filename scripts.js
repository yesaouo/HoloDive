const addatk = document.getElementById('addatk');
const adddef = document.getElementById('adddef');
const addstk = document.getElementById('addstk');
const addsdf = document.getElementById('addsdf');
const recover = document.getElementById('recover'); 
const addexp = document.getElementById('addexp');
const relv = document.getElementById('relv');
const newchar = document.getElementById('newchar');
const coin = document.getElementById('coin');
const diamond = document.getElementById('diamond');
const dialogshop = document.getElementById('dialogshop');
const dialogchar = document.getElementById('dialogchar');
const shop = document.getElementById('shop');
const cancelshop = document.getElementById('cancelshop');
const cancelchar = document.getElementById('cancelchar');
const charaddexp = document.getElementById('charaddexp');
const charrecover = document.getElementById('charrecover');
const charrelv = document.getElementById('charrelv');
const charadd = document.getElementById('charadd');
const screen = document.getElementById("screen");
const stat = document.getElementById("status");
const submit = document.getElementById("submit");
const pve = document.getElementById('pve');
const pvp = document.getElementById('pvp');
const chardict={'HakuiKoyori':2,'HoshimachiSuisei':2,'HoushouMarine':2,'MinatoAqua':3,'NakiriAyame':2,'SakuraMiko':3,'ShirakamiFubuki':5,'TokinoSora':4,'TokoyamiTowa':4,'TsunomakiWatame':3,'UsadaPekora':4,'YukihanaLamy':2}
var charselect,iconselect,pictime;

function GetRan(...num){
    if(num.length==1)return Math.floor(Math.random()*(num[0]))+1;
    if(num.length==2)return Math.floor(Math.random()*(num[1]-num[0]+1))+num[0];
}
function localnameset(){
    var localname=localStorage.getItem('yesa-name');
    localname||localStorage.setItem('yesa-name',window.prompt('Enter your name','佑樹'));
}
function localset(){
    var useritem=[0,0,0,0,0,0,0,0,0,0];
    var localitem=localStorage.getItem('yesa-item');
    localitem ? (useritem=localitem.split(',')) : (localStorage.setItem('yesa-item',useritem));
    return useritem;
}
function localcharset(char){
    var userchar=[1,100,GetRan(10,20),GetRan(5,10),GetRan(10,20),GetRan(5,10)];
    var localchar=localStorage.getItem(`yesa-${char}`);
    localchar ? (userchar=localchar.split(',')) : (localStorage.setItem(`yesa-${char}`,userchar));
    return userchar;
}
function localchoose(){
    localStorage.setItem('yesa-choose',[charselect,pictime]);
}
function localupdate(useritem=[0,0,0,0,0,0,0,0,0,0]){
    localStorage.setItem('yesa-item',useritem);
}
function localcharupdate(char,userchar=[1,100,GetRan(10,20),GetRan(5,10),GetRan(10,20),GetRan(5,10)]){
    localStorage.setItem(`yesa-${char}`,userchar);
}
function Shop(n){
    var useritem=localset();
    if(n<6){
        if(parseInt(useritem[0])>=1000*(parseInt(useritem[n])+1)){
            useritem[0]=parseInt(useritem[0])-1000*(parseInt(useritem[n])+1);
            useritem[n]=parseInt(useritem[n])+1;
            alert('購買成功');
            localupdate(useritem);
        }else alert(`還缺少${1000*(parseInt(useritem[n])+1)-parseInt(useritem[0])}元`);
    }else if(n==6){
        if(parseInt(useritem[0])>=500){
            useritem[0]=parseInt(useritem[0])-500;
            useritem[n]=parseInt(useritem[n])+1;
            alert('購買成功');
            localupdate(useritem);
        }else alert(`還缺少${500-parseInt(useritem[0])}元`);
    }else if(n==7){
        if(parseInt(useritem[1])>=200){
            useritem[1]=parseInt(useritem[1])-200;
            useritem[n]=parseInt(useritem[n])+1;
            alert('購買成功');
            localupdate(useritem);
        }else alert(`還缺少${200-parseInt(useritem[1])}鑽`);
    }else if(n==8){
        if(parseInt(useritem[1])>=1000){
            useritem[1]=parseInt(useritem[1])-1000;
            useritem[n]=parseInt(useritem[n])+1;
            alert('購買成功');
            localupdate(useritem);
        }else alert(`還缺少${1000-parseInt(useritem[1])}鑽`);
    }else if(n==9){
        if(parseInt(useritem[1])>=3000){
            useritem[1]=parseInt(useritem[1])-3000;
            useritem[n]=parseInt(useritem[n])+1;
            alert('購買成功');
            localupdate(useritem);
        }else alert(`還缺少${3000-parseInt(useritem[1])}鑽`);
    }
    Openshop();
}
function Openshop(){
    var useritem=localset();
    coin.innerHTML=useritem[0];
    diamond.innerHTML=useritem[1];
    addatk.innerHTML = '<br><br>'+useritem[2];
    adddef.innerHTML = '<br><br>'+useritem[3];
    addstk.innerHTML = '<br><br>'+useritem[4];
    addsdf.innerHTML = '<br><br>'+useritem[5];
    addexp.innerHTML = '<br><br>'+useritem[6];
    recover.innerHTML = '<br><br>'+useritem[7];
    relv.innerHTML = '<br><br>'+useritem[8];
    newchar.innerHTML = '<br><br>'+useritem[9];
}
function CharDisplay(){
    for(var char in chardict){
        if(localStorage.getItem(`yesa-${char}`))document.getElementById(char).style.filter='brightness(100%)';                
        else document.getElementById(char).style.filter='brightness(50%)';
    }
}
function LvUp(char){
    var useritem=localset();
    var userchar=localcharset(char);    
    userchar[0]=parseInt(userchar[0])+1;
    userchar[1]=parseInt(userchar[1])+10;
    for(var i=2;i<6;i++){
        userchar[i]=parseInt(userchar[i])+GetRan(3)+parseInt(useritem[i+1]);
    }
    stat.innerHTML=`等級: ${userchar[0]}<br>血量: ${userchar[1]}<br>攻擊: ${userchar[2]}<br>防禦: ${userchar[3]}<br>特攻: ${userchar[4]}<br>特防: ${userchar[5]}`;
    localcharupdate(iconselect,userchar);
    alert('等級提升');   
}
function RenewStatus(){
    var userchar=localcharset(charselect);
    stat.innerHTML=`等級: ${userchar[0]}<br>血量: ${userchar[1]}<br>攻擊: ${userchar[2]}<br>防禦: ${userchar[3]}<br>特攻: ${userchar[4]}<br>特防: ${userchar[5]}`;
}

shop.onclick=function(){Openshop();dialogshop.showModal();};
cancelshop.onclick=function(){dialogshop.close();};
cancelchar.onclick=function(){dialogchar.close();};
addatk.onclick=function(){Shop(2);};
adddef.onclick=function(){Shop(3);};
addstk.onclick=function(){Shop(4);};
addsdf.onclick=function(){Shop(5);};
addexp.onclick=function(){Shop(6);};
recover.onclick=function(){Shop(7);};
relv.onclick=function(){Shop(8);};
newchar.onclick=function(){Shop(9);};
charaddexp.onclick=function(){
    if(localStorage.getItem(`yesa-${iconselect}`)){
        var userchar=localcharset(iconselect);
        if(parseInt(userchar[0])<50){
            var useritem=localset();
            if(parseInt(useritem[6])>0){
                useritem[6]=parseInt(useritem[6])-1;
                localupdate(useritem);
                LvUp(iconselect);
            }else alert('沒有經驗藥水');
        }else alert('50等以上無法使用');
    }else alert('角色尚未解鎖');
};
charrecover.onclick=function(){
    if(localStorage.getItem(`yesa-${iconselect}`)){
        var userchar=localcharset(iconselect);
        if(parseInt(userchar[1])<parseInt(userchar[0])*10+90){
            var useritem=localset();
            if(parseInt(useritem[7])>0){
                useritem[7]=parseInt(useritem[7])-1;
                localupdate(useritem);    
                userchar[1]=parseInt(userchar[0])*10+90;
                stat.innerHTML=`等級: ${userchar[0]}<br>血量: ${userchar[1]}<br>攻擊: ${userchar[2]}<br>防禦: ${userchar[3]}<br>特攻: ${userchar[4]}<br>特防: ${userchar[5]}`;
                localcharupdate(iconselect,userchar);
            }else alert('沒有恢復藥水');
        }else alert('血量已達到等級上限');
    }else alert('角色尚未解鎖');
};
charrelv.onclick=function(){
    var useritem=localset();
    if(localStorage.getItem(`yesa-${iconselect}`)){
        if(parseInt(useritem[8])>0){
            localcharupdate(iconselect);
            useritem[8]=parseInt(useritem[8])-1;
            localupdate(useritem);
            RenewStatus();
            alert('重置成功');
        }else alert('沒有等級重置符文');
    }else alert('角色尚未解鎖');
};
charadd.onclick=function(){
    var useritem=localset();
    if(localStorage.getItem(`yesa-${iconselect}`)){
        alert('角色已解鎖');
    }else{
        if(parseInt(useritem[9])>0){
            localcharset(iconselect);
            useritem[9]=parseInt(useritem[9])-1;
            localupdate(useritem);
            alert('解鎖成功');
            CharDisplay();
        }else{
            alert('需要一張角色解鎖卷');
        }
    }
};
pve.onclick=function(){
    if(localStorage.getItem(`yesa-${charselect}`).split(',')[1]>0){
        window.location.href='pve/index.html'; 
    }else alert('請先恢復角色血量');
};
pvp.onclick=function(){
    window.location.href='pvp/index.html';
};
document.onclick=function(e){
    if((e.target.id=='screen')||Object.keys(chardict).includes(e.target.id)){
        if(e.target.id=="screen"){
            pictime++;
            if(pictime>chardict[charselect])pictime=1;
            localchoose();
            screen.style.backgroundImage=`url("character/${charselect}/${pictime}.png")`;
        }else if(document.getElementById(e.target.id).style.filter!='brightness(50%)'){
            document.getElementById(charselect).style.border='';
            charselect=e.target.id;
            iconselect=charselect;
            document.getElementById(e.target.id).style.border='5px solid greenyellow';
            screen.style.backgroundImage=`url("character/${charselect}/1.png")`;
            document.getElementById('dialogtext').innerHTML=iconselect;
            dialogchar.showModal();
            pictime=1;
            localchoose();
            RenewStatus();
        }else{
            iconselect=e.target.id;
            document.getElementById('dialogtext').innerHTML=iconselect;
            dialogchar.showModal();
        }
    }
}
document.getElementById("musicdex").onclick=function(){
    const right=document.getElementById('right');
    if(right.style.width=='100%'){
        right.innerHTML='';
        right.style.width='0';
    }else{
        right.style.width='100%';
        right.innerHTML='<iframe src="https://music-staging.holodex.net/org/Hololive"></iframe>';
    }
};

function Start(){
    localset();
    pictime=1;
    charselect='TokinoSora';
    iconselect=charselect;
    localcharset(charselect);
    localchoose();
    RenewStatus();
    CharDisplay();
    document.getElementById(charselect).style.border='5px solid greenyellow';
    screen.style.backgroundImage=`url("character/${charselect}/1.png")`;
    localnameset();
}
window.addEventListener("load",Start,false);