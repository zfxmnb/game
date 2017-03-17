
$(function(){
    var needles=$(".needles"),needle=$(".container>.needle"),center=$(".center"),container=$(".container")
    var R=0,t,arr=[],count=0;
    var customsArr=[[7,25,5,true],[8,25,6,true],[9,24,7,true],[10,24,8,true],[10,23,9,true],[11,22,10,true],[11,20,10,true],[12,18,10,true],[12,18,11,true],[12,17,11,false],[13,15,11,true],[13,14,12,false],[14,14,12,true],[14,14,13,false],[14,13,13,true],[14,12,13,false],[14,11,13,true],[14,11,14,false],[14,10,14,true],[14,9,14,true]];
    //初始化
    var init=function(num,nn){
        center.empty();
        var i=0;
        arr=[];
        needles.empty();
        for(var j=1;j<nn;j++){
            needles.append("<li>");
        }
        while(i<num){
            var r=parseInt(Math.random()*360),can=true;
                for(var k=0;k<arr.length;k++){
                    if(Math.abs(r-arr[k])<10){
                        can=false;
                    }
                }
            if(can){
                var ele=needle.clone();
                ele.css({"transform":"rotate("+r+"deg)","top":"120px"});
                arr.push(r);
                center.append(ele);
                i++;
            }
        }
    }
    //旋转动画
    var rotate=function(speed,f){
            if(f){
                R=0;
                t=setInterval(function(){
                    R+=0.8;
                    if(R>360){ 
                        R-=360;
                    }
                    center.css({"transform":"rotate("+R+"deg)"});
                },speed||20);
            }else{
                R=360;
                t=setInterval(function(){
                    R-=0.8;
                    center.css({"transform":"rotate("+R+"deg)"});
                    if(R<0)
                        R+=360;
                },speed||20);
            }
    }
    //完成一个关卡执行的清除操作
    var clear=function(){
            container.off();$(document).off("keydown");
            clearInterval(t);
            setTimeout(function(){
                center.empty();
                customs(count);
            },1500)
    }
    //进入关卡
    var customs=function(c){
        needle.show();
        $.cookie("count",c,{ expires: 365 });
        init(customsArr[c][0],customsArr[c][2]);
        rotate(customsArr[c][1],customsArr[c][3]);
        container.on("mousedown touch",function(event){
				event.preventDefault();
                trigger();
        });
        $(document).on("keydown",function(e){
                var keycode=e.keyCode
                if(keycode==13||keycode==32||keycode==38)
                    trigger();
        });
        $(".custom").html("第 "+(c-0+1)+"<small>("+customsArr.length+")</small> 关");
    }
    //每点击一下执行的动画及判断
    var trigger=function(){
        container.off();$(document).off("keydown");
        needle.removeClass("moment");
        needle.css({"top":"260px"});//css3动画
        //0.2s动画完成执行
        setTimeout(function(){
            needle.addClass("moment");
            var can=true,cR=R;
                 for(var k=0;k<arr.length;k++){
                        if(Math.abs((360-cR)-arr[k])<9.5){
                            can=false;
                        }
                }
            var ele=needle.clone();
            ele.css({"transform":"rotate("+(360-cR)+"deg)",top:"120px"});
            arr.push(360-cR);
            center.append(ele);

            if(needles.find("li").length==0){
                needle.hide();
                if(!can){
                    center.css({"transform":"rotate("+R+"deg)"});
                    setTimeout(function(){
                        alert("好可惜就差一点点！");
                        clear();
                    },20)
                }else{
                    count++;
                    if(count<customsArr.length){
						if(count==14){alert("你这么厉害你家里人造吗，不造就赶紧告诉他们！")}
						if(count==17){alert("我的女王大人，请收下我的膝盖！")}
						clear();
                    }
                    else{
						alert("无敌是多么寂寞！")
					}
                }
            }else{
                needles.find("li").last().remove();
                if(!can){
                    center.css({"transform":"rotate("+R+"deg)"});
                    setTimeout(function(){
                        alert("挑战失败再接再厉！");
                        clear();
                    },20)
                }else{
                    container.on("mousedown touch",function(event){
							event.preventDefault();
                            trigger();
                    });
                    $(document).on("keydown",function(e){
                            var keycode=e.keyCode
                            if(keycode==13||keycode==32||keycode==38)
                                trigger();
                    });
                }
            }
            needle.css({"top":"480px"});
        },200)
    }
    //开始
        if($.cookie("count")){
            if(confirm("是否继续上次关卡！")){
                count=$.cookie("count");
                customs(count);
            }else{
                customs(count);
            }
        }else{
            customs(count);
        }
})
