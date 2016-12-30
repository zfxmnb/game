(function(){
var a,wall=[[[10,10,20,20],[30,30,40,40],[10,30,20,40],[30,10,40,20]],
            [[5,5,15,6],[5,5,6,15],[5,35,6,46],[5,45,15,46],[35,5,45,6],[45,5,46,15],[45,35,46,45],[35,45,46,46],
            [10,10,15,15],[35,10,40,15],[10,35,15,40],[35,35,40,40]],
            [[5,5,6,10],[14,5,15,10],[20,5,21,10],[30,5,31,10],[40,5,41,10],[45,5,46,10],
            [6,23,7,28],[15,23,16,28],[21,23,22,28],[31,23,32,28],[41,23,42,28],[46,23,47,28],
            [5,40,6,45],[14,40,15,45],[20,40,21,45],[30,40,31,45],[40,40,41,45],[45,40,46,45]]
            ],r=50,width=450,speed=1,original=140,timeout=original,hz=12,tt,grade=0,recordGrade=0;
var direction,foodCount,foodControl,energy,score,foods,buffer,foodKeep,isStart=false,currPause=false,buffertime=0,foodtime=0,foodCountTime=0,bufferCountTime=0,bufferType=0;
var canvas=document.getElementById('con'),
    scoreEle=document.getElementById('score'),
    recordEle=document.getElementById('record'),
    reset=document.getElementById("reset"),
    save=document.getElementById("save"),
    load=document.getElementById("load"),
    pause=document.getElementById("pause"),
    screenshot=document.getElementById("screenshot"),
    titleGrade=document.getElementById("titleGrade"),
    helpTip=document.getElementById("help");
if(typeof document.ontouchstart!="undefined"){
    var downEvent="touchstart";
}else{
    var downEvent="mousedown";
}
var ctx=canvas.getContext('2d');
if(!ctx){
    alert("你的浏览器不支持该游戏，请使用IE9以上浏览器打开");
    return;
}
ctx.fillStyle="#FF0000";
ctx.shadowColor="#333";
ctx.shadowBlur=0;
ctx.textAlign="center";
ctx.textBaseline="middle";

init(7,0);
control();
function control(){
    var beforeCode=0;
    document.onkeydown=function(e){
        e.preventDefault();
        if(isStart){
            if(currPause){
               pause.onclick();
            }else if(e.keyCode==13||e.keyCode==32){
                pause.onclick();
            };
            if(beforeCode!=17){
                if((e.keyCode==37||e.keyCode==65)&&direction!=4&&a[0].dir!=4){
                    direction=3;
                }else if((e.keyCode==38||e.keyCode==87)&&direction!=2&&a[0].dir!=2){
                    direction=1;
                }else if((e.keyCode==39||e.keyCode==68)&&direction!=3&&a[0].dir!=3){
                    direction=4;
                }else if((e.keyCode==40||e.keyCode==83)&&direction!=1&&a[0].dir!=1){
                    direction=2;
                };
            };
            if(e.keyCode==17){
                beforeCode=17;
                document.addEventListener("keydown",function(e){
                    if(e.keyCode==83){
                        save.onclick();
                    };
                    beforeCode=0;
                    document.removeEventListener("keydown",arguments.callee);
                })
            }
        }
    };

    document.ontouchmove=function(event){
        event.preventDefault();
    };
    canvas.addEventListener("touchstart",function(event){
        if(isStart){
            var sx=event.targetTouches[0].clientX,sy=event.targetTouches[0].clientY; 
            canvas.addEventListener("touchend",function(e){
                var ex=e.changedTouches[0].clientX,ey=e.changedTouches[0].clientY;
                var cx=ex-sx,cy=ey-sy;
                if(Math.abs(cx)>20||Math.abs(cy)>20){
                    if(currPause){
                       pause.onclick();
                    }
                    if(Math.abs(cx)>Math.abs(cy)){
                        if(cx<0&&direction!=4&&a[0].dir!=4){
                             direction=3;
                        }else if(direction!=3&&a[0].dir!=3){
                            direction=4;
                        }
                    }else{
                        if(cy<0&&direction!=2&&a[0].dir!=2){
                            direction=1;
                        }else if(direction!=1&&a[0].dir!=1){
                            direction=2;
                        }
                    }
                };
                canvas.removeEventListener("touchend",arguments.callee);
            });
        }
    });
    helpTip.onclick=function(){
        pause.onclick();
        setTimeout(function(){
            alert("Ctrl+S：存档(保存所有状态)\n空格/回车：暂停\n任意键：继续\n\n普通食物：+50分、+1长度\n红心：+300分、+2长度、出现9秒\n加速食物：+400分、+1长度、速度加倍(12秒)、出现9秒\n减速食物：+50分、+2长度、速度减半(12秒)、出现9秒");
        },0)
    };
    reset.onclick=function(){
        clearInterval(tt);
        init((7+grade*10),grade,grade*20);
    };
    save.onclick=function(){
         if(isStart){
            if(foodtime!=0)
                foodCountTime=(foodCountTime==0?9000:foodCountTime)-(new Date().getTime()-foodtime);
            if(buffertime!=0)
                bufferCountTime=(bufferCountTime==0?12000:bufferCountTime)-(new Date().getTime()-buffertime);
            var save=[foodCount,foodControl,energy,score,foods,isStart,timeout,currPause,a,foodCountTime,bufferCountTime,bufferType,direction];
            localStorage["grade"+grade]=JSON.stringify(save);
            load.className="";
         }
    };
    load.onclick=function(){
         if(localStorage["grade"+grade]&&localStorage["grade"+grade]!=""){
            clearTimeout(foodKeep);
            clearInterval(buffer);
            clearInterval(tt);
            var save=JSON.parse(localStorage["grade"+grade]);
            foodCount=save[0];foodControl=save[1];energy=save[2];score=save[3];foods=save[4];isStart=save[5];timeout=save[6];currPause=save[7];a=save[8];foodCountTime=save[9];bufferCountTime=save[10];bufferType=save[11];direction=save[12];
            init((7+grade*10),grade,grade*20,true);
            pause.onclick();
         }
    };
    pause.onclick=function(){
        if(isStart){
            if(currPause){
                currPause=false;
                this.innerHTML="暂停";
                clearInterval(tt);
                tt=setInterval(function(){
                    interval(a,grade);
                },timeout);
                continues(a,grade);
            }else{
                clearTimeout(foodKeep);
                clearInterval(buffer);
                if(foodtime!=0)
                    foodCountTime=(foodCountTime==0?9000:foodCountTime)-(new Date().getTime()-foodtime);
                if(buffertime!=0)
                    bufferCountTime=(bufferCountTime==0?12000:bufferCountTime)-(new Date().getTime()-buffertime);
                clearInterval(tt);
                this.innerHTML="继续";
                currPause=true;
                build(a,grade);
                ctx.fillStyle="rgba(150,150,150,0.5)";
                ctx.fillRect(0,0,width,width);
                ctx.shadowBlur=10;
                ctx.fillStyle="rgba(255,255,255,1)";
                ctx.font="30px MicroSoft YaHei";
                ctx.fillText("暂停(任意键继续)",width/2,width/2,width);
                ctx.shadowBlur=0;
            }
        }
    };
    screenshot.addEventListener(downEvent,function(){
            if(!currPause){
                pause.onclick();
            }
            document.getElementById("pause").innerHTML="继续";
            currPause=true;
            build(a,grade);
            ctx.fillStyle="rgba(150,150,150,0.5)";
            ctx.fillRect(0,0,width,width);
            ctx.shadowBlur=10;
            ctx.fillStyle="rgba(255,255,255,1)";
            ctx.font="30px MicroSoft YaHei";
            ctx.fillText(titleGrade.innerText+"分数："+score,width/2,width/2,width);
            ctx.shadowBlur=0;
            this.href=canvas.toDataURL();
            this.download=document.getElementsByClassName('title')[0].innerText;
    });
    var gradeEle=document.getElementsByClassName("grade")[0].getElementsByTagName("button");
    for(var i in gradeEle){
        gradeEle[i].onclick=function(){
            for(var j in gradeEle){
                gradeEle[j].className="";
            };
            this.className="curr";
            clearInterval(tt);
            grade=this.getAttribute("data-grade");
            init((7+grade*10),grade,grade*20);
            titleGrade.innerHTML=this.innerHTML;
        }
    }
};
function continues(a,w){
    if(foodCountTime>0){
        foodtime=new Date().getTime();
        foodKeep=setTimeout(function(){
            for(var i in foods){
                if(foods[i][4]>0){
                    foods.splice(i,1);
                    i--;
                }
            };
        foodtime=0;
        foodCountTime=0;
        },foodCountTime);
    }
    if(bufferCountTime>0){
        buffertime=new Date().getTime();
        clearInterval(tt);
        if(bufferType==1){
            tt=setInterval(function(){
                interval(a,w);
            },timeout/2);
        };
        if(bufferType==2){
            tt=setInterval(function(){
                interval(a,w);
            },timeout*2);
        };
        buffer=setTimeout(function(){
            clearInterval(tt);
            tt=setInterval(function(){
                interval(a,w);
            },timeout);
            buffertime=0;
            bufferCountTime=0;
        },bufferCountTime)
    }
};
function init(g,w,sp,history){
    if(!history){
        foodCount=1;foodControl=true;energy=0;score=0;foods=[];isStart=true;timeout=original-(sp||0);currPause=false,buffertime=0,foodtime=0,foodCountTime=0,bufferCountTime=0,bufferType=0;
        clearTimeout(foodKeep);
        clearInterval(buffer);
        var start=random(w);
        var x=parseInt(start/r);
        var y=start%r;

        a=new Array(g+1);
        a[0]={x:x,y:y,part:"head",dir:direction};
        if(direction==1){
            for(var i=0;i<g+1;i++){
                if(x==r-1)
                    x=0;
                else
                    x++;
                if(i==g-1){
                    a[i+1]={x:x,y:y,part:"tail",dir:direction}
                }else if(i==g){
                    a[i+1]={x:x,y:y,part:"tailEnd",dir:direction}
                }else{
                    a[i+1]={x:x,y:y,part:"body",dir:direction}
                }
            }
        }else if(direction==2){
            for(var i=0;i<g+1;i++){
                if(x==0)
                    x=r-1;
                else
                    x--;
               if(i==g-1){
                    a[i+1]={x:x,y:y,part:"tail",dir:direction}
                }else if(i==g){
                    a[i+1]={x:x,y:y,part:"tailEnd",dir:direction}
                }else{
                    a[i+1]={x:x,y:y,part:"body",dir:direction}
                }
            }
        }else if(direction==3){
            for(var i=0;i<g+1;i++){
                if(y==r-1)
                    y=0;
                else
                    y++;
                if(i==g-1){
                    a[i+1]={x:x,y:y,part:"tail",dir:direction}
                }else if(i==g){
                    a[i+1]={x:x,y:y,part:"tailEnd",dir:direction}
                }else{
                    a[i+1]={x:x,y:y,part:"body",dir:direction}
                }
            }
        }else if(direction==4){
            for(var i=0;i<g+1;i++){
                if(y==0)
                    y=r-1;
                else
                    y--;
                if(i==g-1){
                    a[i+1]={x:x,y:y,part:"tail",dir:direction}
                }else if(i==g){
                    a[i+1]={x:x,y:y,part:"tailEnd",dir:direction}
                }else{
                    a[i+1]={x:x,y:y,part:"body",dir:direction}
                }
            }
        }
        food(w,0,0,[]);
    }else{
        foodtime=0,buffertime=0;
    }
    save.className="";
    load.className="";
    if(!(isStart&&localStorage["grade"+grade]&&localStorage["grade"+grade]!="")){
        load.className="disable";
    };
    if(localStorage&&localStorage["record"+w]){
        recordGrade=parseInt(localStorage["record"+w]);
    }else{
        recordGrade=0;
    };
    recordEle.innerHTML=recordGrade;
    scoreEle.innerHTML=score;
    build(a,w);
    action(a,w);
};
function random(w){
    var start=parseInt(Math.random()*r*r);
    direction=parseInt(Math.random()*4)+1;
    var x=parseInt(start/r);
    var y=start%r;
    var v1=true;
    for(var j in wall[w]){
        if(!(x<wall[w][j][1]||x>wall[w][j][3]-1||y<wall[w][j][0]||y>wall[w][j][2]-1)){
            v1=false;
        }else{
            if(parseInt(direction/3)!=0&&!(x<wall[w][j][1]||x>wall[w][j][3]-1)){
                v1=false;
            }else if(parseInt(direction/3)==0&&!(y<wall[w][j][0]||y>wall[w][j][2]-1)){
                v1=false;
            }
        }
    }
    if(v1)
        return start;
    else
        return arguments.callee(w);
};
function food(w,type,num,arr){
    var pointer=parseInt(Math.random()*(r*r-num));
    var N=0;
    for(var i=0;i<(r*r-num);i++){
        var av=true,x=parseInt(i/r),y=i%r;
        for(var j in arr){
            if(arr[j][0]==x&&arr[j][0]==y){
                av=false;
            }
        };
        if(av){
            if(N==pointer){
                x=parseInt(N/r),y=N%r;
                var v1=true,v2=true,v3=true,t=0;
                if(type>0){
                    var t=1;
                    if(num==(r*r)-2)
                        return;
                    if(x==r-1||y==r-1)
                        v3=false;
                }else{
                    if(num==(r*r)-2){
                        clearInterval(tt);
                        setTimeout(function(){
                            alert("你已经厉害炸了!");
                        },0);
                        return;
                    };
                    foodControl=false;
                    for(var j in foods){
                       if(!(x<foods[j][1]-t||x>foods[j][3]-1||y<foods[j][0]-t||y>foods[j][2]-1)){
                            v3=false;
                        }
                    }
                };
                for(var j in wall[w]){
                    if(!(x<wall[w][j][1]-t||x>wall[w][j][3]-1||y<wall[w][j][0]-t||y>wall[w][j][2]-1)){
                        v1=false;
                    }
                };
                for(var i in a){
                    if(a[i].x==x&&a[i].y==y||a[i].x-t==x&&a[i].y==y||a[i].x==x&&a[i].y-t==y||a[i].x-t==x&&a[i].y-t==y){
                        v2=false;
                    }
                };
                if(v1&&v2&&v3){
                    if(type>0){
                        for(var i in foods){
                            if(foods[i][4]>0){
                                foods.splice(i,1);
                                i--;
                            }
                        };
                        clearTimeout(foodKeep);
                        foodtime=new Date().getTime();
                        foodKeep=setTimeout(function(){
                            for(var i in foods){
                                if(foods[i][4]>0){
                                    foods.splice(i,1);
                                    i--;
                                }
                                foodtime=0;
                            }
                        },9000)
                    };
                   return foods.push([x,y,(x+t+1),(y+t+1),type]);
                }else{ 
                    arr.push([x,y]);
                    return arguments.callee(w,type,num++,arr);
                };
                break;
            };
            N++;
        }     
    };
};
function action(a,w){
    tt=setInterval(function(){
        interval(a,w);
    },timeout)
};
function interval(a,w){
        if(foodControl){
            if(foodCount%hz==0&&foodCount!=0){
                food(w,parseInt(Math.random()*3+1),0,[]);
            }
            food(w,0,0,[]);
        };
        var x=a[0].x;var y=a[0].y;
        a[0].part="body";
        if(energy==0){
            a[a.length-3].part="tail";
            a[a.length-2].part="tailEnd";
            a.pop();
        }else{
            energy--;
        };
        if(direction==1){
            if(x==0)
                x=r-speed;
            else
                x-=speed;
        }else if(direction==2){
            if(x==r-speed)
                x=0;
            else
                x+=speed;
        }else if(direction==3){
            if(y==0)
                y=r-speed;
            else
                y-=speed;
        }else if(direction==4){
            if(y==r-speed)
                y=0;
            else
                y+=speed;
        };
        if(direction!=a[0].dir)
            a[0].dir=direction+""+a[0].dir;
        var v1=true,v2=true;
        for(var j in wall[w]){
            if(!(x<wall[w][j][1]||x>wall[w][j][3]-1||y<wall[w][j][0]||y>wall[w][j][2]-1)){
                v1=false;
            }
        };
        for(var i in a){
            if(a[i].x==x&&a[i].y==y){
                v2=false;
            }
        };
        for(var j=0;j<foods.length;j++){
            if(foods[j][4]>0){
                if(!(x<foods[j][0]||x>foods[j][2]-1||y<foods[j][1]||y>foods[j][3]-1)){
                    buffertime=new Date().getTime();
                    foodCountTime=0;
                    foodtime=0;
                    if(foods[j][4]==1){
                        score+=400;
                        energy=1;
                        clearInterval(tt);
                        tt=setInterval(function(){
                            interval(a,w);
                        },timeout/2);
                        bufferType=1;
                        buffertime=new Date().getTime();
                        clearTimeout(buffer);
                        buffer=setTimeout(function(){
                            clearInterval(tt);
                            tt=setInterval(function(){
                                interval(a,w);
                            },timeout);
                            buffertime=0;
                        },12000)
                    }else if(foods[j][4]==2){
                        score+=50;
                        energy=2;
                        clearInterval(tt);
                        tt=setInterval(function(){
                            interval(a,w);
                        },timeout*2);
                        bufferType=2;
                        buffertime=new Date().getTime();
                        clearTimeout(buffer);
                        buffer=setTimeout(function(){
                            clearInterval(tt);
                            tt=setInterval(function(){
                                interval(a,w);
                            },timeout);
                            buffertime=0;
                        },12000)
                    }else if(foods[j][4]==3){
                        score+=300;
                        energy=2;
                    };
                    foods.splice(j,1);
                    j--;
                    scoreEle.innerHTML=score;
                    if(score>recordGrade){
                        recordGrade=score;
                        recordEle.innerHTML=recordGrade;
                        if(localStorage)
                        localStorage["record"+w]=recordGrade;
                    }
                }
            }else{
                if(x==foods[j][0]&&y==foods[j][1]){
                    foodControl=true;
                    foods.splice(j,1);
                    energy=1;
                    foodCount++;
                    j--;
                    score+=50;
                    scoreEle.innerHTML=score;
                    if(score>recordGrade){
                        recordGrade=score;
                        recordEle.innerHTML=recordGrade;
                        if(localStorage)
                        localStorage["record"+w]=recordGrade;
                    }
                }
            }
        };
        a.unshift({x:x,y:y,part:"head",dir:direction});
        build(a,w);
        if(v1&&v2){
        }else{
            clearInterval(tt);
            save.className="disable";
            isStart=false;
            setTimeout(function(){
                alert("亲，你脑袋撞到了呦");
            },0)
        }
};
function build(a,W){
    var w=width/r;
    ctx.clearRect(0,0,width,width);
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,width,width);
    for(var i in wall[W]){
            ctx.fillStyle="rgb("+(50+W*40)+",76,76)";
            var x=wall[W][i][0],y=wall[W][i][1],Width=wall[W][i][2]-x,Height=wall[W][i][3]-y;
            ctx.fillRect(x*w,y*w,Width*w,Height*w);
    }
    for(var i in foods){
            ctx.fillStyle="#f50";
            var x=foods[i][0],y=foods[i][1],Width=foods[i][2]-x,Height=foods[i][3]-y;
            if(foods[i][4]!=3){
                ctx.beginPath();
                ctx.arc(y*w+Width*w/2,x*w+Width*w/2,Width/2*w,0,Math.PI*2,false);
                ctx.closePath();
                ctx.fill();
                ctx.font="12px MicroSoft YaHei";
                ctx.fillStyle="#fff";
            }else{
                var m=w/8;
                ctx.beginPath();
                ctx.moveTo(y*w+8*m,x*w+3*m);
                ctx.bezierCurveTo(y*w+12*m,x*w+-1*m,y*w+20*m,x*w+3*m,y*w+8*m,x*w+13*m);
                ctx.bezierCurveTo(y*w+-4*m,x*w+3*m,y*w+4*m,x*w+-1*m,y*w+8*m,x*w+3*m);
                ctx.fill();
            };
            if(foods[i][4]>0)
            switch (foods[i][4]){
                case 1:
                    ctx.fillText("加",y*w+Width*w/2,x*w+Width*w/2,Width*w);
                break;
                case 2:
                    ctx.fillText("减",y*w+Width*w/2,x*w+Width*w/2,Width*w);
                break;
            }
    };
    ctx.fillStyle="#f00";
    for(var i=0;i<r;i+=speed){
        for(var j=0;j<r;j+=speed){
            for(var k=1;k<a.length;k++){
                if(i==a[k].x&&j==a[k].y){
                    if(a[k].part=="tail"){
                        ctx.fillStyle="#f00";
                        if(a[k].dir>10){
                            ctx.beginPath();
                            if(a[k].dir==31||a[k].dir==24){
                                if(a[k].dir==31)
                                    var x=-w/4,y=0;
                                else
                                    var x=0,y=w/4;
                                ctx.arc(j*w+x,i*w+w+y,w,Math.PI*1.5,Math.PI*2,false);
                                ctx.lineTo(j*w,i*w+w);
                            }else if(a[k].dir==41||a[k].dir==23){
                                if(a[k].dir==41)
                                    var x=w/4,y=0;
                                else
                                    var x=0,y=w/4;
                                ctx.arc(j*w+w+x,i*w+w+y,w,Math.PI*1,Math.PI*1.5,false);
                                ctx.lineTo(j*w+w,i*w+w);
                            }else if(a[k].dir==32||a[k].dir==14){
                                if(a[k].dir==32)
                                    var x=-w/4,y=0;
                                else
                                    var x=0,y=-w/4;
                                 ctx.arc(j*w+x,i*w+y,w,0,Math.PI*0.5,false);
                                 ctx.lineTo(j*w,i*w);
                            }else if(a[k].dir==42||a[k].dir==13){
                                if(a[k].dir==42)
                                    var x=w/4,y=0;
                                else
                                    var x=0,y=-w/4;
                                ctx.arc(j*w+w+x,i*w+y,w,Math.PI*0.5,Math.PI*1,false);
                                ctx.lineTo(j*w+w,i*w);
                            }
                            ctx.closePath();
                            ctx.fill();
                        }else{
                            if(a[k].dir>10)
                                var t=parseInt(a[k].dir/10);
                            else
                                var t=a[k].dir;
                            ctx.beginPath();
                            switch (t){
                                case 1:
                                    ctx.moveTo(j*w,i*w);
                                    ctx.lineTo(j*w+w/4,i*w+w);
                                    ctx.lineTo(j*w+w*3/4,i*w+w);
                                    ctx.lineTo(j*w+w,i*w);
                                break;
                                case 2:
                                    ctx.moveTo(j*w,i*w+w);
                                    ctx.lineTo(j*w+w/4,i*w);
                                    ctx.lineTo(j*w+w*3/4,i*w);
                                    ctx.lineTo(j*w+w,i*w+w);
                                break;
                                case 3:
                                    ctx.moveTo(j*w,i*w);
                                    ctx.lineTo(j*w+w,i*w+w/4);
                                    ctx.lineTo(j*w+w,i*w+w*3/4);
                                    ctx.lineTo(j*w,i*w+w);
                                break;
                                case 4:
                                    ctx.moveTo(j*w+w,i*w);
                                    ctx.lineTo(j*w,i*w+w/4);
                                    ctx.lineTo(j*w,i*w+w*3/4);
                                    ctx.lineTo(j*w+w,i*w+w);
                                break;
                                ctx.closePath();
                            }
                            ctx.fill();
                        }
                    }else if(a[k].part=="tailEnd"){
                        ctx.fillStyle="#f00";
                        ctx.beginPath();
                        if(a[k].dir>10)
                            var t=parseInt(a[k].dir/10);
                        else
                            var t=a[k].dir;
                        switch (t){
                            case 1:
                                ctx.moveTo(j*w+w/4,i*w);
                                ctx.lineTo(j*w+w/2,i*w+w);
                                ctx.lineTo(j*w+w*3/4,i*w);
                            break;
                            case 2:
                                ctx.moveTo(j*w+w/4,i*w+w);
                                ctx.lineTo(j*w+w/2,i*w);
                                ctx.lineTo(j*w+w*3/4,i*w+w);
                            break;
                            case 3:
                                ctx.moveTo(j*w,i*w+w/4);
                                ctx.lineTo(j*w+w,i*w+w/2);
                                ctx.lineTo(j*w,i*w+w*3/4);
                            break;
                            case 4:
                                ctx.moveTo(j*w+w,i*w+w/4);
                                ctx.lineTo(j*w,i*w+w/2);
                                ctx.lineTo(j*w+w,i*w+w*3/4);
                            break;
                            ctx.closePath();
                            ctx.fill();
                        };
                        ctx.closePath();
                        ctx.fill();
                    }else if(a[k].part=="body"){
                        if(k%2==1){
                            ctx.fillStyle="#f00";
                        }else{
                            ctx.fillStyle="green";
                        };
                        if(a[k].dir>10){
                            ctx.beginPath();
                            if(a[k].dir==31||a[k].dir==24){
                                ctx.arc(j*w,i*w+w,w,Math.PI*1.5,Math.PI*2,false);
                                ctx.lineTo(j*w,i*w+w);
                            }else if(a[k].dir==41||a[k].dir==23){
                                ctx.arc(j*w+w,i*w+w,w,Math.PI*1,Math.PI*1.5,false);
                                ctx.lineTo(j*w+w,i*w+w);
                            }else if(a[k].dir==32||a[k].dir==14){
                                 ctx.arc(j*w,i*w,w,0,Math.PI*0.5,false);
                                 ctx.lineTo(j*w,i*w);
                            }else if(a[k].dir==42||a[k].dir==13){
                                ctx.arc(j*w+w,i*w,w,Math.PI*0.5,Math.PI*1,false);
                                ctx.lineTo(j*w+w,i*w);
                            }
                            ctx.closePath();
                            ctx.fill();
                        }else{
                            ctx.fillRect(j*w,i*w,w,w);
                        }
                    }
                }
            }
        }
    };
    if(a[0].part=="head"){
        ctx.fillStyle="#f00";
        ctx.beginPath();
        var i=a[0].x,j=a[0].y;
        switch (a[0].dir){
            case 1:
                ctx.arc(j*w+w/2,i*w+w,w/2,Math.PI*1,Math.PI*2,false);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle="yellow";
                ctx.beginPath();
                ctx.arc(j*w+w/4,i*w+w,w/5,Math.PI*1,Math.PI*2,false);
                ctx.arc(j*w+w*3/4,i*w+w,w/5,Math.PI*1,Math.PI*2,false);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
                ctx.fillStyle="#f00";
            break;
            case 2:
                ctx.arc(j*w+w/2,i*w,w/2,Math.PI*1,Math.PI*2,true);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle="yellow";
                ctx.beginPath();
                ctx.arc(j*w+w/4,i*w,w/5,0,Math.PI*2,false);
                ctx.arc(j*w+w*3/4,i*w,w/5,0,Math.PI*2,false);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
                ctx.fillStyle="#f00";
            break;
            case 3:
                ctx.arc(j*w+w,i*w+w/2,w/2,Math.PI*0.5,Math.PI*1.5,false);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle="yellow";
                ctx.beginPath();
                ctx.arc(j*w+w,i*w+w/4,w/5,0,Math.PI*2,false);
                ctx.arc(j*w+w,i*w+w*3/4,w/5,0,Math.PI*2,false);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
                ctx.fillStyle="#f00";
            break;
            case 4:
                ctx.arc(j*w,i*w+w/2,w/2,Math.PI*0.5,Math.PI*1.5,true);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle="yellow";
                ctx.beginPath();
                ctx.arc(j*w,i*w+w/4,w/5,0,Math.PI*2,false);
                ctx.arc(j*w,i*w+w*3/4,w/5,0,Math.PI*2,false);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
                ctx.fillStyle="#f00";
            break;
        }
    }
};
})()
