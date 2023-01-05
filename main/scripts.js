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
const dialogtext = document.getElementById('dialogtext');
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
const cloud = document.getElementById('cloud');
const musicdex = document.getElementById('musicdex');
const chardict={'HakuiKoyori':2,'HoshimachiSuisei':2,'HoushouMarine':2,'MinatoAqua':3,'NakiriAyame':2,'SakuraMiko':3,'ShirakamiFubuki':5,'TokinoSora':4,'TokoyamiTowa':4,'TsunomakiWatame':3,'UsadaPekora':4,'YukihanaLamy':2}
var charselect,iconselect,pictime;

function GetRan(...num){
    if(num.length==1)return Math.floor(Math.random()*(num[0]))+1;
    if(num.length==2)return Math.floor(Math.random()*(num[1]-num[0]+1))+num[0];
}
function localSet(){
    let localobj=localStorage.getItem('yesa-HoloDive');
    if(localobj){
        localobj=JSON.parse(localobj);
        localStorage.setItem('yesa-name',localobj.Name);
        localStorage.setItem('yesa-item',localobj.Item);
    }else{
        alert('something went wrong');
        window.location.href='../index.html';
    }
}
function localUpdate(){
    let localobj=localStorage.getItem('yesa-HoloDive');
    if(localobj){
        localobj=JSON.parse(localobj);
        localobj.Name=localStorage.getItem('yesa-name');
        localobj.Item=localStorage.getItem('yesa-item').split(',');
        localStorage.setItem('yesa-HoloDive',JSON.stringify(localobj));
    }else{
        alert('something went wrong');
        window.location.href='../index.html';
    }
}
function getItem(){
    return localStorage.getItem('yesa-item').split(',');
}
function updateItem(item){
    localStorage.setItem('yesa-item',item);
    localUpdate();
}
function getChar(char){
    let localobj=JSON.parse(localStorage.getItem('yesa-HoloDive'));
    return localobj.Character[char];
}
function updateChar(char,userchar=[1,100,GetRan(10,20),GetRan(5,10),GetRan(10,20),GetRan(5,10)]){
    let localobj=JSON.parse(localStorage.getItem('yesa-HoloDive'));
    localobj.Character[char]=userchar;
    console.log(char,localobj.Character[char])
    localStorage.setItem('yesa-HoloDive',JSON.stringify(localobj));
}
function displayChar(){
    let localobj=JSON.parse(localStorage.getItem('yesa-HoloDive'));
    for(var char in chardict){
        if(char in localobj.Character)document.getElementById(char).style.filter='brightness(100%)';                
        else document.getElementById(char).style.filter='brightness(50%)';
    }
}
function updateChoose(){
    localStorage.setItem('yesa-choose',[charselect,pictime]);
}

function Shop(n){
    var item=getItem();
    if(n<6){
        if(parseInt(item[0])>=1000*(parseInt(item[n])+1)){
            item[0]=parseInt(item[0])-1000*(parseInt(item[n])+1);
            item[n]=parseInt(item[n])+1;
            alert('購買成功');
        }else alert(`還缺少${1000*(parseInt(item[n])+1)-parseInt(item[0])}元`);
    }else if(n==6){
        if(parseInt(item[0])>=500){
            item[0]=parseInt(item[0])-500;
            item[n]=parseInt(item[n])+1;
            alert('購買成功');
        }else alert(`還缺少${500-parseInt(item[0])}元`);
    }else if(n==7){
        if(parseInt(item[1])>=200){
            item[1]=parseInt(item[1])-200;
            item[n]=parseInt(item[n])+1;
            alert('購買成功');
        }else alert(`還缺少${200-parseInt(item[1])}鑽`);
    }else if(n==8){
        if(parseInt(item[1])>=1000){
            item[1]=parseInt(item[1])-1000;
            item[n]=parseInt(item[n])+1;
            alert('購買成功');
        }else alert(`還缺少${1000-parseInt(item[1])}鑽`);
    }else if(n==9){
        if(parseInt(item[1])>=3000){
            item[1]=parseInt(item[1])-3000;
            item[n]=parseInt(item[n])+1;
            alert('購買成功');
        }else alert(`還缺少${3000-parseInt(item[1])}鑽`);
    }
    updateItem(item);
    Openshop();
}
function Openshop(){
    var useritem=getItem();
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
function LvUp(char){
    var useritem=getItem();
    var userchar=getChar(char);
    userchar[0]=parseInt(userchar[0])+1;
    userchar[1]=parseInt(userchar[1])+10;
    for(var i=2;i<6;i++){
        userchar[i]=parseInt(userchar[i])+GetRan(3)+parseInt(useritem[i+1]);
    }
    stat.innerHTML=`等級: ${userchar[0]}<br>血量: ${userchar[1]}<br>攻擊: ${userchar[2]}<br>防禦: ${userchar[3]}<br>特攻: ${userchar[4]}<br>特防: ${userchar[5]}`;
    updateChar(iconselect,userchar);
    alert('等級提升');   
}
function RenewStatus(){
    var userchar=getChar(charselect);
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
    var userchar=getChar(iconselect);
    if(userchar!=undefined){
        if(parseInt(userchar[0])<50){
            var item=getItem();
            if(parseInt(item[6])>0){
                item[6]=parseInt(item[6])-1;
                updateItem(item);
                LvUp(iconselect);
            }else alert('沒有經驗藥水');
        }else alert('50等以上無法使用');
    }else alert('角色尚未解鎖');
};
charrecover.onclick=function(){
    var userchar=getChar(iconselect);
    if(userchar!=undefined){
        if(parseInt(userchar[1])<parseInt(userchar[0])*10+90){
            var item=getItem();
            if(parseInt(item[7])>0){
                item[7]=parseInt(item[7])-1;
                updateItem(item);    
                userchar[1]=parseInt(userchar[0])*10+90;
                stat.innerHTML=`等級: ${userchar[0]}<br>血量: ${userchar[1]}<br>攻擊: ${userchar[2]}<br>防禦: ${userchar[3]}<br>特攻: ${userchar[4]}<br>特防: ${userchar[5]}`;
                updateChar(iconselect,userchar);
            }else alert('沒有恢復藥水');
        }else alert('血量已達到等級上限');
    }else alert('角色尚未解鎖');
};
charrelv.onclick=function(){
    var item=getItem();
    if(getChar(iconselect)!=undefined){
        if(parseInt(item[8])>0){
            updateChar(iconselect);
            item[8]=parseInt(item[8])-1;
            updateItem(item);
            RenewStatus();
            alert('重置成功');
        }else alert('沒有等級重置符文');
    }else alert('角色尚未解鎖');
};
charadd.onclick=function(){
    var item=getItem();
    if(getChar(iconselect)!=undefined){
        alert('角色已解鎖');
    }else{
        if(parseInt(item[9])>0){
            updateChar(iconselect);
            item[9]=parseInt(item[9])-1;
            updateItem(item);
            alert('解鎖成功');
            displayChar();
        }else{
            alert('需要一張角色解鎖卷');
        }
    }
};
pve.onclick=function(){
    let localobj=JSON.parse(localStorage.getItem('yesa-HoloDive'));
    if(localobj.Character[charselect][1]>0){
        window.location.href='../pve/index.html'; 
    }else alert('請先恢復角色血量');
};
pvp.onclick=function(){
    window.location.href='../pvp/split.html';
};
document.onclick=function(e){
    if((e.target.id=='screen')||Object.keys(chardict).includes(e.target.id)){
        if(e.target.id=="screen"){
            pictime++;
            if(pictime>chardict[charselect])pictime=1;
            updateChoose();
            screen.style.backgroundImage=`url("../img/character/${charselect}/${pictime}.png")`;
        }else if(document.getElementById(e.target.id).style.filter!='brightness(50%)'){
            document.getElementById(charselect).style.border='';
            charselect=e.target.id;
            iconselect=charselect;
            document.getElementById(e.target.id).style.border='5px solid greenyellow';
            screen.style.backgroundImage=`url("../img/character/${charselect}/1.png")`;
            dialogtext.innerHTML=iconselect;
            dialogchar.showModal();
            pictime=1;
            updateChoose();
            RenewStatus();
        }else{
            iconselect=e.target.id;
            dialogtext.innerHTML=iconselect;
            dialogchar.showModal();
        }
    }
}
async function Upload(acc,pas,data) {
    try {
        const response = await fetch(`/api/signin?acc=${acc}&pas=${pas}&data=${data}`);
        const user = await response.text();
        console.log(user);
        if(user=="account or password incorrect"){
            alert('something went wrong');
            window.location.href='../index.html';
        }else{
            alert('upload success');
        }
    } catch (error) {console.error(error);}
}

cloud.onclick=function(){
    Upload(localStorage.getItem('yesa-account'),localStorage.getItem('yesa-password'),localStorage.getItem('yesa-HoloDive'));
}
musicdex.onclick=function(){
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
    localSet();
    pictime=1;
    charselect='TokinoSora';
    iconselect=charselect;
    updateChoose();
    RenewStatus();
    displayChar();
    document.getElementById(charselect).style.border='5px solid greenyellow';
    screen.style.backgroundImage=`url("../img/character/${charselect}/1.png")`;
}
window.addEventListener("load",Start,false);