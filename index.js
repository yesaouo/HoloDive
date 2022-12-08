const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile( __dirname + '/index.html');
});
server.listen(PORT, () => {
    console.log("Server Started. "+PORT);
});

let onlineCount=0;
let onlineId=[];
let players=[];
function GetRan(...num){
    if(num.length==1)return Math.floor(Math.random()*(num[0]))+1;
    if(num.length==2)return Math.floor(Math.random()*(num[1]-num[0]+1))+num[0];
}
function GoE0(n){
    if(n>0)return n;
    else return 0;
}

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('connectioned',socket.id);
    socket.on('set', (name,choose,lv,atk,def,stk,sdf) => {
        onlineId[socket.id]=onlineCount;
        players[onlineCount] = {
            Id: socket.id,
            Name: name,
            Character: choose,
            Choose: 0,
            Dice: 0,
            Lv: lv,
            Hp: parseInt(lv)*10+90,
            PP: 15,
            Atk: atk,
            Def: def,
            Stk: stk,
            Sdf: sdf
        }
        onlineCount++;
        socket.emit('currentPlayers', players);
        if(onlineCount==2)socket.broadcast.emit('newPlayer', players);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
        onlineCount--;
        if(onlineId[socket.id]<2){
            players.shift();
            players.shift();
            delete onlineId[socket.id];
            onlineCount=0;
            io.emit('disconnected');
        }
    });
    socket.on('choose', (n) => {
        players[onlineId[socket.id]].Choose = n;
        socket.broadcast.emit('oneready', n);
    });
    socket.on('ready', () => {
        let Hp=[],PP=[];
        Hp[0]=players[0].Hp;
        Hp[1]=players[1].Hp;
        PP[0]=players[0].PP;
        PP[1]=players[1].PP;
        let p1=players[0].Choose,p2=players[1].Choose;
        let result1=0,result2=0;
        const dice1=GetRan(6),dice2=GetRan(6);
        players[0].Dice = dice1;
        players[1].Dice = dice2;
        var damage=[players[0].Atk-players[1].Def,players[0].Def-players[1].Atk,players[0].Stk-players[1].Sdf,players[0].Sdf-players[1].Stk];
        var str="";
        const n1=players[0].Name,n2=players[1].Name;
        if((p1==1||p1==4)&&(p2==1||p2==4)){
            if(dice1>dice2){
                result2=GoE0(p1==1?damage[0]:damage[2])+5*(dice1-dice2);
                str+=`${n2}無法攻擊到${n1}，而${n1}對${n2}造成了${result2}點傷害`;
            }
            else if(dice1<dice2){
                result1=GoE0(p2==1?-damage[1]:-damage[3])+5*(dice2-dice1);
                str+=`${n1}無法攻擊到${n2}，而${n2}對${n1}造成了${result1}點傷害`;
            }else str+="高手過招，無人受傷";
        }
        if((p1==1||p1==4)&&p2==2){
            if(dice1>dice2){
                result2=GoE0(p1==1?damage[0]:damage[2]+5*(dice1-dice2));
                str+=`${n1}對${n2}造成了${result2}點傷害`;   
            }
            if(dice1<dice2){
                result1=GoE0(p1==1?-damage[0]:-damage[2])+5*(dice2-dice1);
                str+=`${n2}對${n1}造成了${result1}點傷害，並回復了${result1}點血量`;
                Hp[1]+=result1;
            }
            if(dice1==dice2)str+=`雙方皆損失了${dice1}點能量`;
        }
        if(p1==2&&(p2==1||p2==4)){
            if(dice1<dice2){ 
                result1=GoE0(p2==1?-damage[1]:-damage[3]+5*(dice2-dice1));
                str+=`${n2}對${n1}造成了${result1}點傷害`; 
            }
            if(dice1>dice2){ 
                result2=GoE0(p2==1?damage[1]:damage[3])+5*(dice1-dice2);
                str+=`${n1}對${n2}造成了${result2}點傷害，並回復了${result2}點血量`; 
                Hp[0]+=result2;
            }
            if(dice1==dice2)str+="高手過招，無人受傷";
        }
        if(p1==3&&p2==3){str+=`${n1}回復了${dice1}點能量，${n2}回復了${dice2}點能量`; PP[0]+=dice1*2; PP[1]+=dice2*2;}
        if(p1==2&&p2==3){str+=`${n2}回復了${dice2}點能量，${n1}白白損失了${dice1}點能量`; PP[1]+=dice2*2;}
        if(p1==3&&p2==2){str+=`${n1}回復了${dice1}點能量，${n2}白白損失了${dice2}點能量`; PP[0]+=dice1*2;}
        if((p1==1||p1==4)&&p2==3){ 
            result2=GoE0(p1==1?damage[0]:damage[2])+5*dice1;
            str+=`${n2}回復了${dice2}點能量，${n1}對他造成了${result2}點傷害`;
            PP[1]+=dice2*2;
        }
        if(p1==3&&(p2==1||p2==4)){
            result1=GoE0(p2==1?-damage[1]:-damage[3])+5*dice2;
            str+=`${n1}回復了${dice1}點能量，${n2}對他造成了${result1}點傷害`;
            PP[0]+=dice1*2;
        }
        Hp[0]-=result1; Hp[1]-=result2; PP[0]-=dice1; PP[1]-=dice2;
        players[0].Hp=Hp[0];
        players[1].Hp=Hp[1];
        players[0].PP=PP[0];
        players[1].PP=PP[1];
        if((Hp[0]<=0||PP[0]<0)&&(Hp[1]<=0||PP[1]<0)){
            str+='<br>'+n1;
            if(Hp[0]<=0)str+="血量歸零，";
            if(PP[0]<0)str+="魔力枯竭，";
            str+='<br>'+n2;
            if(Hp[1]<=0)str+="血量歸零，";
            if(PP[1]<0)str+="魔力枯竭，";
            str+='<br>和局，雙方皆獲得100鑽石獎勵';
            io.emit('battle', players, str, 0);
        }else if(Hp[0]<=0||PP[0]<0){
            str+='<br>'+n1;
            if(Hp[0]<=0)str+="血量歸零，";
            if(PP[0]<0)str+="魔力枯竭，";
            io.emit('battle', players, str, players[1].Id);
        }else if(Hp[1]<=0||PP[1]<0){
            str+='<br>'+n2;
            if(Hp[1]<=0)str+="血量歸零，";
            if(PP[1]<0)str+="魔力枯竭，";
            io.emit('battle', players, str, players[0].Id);
        }else{
            str+=`<br>${n1}現在有${Hp[0]}點血量，${PP[0]}點能量<br>${n2}現在有${Hp[1]}點血量，${PP[1]}點能量`;
            io.emit('battle', players, str, 1);
        }
    });
});
