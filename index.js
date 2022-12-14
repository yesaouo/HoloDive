const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile( __dirname + '/index.html');
});

const MongoClient= require('mongodb').MongoClient;
const url= "mongodb+srv://yesa:A8746z@cluster0.uiviw1n.mongodb.net/?retryWrites=true&w=majority";
function mongonewUser(myobj){
    MongoClient.connect(url, function(err, db) {
        if(err) throw err;
        const dbo= db.db("holodive");
        dbo.collection("login").insertOne(myobj, function(err, res) {
            if(err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
}
app.get('/api/signin', (req, res) => {
    let acc = req.query.acc;
    let pas = req.query.pas;
    let data = req.query.data;
    if(data=="null"){
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("holodive");
            dbo.collection("login").find({Account: acc, Password: pas}).toArray(function (err, result) {
                if (err) throw err;
                if(result.length){
                    console.log(result[0].Name+' login');
                    res.send(result[0]);
                }else{
                    res.send("account or password incorrect");
                }
                db.close();
            });
        });
    }else{
        data = JSON.parse(data);
        delete data._id;
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            const dbo = db.db("holodive");
            const myquery = {Account: acc, Password: pas};
            const newvalues = { $set: data };
            dbo.collection("login").updateOne(myquery, newvalues, function (err, result) {
                if (err) throw err;
                console.log("1 document updated");
                res.send(data);
                db.close();
            });
        });
    }
});
app.get('/api/signup', (req, res) => {
    const acc = req.query.acc;
    const pas = req.query.pas;
    const name = req.query.name;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("holodive");
        dbo.collection("login").find({Account: acc}).toArray(function (err, result) {
            if (err) throw err;
            if(result.length){
                res.send("This account is already used.");
            }else{
                const char={'TokinoSora':[1,100,GetRan(10,20),GetRan(5,10),GetRan(10,20),GetRan(5,10)]};
                let newUser = {
                    Account: acc,
                    Password: pas,
                    Name: name,
                    Item: [1000,200,0,0,0,0,0,0,0,1],
                    Character: char
                }
                mongonewUser(newUser);
                res.send("registration success");
            }
            db.close();
        });
    });
});   
  
server.listen(PORT, () => {
    console.log("Server Started. "+PORT);
});

let onlineCount=0;
let onlineFront=0;
let chatCount=0;
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
    chatCount++;
    socket.emit('connectioned',onlineCount);
    io.emit('chatconnect',Math.ceil(chatCount/2));
    socket.on('set', (name,choose,lv,atk,def,stk,sdf) => {
        console.log(`${name} connect(${chatCount/2})`);
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
    socket.on('solo', () => {
        onlineCount--;
        socket.emit('solostart',players[onlineCount]);
    });
    socket.on('disconnect', () => {
        chatCount--;
        if(chatCount%2==0){
            io.emit('chatdisconnect',chatCount/2);
            console.log(`Online(${chatCount/2})`);
        }
        if(onlineCount>0&&socket.id==players[onlineCount-1].Id&&onlineCount%2==1){
            onlineCount--;
        }else{
            for(var i=battleId.length-1; i>=0; i--){
                if(battleId[i][0]==socket.id||battleId[i][1]==socket.id){
                    io.emit('disconnected',battleId[i]);
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
                str+=`${n2}???????????????${n1}??????${n1}???${n2}?????????${result2}?????????`;
            }
            else if(dice1<dice2){
                result1=GoE0(p2==1?-damage[1]:-damage[3])+5*(dice2-dice1);
                str+=`${n1}???????????????${n2}??????${n2}???${n1}?????????${result1}?????????`;
            }else str+="???????????????????????????";
        }
        if((p1==1||p1==4)&&p2==2){
            if(dice1>dice2){
                result2=GoE0(p1==1?damage[0]:damage[2]+5*(dice1-dice2));
                str+=`${n1}???${n2}?????????${result2}?????????`;   
            }
            if(dice1<dice2){
                result1=GoE0(p1==1?-damage[0]:-damage[2])+5*(dice2-dice1);
                str+=`${n2}???${n1}?????????${result1}????????????????????????${result1}?????????`;
                Hp[1]+=result1;
            }
            if(dice1==dice2)str+=`??????????????????${dice1}?????????`;
        }
        if(p1==2&&(p2==1||p2==4)){
            if(dice1<dice2){ 
                result1=GoE0(p2==1?-damage[1]:-damage[3]+5*(dice2-dice1));
                str+=`${n2}???${n1}?????????${result1}?????????`; 
            }
            if(dice1>dice2){ 
                result2=GoE0(p2==1?damage[1]:damage[3])+5*(dice1-dice2);
                str+=`${n1}???${n2}?????????${result2}????????????????????????${result2}?????????`; 
                Hp[0]+=result2;
            }
            if(dice1==dice2)str+="???????????????????????????";
        }
        if(p1==3&&p2==3){str+=`${n1}?????????${dice1}????????????${n2}?????????${dice2}?????????`; PP[0]+=dice1*2; PP[1]+=dice2*2;}
        if(p1==2&&p2==3){str+=`${n2}?????????${dice2}????????????${n1}???????????????${dice1}?????????`; PP[1]+=dice2*2;}
        if(p1==3&&p2==2){str+=`${n1}?????????${dice1}????????????${n2}???????????????${dice2}?????????`; PP[0]+=dice1*2;}
        if((p1==1||p1==4)&&p2==3){ 
            result2=GoE0(p1==1?damage[0]:damage[2])+5*dice1;
            str+=`${n2}?????????${dice2}????????????${n1}???????????????${result2}?????????`;
            PP[1]+=dice2*2;
        }
        if(p1==3&&(p2==1||p2==4)){
            result1=GoE0(p2==1?-damage[1]:-damage[3])+5*dice2;
            str+=`${n1}?????????${dice1}????????????${n2}???????????????${result1}?????????`;
            PP[0]+=dice1*2;
        }
        Hp[0]-=result1; Hp[1]-=result2; PP[0]-=dice1; PP[1]-=dice2;
        players[a].Hp=Hp[0];
        players[b].Hp=Hp[1];
        players[a].PP=PP[0];
        players[b].PP=PP[1];
        if((Hp[0]<=0||PP[0]<0)&&(Hp[1]<=0||PP[1]<0)){
            str+='<br>'+n1;
            if(Hp[0]<=0)str+="???????????????";
            if(PP[0]<0)str+="???????????????";
            str+='<br>'+n2;
            if(Hp[1]<=0)str+="???????????????";
            if(PP[1]<0)str+="???????????????";
            str+='<br>????????????????????????100????????????';
            io.emit('battle',players[a],players[b],str,0,team);
        }else if(Hp[0]<=0||PP[0]<0){
            str+='<br>'+n1;
            if(Hp[0]<=0)str+="???????????????";
            if(PP[0]<0)str+="???????????????";
            io.emit('battle',players[a],players[b],str,players[b].Id,team);
        }else if(Hp[1]<=0||PP[1]<0){
            str+='<br>'+n2;
            if(Hp[1]<=0)str+="???????????????";
            if(PP[1]<0)str+="???????????????";
            io.emit('battle',players[a],players[b],str,players[a].Id,team);
        }else{
            str+=`<br>${n1}?????????${Hp[0]}????????????${PP[0]}?????????<br>${n2}?????????${Hp[1]}????????????${PP[1]}?????????`;
            io.emit('battle', players[a],players[b],str,1,team);
        }
    });

    //chat
    socket.on('sendMessage', function(data){
        io.sockets.emit('receiveMessage', data)
    });
});
