(function(){
    var canvas=document.getElementById('canvas'),tipcvs=document.getElementById('tip');
    var ctx=canvas.getContext("2d"),ctxtip=tipcvs.getContext("2d");
    var scoresElement=document.getElementById('scores');
    var resetElement=document.getElementById('reset');
    var pauseElement=document.getElementById('pause');
    var leftbtn=document.getElementById('left'),downbtn=document.getElementById('down'),changebtn=document.getElementById('change'),rightbtn=document.getElementById('right');
    var mainArr,blockObj,prepareObj,blockArr,bw,bh,type,ptype,t,status,pstatus,X,Y,fillcolor,center,bottom,initTimeout=400,rank=0,timeout=initTimeout,to,gameover=false,scores=0,pause=false;

    init();

    document.onkeydown=function(){
        if(!gameover){
            if(event.keyCode==37){
                if(vX(1)){
                    X--;
                    if(X<0)
                        X=0;
                    draw();
                }
            }else if(event.keyCode==39){
                if(vX(-1)){
                    X++;
                    if(X+bw>16)
                        X=16-bw;
                    draw();
                }
            }else if(event.keyCode==40){
                vY();
                draw();
                Y++;
            }else if(event.keyCode==38||event.keyCode==32){
                change();
            }
        }
    }
    leftbtn.onclick=function(){
        if(!gameover){
            if(vX(1)){
                X--;
                if(X<0)
                    X=0;
                draw();
            }
        }
    };
    rightbtn.onclick=function(){
        if(!gameover){
            if(vX(-1)){
                X++;
                if(X+bw>16)
                    X=16-bw;
                draw();
            }
        }
    };
    downbtn.onclick=function(){
        if(!gameover){
           if(!gameover){
                vY();
                draw();
                Y++;
            }
        }
    };
    changebtn.onclick=function(){
        if(!gameover){
            change();
        }
    };
    resetElement.onclick=function(){
        clearInterval(to);
        init();
    };
    pauseElement.onclick=function(){
        if(pause){
            to=setInterval(function(){
                vY();
                draw();
                Y++;
            },timeout);
            pause=false;
            gameover=false;
            this.innerHTML="暂停";
        }else{
            clearInterval(to);
            pause=true;
            gameover=true;
            this.innerHTML="继续"
        }
    };

     function init(){
        gameover=false;
        scores=0;
        pause=false;
        clash=true;
        timeout=initTimeout;
        rank=0;
        scoresElement.innerHTML=scores;
        pauseElement.innerHTML="暂停";
        mainArr=new Array(24);
        for(var i=0;i<24;i++){
            mainArr[i]=new Array(16);
            for(var j=0;j<16;j++){
                mainArr[i][j]=[0,"#888"];
            }
        }
        ptype=parseInt(Math.random()*6);
        pstatus=parseInt(Math.random()*4);
        prepareObj=random(ptype,pstatus);
        blockinit();
        to=setInterval(function(){
            if(!gameover){
                vY();
                draw();
                Y++;
            }
        },timeout);
     };
     function blocktip(obj){
        ctxtip.clearRect(0,0,80,80);
        var x=2-obj.w/2,y=2-obj.h/2,t=obj.t,arr=obj.block;
        blockDraw(t,arr,x,y,ctxtip);
     };
     function blockinit(){
        grid();
        type=ptype;
        status=pstatus;
        blockObj=JSON.stringify(prepareObj);
        blockObj=JSON.parse(blockObj);

        ptype=parseInt(Math.random()*6);
        pstatus=parseInt(Math.random()*4);
        prepareObj=random(ptype,pstatus);
        blocktip(prepareObj);

        blockArr=blockObj.block;
        bw=blockObj.w;
        bh=blockObj.h;
        t=blockObj.t;
        Y=-(1+bh);
        X=8-parseInt(bw/2);
        gameover=false;
    }
    function score(){
        for(var i=Y;i<Y+bh;i++){
            var v=true;
            for(var j=0;j<16;j++){
                if(mainArr[i][j][0]!=1){
                    v=false;
                }
            }
            if(v){
                scores+=16;
                scoresElement.innerHTML=scores;
                mainArr.splice(i,1);
                var arr=new Array(16);
                for(var k=0;k<16;k++){
                    arr[k]=[0,"#888"];
                }
                mainArr.unshift(arr);
                var r=parseInt(scores/300);
                if(rank!=r&&r<10){
                    rank=r;
                    clearInterval(to);
                    timeout=initTimeout-rank*20;
                    to=setInterval(function(){
                        vY();
                        draw();
                        Y++;
                    },timeout)
                }
            }
        }
    }
    function change(){
        status++;
        if(status==4)
            status=0;
        var wblockObj=random(type,status);
        var wblockArr=wblockObj.block;
        var wbw=wblockObj.w;
        var wbh=wblockObj.h;

        var wX=center-parseInt(wbw/2);
        if(wX+wbw>16)
            wX=16-wbw;
        else if(wX<0)
            wX=0;
        var wY=bottom-wbh;
        var v=true;

        for(var i=0;i<wblockArr.length;i++){
            for(var j=0;j<wblockArr[i].length;j++){
                if(wY+i>-1&&wX+j>-1)
                if(wblockArr[i][j]==1&&mainArr[wY+i][wX+j][0]==1){
                    v=false;
                    break;
                }
            }
            if(!v)
                break;
        }

        if(!v){
            status--;
        }else{
            blockObj=random(type,status);
            blockArr=blockObj.block;
            bw=blockObj.w;
            bh=blockObj.h;
            X=wX;
            Y=wY;
            draw();
        }
    }

    function vX(direction){
        var collision=true;
        for(var i=0;i<blockArr.length;i++){
            for(var j=0;j<blockArr[i].length;j++){
                if(blockArr[i][j]==1&&(Y+i)>-1&&(Y+i)<24){
                    if(mainArr[Y+i][X+j-direction]==undefined){
                        collision=false;
                        break;
                    }else if(mainArr[Y+i][X+j-direction][0]==1){
                        collision=false;
                        break;
                    }
                }
            }
            if(!collision)
                break;
        }
        return collision;
    }
    function vY(){
        var collision=true;
        for(var i=blockArr.length-1;i>-1;i--){
            for(var j=0;j<blockArr[i].length;j++){
                if(blockArr[i][j]==1&&(Y+i)>-1&&X>-1&&X+j<16){
                    if(Y+i+1>23||mainArr[Y+i+1][X+j][0]==1){
                        collision=false;
                        gameover=true;
                        break;
                    }
                }
            }
            if(!collision)
                break;
        }
        if(!collision){
            if(Y>-1){
                for(var i=0;i<blockArr.length;i++){
                    for(var j=0;j<blockArr[i].length;j++){
                        if(blockArr[i][j]==1&&mainArr[Y+i]){
                            mainArr[Y+i][X+j]=[blockArr[i][j],fillcolor];
                        }
                    }
                }
                score();
                blockinit();
            }else{
                gameover=true;
                clearTimeout(to);
                setTimeout(function(){
                    alert("GAME OVER");
                },0)
            }
        }
    }
    function draw(){
        ctx.clearRect(0,0,320,480)
        grid();
        center=X+parseInt(bw/2);
        bottom=Y+bh;
        //vY();
        mainDraw()
        blockDraw(t,blockArr,X,Y,ctx);
    }
    function blockDraw(t,arr,x,y,cvs){
        switch(t){
            case 0:
             fillcolor="red";
            break;
            case 1:
             fillcolor="rgb(255,155,30)";
            break;
            case 2:
             fillcolor="yellow";
            break;
            case 3:
             fillcolor="rgb(165,230,0)";
            break;
            case 4:
             fillcolor="rgb(0,225,255)";
            break;
            case 5:
             fillcolor="rgb(255,35,220)";
            break;
        }
        cvs.fillStyle=fillcolor;
        for(var i=0;i<arr.length;i++){
            for(var j=0;j<arr[i].length;j++){
                if(arr[i][j]==1){
                    cvs.fillRect((x+j)*20+1,(y+i)*20+1,19,19);
                }
            }
        }
    }
    function mainDraw(){
       for(var i=0;i<mainArr.length;i++){
            for(var j=0;j<mainArr[i].length;j++){
                if(mainArr[i][j][0]==1){
                    ctx.fillStyle=mainArr[i][j][1];
                    ctx.fillRect(j*20+1,i*20+1,19,19);
                }
            }
        }
    }

    function grid(){
        ctx.fillStyle='#ddd';
        for(var i=1;i<16;i++){
            ctx.fillRect(i*20,0,1,480)
        }
        for(var j=1;j<24;j++){
            ctx.fillRect(0,j*20,320,1)
        }
    }

    function random(t,s){
        var type=t;
        var arr=[];
        var status;
        if(type==0)
            arr={block:[[1,1],[1,1]],w:2,h:2,s:0,t:0};
        else if(type<4){
            status=parseInt(s)%2;
            switch(type){
                case 1:
                    switch(status){
                        case 0:
                            arr={block:[[1,1,1,1]],w:4,h:1,s:0,t:1};
                        break;
                        case 1:
                            arr={block:[[1],[1],[1],[1]],w:1,h:4,s:1,t:1};
                        break;
                    }
                break;
                case 2:
                    switch(status){
                            case 0:
                                arr={block:[[0,1,1],[1,1,0]],w:3,h:2,s:0,t:2};
                            break;
                            case 1:
                                arr={block:[[1,0],[1,1],[0,1]],w:2,h:3,s:1,t:2};
                            break;
                        }
                break;
                case 3:
                    switch(status){
                            case 0:
                                arr={block:[[1,1,0],[0,1,1]],w:3,h:2,s:0,t:3};
                            break;
                            case 1:
                                arr={block:[[0,1],[1,1],[1,0]],w:2,h:3,s:1,t:3};
                            break;
                        }
                break;
            }
        }else{
            status=parseInt(s);
            switch(type){
                case 4:
                    switch(status){
                        case 0:
                            arr={block:[[1,0,0],[1,1,1]],w:3,h:2,s:0,t:4};
                        break;
                        case 1:
                            arr={block:[[1,1],[1,0],[1,0]],w:2,h:3,s:1,t:4};
                        break;
                        case 2:
                            arr={block:[[1,1,1],[0,0,1]],w:3,h:2,s:2,t:4};
                        break;
                        case 3:
                            arr={block:[[0,1],[0,1],[1,1]],w:2,h:3,s:3,t:4};
                        break;
                    }
                break;
                case 5:
                    switch(status){
                            case 0:
                                arr={block:[[0,0,1],[1,1,1]],w:3,h:2,s:0,t:5};
                            break;
                            case 1:
                                arr={block:[[1,0],[1,0],[1,1]],w:2,h:3,s:1,t:5};
                            break;
                            case 2:
                                arr={block:[[1,1,1],[1,0,0]],w:3,h:2,s:2,t:5};
                            break;
                            case 3:
                                arr={block:[[1,1],[0,1],[0,1]],w:2,h:3,s:3,t:5};
                            break;
                        }
                break;
            }
        }
        return arr;
    }
})();