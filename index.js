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
let onlineFront=0;
let onlineBack=0;
let battleId=[];
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
    console.log(socket.id+' is connected');
    socket.emit('connectioned',onlineCount);
    io.emit('chatconnect',onlineCount-onlineBack+1);
    socket.on('set', (name,choose,lv,atk,def,stk,sdf) => {
        players[onlineCount] = {
            Id: socket.id,
            Cnt: onlineCount,
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
        if(onlineCount-onlineFront==2){
            onlineFront+=2;
            battleId.push([players[onlineFront-2].Id,players[onlineFront-1].Id])
            io.emit('newPlayer', players.slice(onlineFront-2,onlineFront),battleId.length-1);
        }
    });
    socket.on('disconnect', () => {
        console.log(socket.id+' is disconnected');
        if(onlineCount>0&&socket.id==players[onlineCount-1].Id&&onlineCount%2==1){
            onlineCount--;
            io.emit('chatdisconnect',onlineCount-onlineBack+1);
        }
        else{
            for(var i=battleId.length-1; i>=0; i--){
                if(battleId[i][0]==socket.id||battleId[i][1]==socket.id){
                    io.emit('disconnected',battleId[i]);
                    onlineBack+=2;
                    io.emit('chatdisconnect',onlineCount-onlineBack+1);
                    break;
                }
            }
        }
    });
    socket.on('choose', (n,cnt,team) => {
        players[cnt].Choose = n;
        socket.broadcast.emit('oneready',team);
    });
    socket.on('ready', (a,b,team) => {
        let Hp=[],PP=[];
        Hp[0]=players[a].Hp;
        Hp[1]=players[b].Hp;
        PP[0]=players[a].PP;
        PP[1]=players[b].PP;
        let p1=players[a].Choose,p2=players[b].Choose;
        let result1=0,result2=0;
        const dice1=GetRan(6),dice2=GetRan(6);
        players[a].Dice = dice1;
        players[b].Dice = dice2;
        var damage=[players[a].Atk-players[b].Def,players[a].Def-players[b].Atk,players[a].Stk-players[b].Sdf,players[a].Sdf-players[b].Stk];
        var str="";
        const n1=players[a].Name,n2=players[b].Name;
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
        players[a].Hp=Hp[0];
        players[b].Hp=Hp[1];
        players[a].PP=PP[0];
        players[b].PP=PP[1];
        if((Hp[0]<=0||PP[0]<0)&&(Hp[1]<=0||PP[1]<0)){
            str+='<br>'+n1;
            if(Hp[0]<=0)str+="血量歸零，";
            if(PP[0]<0)str+="魔力枯竭，";
            str+='<br>'+n2;
            if(Hp[1]<=0)str+="血量歸零，";
            if(PP[1]<0)str+="魔力枯竭，";
            str+='<br>和局，雙方皆獲得100鑽石獎勵';
            io.emit('battle',players[a],players[b],str,0,team);
        }else if(Hp[0]<=0||PP[0]<0){
            str+='<br>'+n1;
            if(Hp[0]<=0)str+="血量歸零，";
            if(PP[0]<0)str+="魔力枯竭，";
            io.emit('battle',players[a],players[b],str,players[b].Id,team);
        }else if(Hp[1]<=0||PP[1]<0){
            str+='<br>'+n2;
            if(Hp[1]<=0)str+="血量歸零，";
            if(PP[1]<0)str+="魔力枯竭，";
            io.emit('battle',players[a],players[b],str,players[a].Id,team);
        }else{
            str+=`<br>${n1}現在有${Hp[0]}點血量，${PP[0]}點能量<br>${n2}現在有${Hp[1]}點血量，${PP[1]}點能量`;
            io.emit('battle', players[a],players[b],str,1,team);
        }
    });

    //chat
    socket.on('sendMessage', function(data){
        io.sockets.emit('receiveMessage', data)
    });
});
