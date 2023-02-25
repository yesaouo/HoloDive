const dialogshop = document.getElementById('dialogshop');
const dialogchar = document.getElementById('dialogchar');
const dialogtext = document.getElementById('dialogtext');
const stat = document.getElementById("status");
const charDict = {'HakuiKoyori':2,'HoshimachiSuisei':2,'HoushouMarine':2,'MinatoAqua':3,'NakiriAyame':2,'SakuraMiko':3,'ShirakamiFubuki':5,'TokinoSora':4,'TokoyamiTowa':4,'TsunomakiWatame':3,'UsadaPekora':4,'YukihanaLamy':2}
const acc = localStorage.getItem('tgdy-account');
const pas = localStorage.getItem('tgdy-password');
let charObj, itemList, walletList;
let charSelect, iconSelect, picTime;

function GetRan(...num){
    if(num.length==1)return Math.floor(Math.random()*(num[0]))+1;
    if(num.length==2)return Math.floor(Math.random()*(num[1]-num[0]+1))+num[0];
}
function arrayToInt(strArray){
    for(let i=0; i<strArray.length; i++){
        strArray[i] = parseInt(strArray[i]);
    }
    return strArray;
}
function getError(){
    alert('connection error');
    window.location.href='../index.html';
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
async function updateWallet(wallet){
    try {
        const response = await fetch(`/updatewallet?acc=${acc}&pas=${pas}&coin=${wallet[0]}&diamond=${wallet[1]}`);
    } catch (error) { getError(); }
}
async function updateItem(item){
    try {
        const response = await fetch(`/updateitem?acc=${acc}&pas=${pas}&data=${item}`);
    } catch (error) { getError(); }
}
async function updateChar(char,charList=[1,100,GetRan(10,20),GetRan(5,10),GetRan(10,20),GetRan(5,10)]){
    try {
        charObj[char] = charList;
        const response = await fetch(`/updatechar?acc=${acc}&pas=${pas}&data=${JSON.stringify(charObj)}`);
    } catch (error) { getError(); }
}

function displayChar(){
    for(let char in charDict){
        if(char in charObj)document.getElementById(char).style.filter='brightness(100%)';                
        else document.getElementById(char).style.filter='brightness(50%)';
    }
}
function updateStatus(){
    let char = charObj[iconSelect];
    stat.innerHTML=`等級: ${char[0]}<br>血量: ${char[1]}<br>攻擊: ${char[2]}<br>防禦: ${char[3]}<br>特攻: ${char[4]}<br>特防: ${char[5]}`;
}
function Shop(n=-1){
    let trade = false;
    if(n!=-1){
        if(n > -1 && n < 4){
            if(walletList[0] >= 500 * (itemList[n] + 1)){
                walletList[0] -= 500 * (itemList[n] + 1);
                trade = true;
            }else alert(`還缺少${500 * (itemList[n] + 1) - walletList[0]}元`);
        }else if(n == 4){
            if(walletList[0] >= 1000){
                walletList[0] -= 1000;
                trade = true;
            }else alert(`還缺少${1000 - walletList[0]}元`);
        }else if(n == 5){
            if(walletList[0] >= 200){
                walletList[0] -= 200;
                trade = true;
            }else alert(`還缺少${200 - walletList[0]}元`);
        }else if(n == 6){
            if(walletList[1] >= 100){
                walletList[1] -= 100;
                trade = true;
            }else alert(`還缺少${100 - walletList[1]}鑽`);
        }else if(n == 7){
            if(walletList[1] >= 25){
                walletList[1] -= 25;
                trade = true;
            }else alert(`還缺少${25 - walletList[1]}鑽`);
        }
    }
    if(trade){
        itemList[n] += 1;
        updateWallet(walletList);
        updateItem(itemList);
        alert('購買成功');
    }
    document.getElementById('coin').innerHTML = walletList[0];
    document.getElementById('diamond').innerHTML = walletList[1];
    document.getElementById('addatk').innerHTML = '<br><br>'+ itemList[0];
    document.getElementById('adddef').innerHTML = '<br><br>'+ itemList[1];
    document.getElementById('addstk').innerHTML = '<br><br>'+ itemList[2];
    document.getElementById('addsdf').innerHTML = '<br><br>'+ itemList[3];
    document.getElementById('addexp').innerHTML = '<br><br>'+ itemList[4];
    document.getElementById('recover').innerHTML = '<br><br>'+ itemList[5];
    document.getElementById('relv').innerHTML = '<br><br>'+ itemList[6];
    document.getElementById('newchar').innerHTML = '<br><br>'+ itemList[7];
}
function LvUp(charName){
    let char = charObj[charName];
    char[0] += 1;
    char[1] += 10;
    for(let i = 2;i < 6;i++){ char[i] += GetRan(3) + itemList[i - 2]; };
    stat.innerHTML=`等級: ${char[0]}<br>血量: ${char[1]}<br>攻擊: ${char[2]}<br>防禦: ${char[3]}<br>特攻: ${char[4]}<br>特防: ${char[5]}`;
    updateChar(iconSelect, char);
    alert('等級提升');   
}
function checkHp(){
    const char = charObj[charSelect];
    if(char[1] > 0){
        window.location.href='../pve/index.html'; 
    }else alert('請先恢復角色血量');
}
function charAddExp(){
    let char = charObj[iconSelect];
    if(char){
        if(char[0] < 50){
            if(itemList[4] > 0){
                itemList[4] -= 1;
                updateItem(itemList);
                LvUp(iconSelect);
            }else alert('沒有經驗藥水');
        }else alert('50等以上無法使用');
    }else alert('角色尚未解鎖');
}
function charReCover(){
    let char = charObj[iconSelect];
    if(char){
        if(char[1] < char[0] * 10 + 90){
            if(itemList[5] > 0){
                itemList[5] -= 1;
                updateItem(itemList);    
                char[1] = char[0] * 10 + 90;
                stat.innerHTML=`等級: ${char[0]}<br>血量: ${char[1]}<br>攻擊: ${char[2]}<br>防禦: ${char[3]}<br>特攻: ${char[4]}<br>特防: ${char[5]}`;
                updateChar(iconSelect,char);
            }else alert('沒有恢復藥水');
        }else alert('血量已達到等級上限');
    }else alert('角色尚未解鎖');
}
function charReLv(){
    if(iconSelect in charObj){
        if(itemList[6] > 0){
            itemList[6] -= 1;
            updateItem(itemList);
            charObj = [1,100,GetRan(10,20),GetRan(5,10),GetRan(10,20),GetRan(5,10)];
            updateChar(iconSelect,charObj);
            stat.innerHTML=`等級: ${charObj[0]}<br>血量: ${charObj[1]}<br>攻擊: ${charObj[2]}<br>防禦: ${charObj[3]}<br>特攻: ${charObj[4]}<br>特防: ${charObj[5]}`;
            alert('重置成功');
        }else alert('沒有等級重置符文');
    }else alert('角色尚未解鎖');
}
function charAdd(){
    if(iconSelect in charObj){
        alert('角色已解鎖');
    }else{
        if(itemList[7] > 0){
            itemList[7] -= 1;
            updateItem(itemList);
            updateChar(iconSelect);
            document.getElementById(iconSelect).style.filter='brightness(100%)';
            alert('解鎖成功');
        }else{
            alert('需要一張角色解鎖卷');
        }
    }
}
function updateChoose(){
    localStorage.setItem('holodive-choose',[charSelect,picTime]);
}

document.onclick=function(e){
    const e_t_i = e.target.id;
    if((e_t_i == 'screen')||Object.keys(charDict).includes(e_t_i)){
        if(e_t_i == 'screen'){
            picTime++;
            if(picTime>charDict[charSelect])picTime=1;
            updateChoose();
            document.getElementById('screen').style.backgroundImage=`url("../img/character/${charSelect}/${picTime}.png")`;
        }else if(document.getElementById(e_t_i).style.filter!='brightness(50%)'){
            document.getElementById(charSelect).style.border='';
            charSelect=e_t_i;
            iconSelect=charSelect;
            document.getElementById(e_t_i).style.border='5px solid greenyellow';
            document.getElementById('screen').style.backgroundImage=`url("../img/character/${charSelect}/1.png")`;
            dialogtext.innerHTML=iconSelect;
            dialogchar.showModal();
            picTime=1;
            updateChoose();
            updateStatus();
        }else{
            iconSelect=e_t_i;
            dialogtext.innerHTML=iconSelect;
            dialogchar.showModal();
        }
    }

    if(e_t_i == 'shop'){
        Shop();
        dialogshop.showModal();
    }else if(e_t_i == 'cancelshop'){
        dialogshop.close();
    }else if(e_t_i == 'cancelchar'){
        dialogchar.close();
    }else if(e_t_i == 'addatk'){
        Shop(0);
    }else if(e_t_i == 'adddef'){
        Shop(1);
    }else if(e_t_i == 'addstk'){
        Shop(2);
    }else if(e_t_i == 'addsdf'){
        Shop(3);
    }else if(e_t_i == 'addexp'){
        Shop(4);
    }else if(e_t_i == 'recover'){
        Shop(5);
    }else if(e_t_i == 'relv'){
        Shop(6);
    }else if(e_t_i == 'newchar'){
        Shop(7);
    }else if(e_t_i == 'musicdex'){
        const right = document.getElementById('right');
        if(right.style.width == '100%'){
            right.innerHTML = '';
            right.style.width = '0';
        }else{
            right.style.width = '100%';
            right.innerHTML = '<iframe src="https://music-staging.holodex.net/org/Hololive"></iframe>';
        }
    }else if(e_t_i == 'charaddexp'){
        charAddExp();
    }else if(e_t_i == 'charrecover'){
        charReCover();
    }else if(e_t_i == 'charrelv'){
        charReLv();
    }else if(e_t_i == 'charadd'){
        charAdd();
    }else if(e_t_i == 'pve'){
        checkHp();
    }else if(e_t_i == 'pvp'){
        window.location.href='../pvp/split.html';
    }
}

async function Start(){
    charObj = await getCharObj();
    itemList = await getItemList();
    walletList = await getWalletList();
    picTime = 1;
    charSelect = 'TokinoSora';
    iconSelect = charSelect;
    updateChoose();
    updateStatus();
    displayChar();
    document.getElementById(charSelect).style.border='5px solid greenyellow';
    document.getElementById('screen').style.backgroundImage=`url("../img/character/${charSelect}/1.png")`;
}
window.addEventListener("load",Start,false);