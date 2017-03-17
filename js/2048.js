
    $(function(){
        var list,
	        listDiv,
	        arr,
	        hScore=0,
	        nScore=0,
	        oCount=0,
	        liCon=$(".li_con"),
	        container=$(".container"),
	        reset=$(".reset");
	     //从cookie获取最高分记录
        if($.cookie("hScore")){
            hScore=$.cookie("hScore");
        }
        //初始化
        var init=function(n){
            var s="";
            for(var i=0;i<n*n;i++){
                s+="<li><div class='hide'></div></li>";
            }
            $(".li_con").html(s);
        	//生成所需的HTML机构
            list=$(".li_con li"),listDiv=$(".li_con li div");
            arr=[],oCount=0;
            for(var i=0;i<n;i++){
                arr[i]=[];
               for(var j=0;j<n;j++){
                    arr[i].push(0);
                    listDiv.eq(i*4+j).css({"top":i*80+1.5+"px","left":j*80+1.5+"px"});
               }
            }
            //空白位置随机生成数字块
            random(n,2);
            //绑定事件
			bind();
        }
        var random=function(n,r){
            for(var i=0;i<r;i++){
                var hlistDiv=$(".li_con li div.hide"),hlistDivL=hlistDiv.length;
                if(hlistDivL>0){
                    var x=parseInt(Math.random()*hlistDivL);
                    var num=parseInt(Math.random()*2+1)*2;
                    hlistDiv.eq(x).removeClass("hide").addClass("rT").addClass("show").addClass("x"+num).html(num);
                    var s=hlistDiv.eq(x).parent().index(".li_con li");
                    arr[parseInt(s/n)][s%n]=num;
                    check(arr);
                }
            }
        }
        //过渡动画
        var animate=function(reverse,n,i,j,l){
            switch (reverse){
                case "left":
                    listDiv.eq(i*n+j).css({"left":l*80+1.5+"px"});
                    break;
                case "right":
                    listDiv.eq(i*n+j).css({"left":(n-l-1)*80+1.5+"px"});
                    break;
                case "top":
                    listDiv.eq(j*n+i).css({"top":l*80+1.5+"px"});
                    break;
                case "bottom":
                    listDiv.eq(j*n+i).css({"top":(n-l-1)*80+1.5+"px"});
                    break;
            }
        }
        //操作执行事件
        var left=function(n){
            cloneArr=clone(arr);
            var sumTempArr=[];//一个朝一个方向滑动生成的新数组
            for(var i=0;i<n;i++){
                var tempArr=[],x=0;
                for(var j=0;j<n;j++){
                    if(arr[i][j]!=0){
                        animate("left",n,i,j,tempArr.length);
                        tempArr.push(arr[i][j])
                        x++;
                    }
                }
                sumTempArr.push(algorithm(tempArr));
            }
            setTimeout(function(){
                liCon.removeClass("transition");
                for(var i=0;i<n;i++){
                    for(var j=0;j<n;j++){
                        if(sumTempArr[i][j])
                            arr[i][j]=sumTempArr[i][j];
                        else
                            arr[i][j]=0;
                        refresh(i,j);
                    }
                }
                if(cloneArr.toString()!=arr.toString()){
                    random(4,1)
                }
				unbind()
                bind();
            },300)
        }
        var right=function(n){
            cloneArr=clone(arr);
            var sumTempArr=[];
            for(var i=0;i<n;i++){
                var tempArr=[],x=0;
                for(var j=n-1;j>-1;j--){
                    if(arr[i][j]!=0){
                        animate("right",n,i,j,tempArr.length);
                        tempArr.push(arr[i][j])
                    }
                }
                sumTempArr.push(algorithm(tempArr));
            }
            setTimeout(function(){
                liCon.removeClass("transition");
                for(var i=0;i<n;i++){
                    for(var j=0;j<n;j++){
                        if(sumTempArr[i][n-1-j])
                            arr[i][j]=sumTempArr[i][n-1-j];
                        else
                            arr[i][j]=0;
                        refresh(i,j);
                    }
                }
                if(cloneArr.toString()!=arr.toString()){
                    random(4,1)
                }
				unbind()
                bind();
            },300)
        }
        var up=function(n){
            cloneArr=clone(arr);
            var sumTempArr=[];
            for(var i=0;i<n;i++){
                var tempArr=[],x=0;
                for(var j=0;j<n;j++){
                    if(arr[j][i]!=0){
                        animate("top",n,i,j,tempArr.length);
                        tempArr.push(arr[j][i]);
                    }
                }
                sumTempArr.push(algorithm(tempArr));
            }
            setTimeout(function(){
                liCon.removeClass("transition");
                for(var i=0;i<n;i++){
                    for(var j=0;j<n;j++){
                        if(sumTempArr[j][i])
                            arr[i][j]=sumTempArr[j][i];
                        else
                            arr[i][j]=0;
                        refresh(i,j);
                    }
                }
                if(cloneArr.toString()!=arr.toString()){
                    random(4,1)
                }
				unbind()
                bind();
            },300)
        }

        var down=function(n){
            cloneArr=clone(arr);
            var sumTempArr=[];
            for(var i=0;i<n;i++){
                var tempArr=[];
                for(j=n-1;j>-1;j--){
                    if(arr[j][i]!=0){
                        animate("bottom",n,i,j,tempArr.length);
                        tempArr.push(arr[j][i])
                    }
                }
                sumTempArr.push(algorithm(tempArr));
            }
            setTimeout(function(){
                liCon.removeClass("transition");
                for(var i=0;i<n;i++){
                    for(var j=0;j<n;j++){
                        if(sumTempArr[j][n-1-i])
                            arr[i][j]=sumTempArr[j][n-1-i];
                        else
                            arr[i][j]=0;
                        refresh(i,j);
                    }
                }
                if(cloneArr.toString()!=arr.toString()){
                    random(4,1)
                }
				unbind()
                bind();
            },300)
        }
        //递归方式处理数之间的合并
        var algorithm=function(a){
            for(var i=1;i<a.length;i++){
                if(a[i-1]==a[i]){
                    a[i-1]=a[i-1]*2;
                    a.splice(i,1);
                    return arguments.callee(a);
                    break;
                }
            }
            if(i==a.length)
                return a;
        }
        //回复滑块位置，刷新滑块内容
        var refresh=function(i,j){
            listDiv.eq(i*4+j).attr("class","").addClass("hide").empty().css({"top":i*80+1.5+"px","left":j*80+1.5+"px"});
            if(arr[i][j]!=0){
                listDiv.eq(i*4+j).html(arr[i][j]).removeClass("hide").addClass("show").addClass("x"+arr[i][j]);
            }
        }
        //克隆数组
        var clone=function(a){
            var clonearr=[];
            for(var i=0;i<a.length;i++){
                clonearr[i]=[];
                for(var j=0;j<a[i].length;j++){
                    clonearr[i].push(arr[i][j]);
                }
            }
            return clonearr;
        }
        //检查分数并保存最新记录
        var check=function(a){
            var s=0;
            for(var i=0;i<a.length;i++){
                for(var j=0;j<a[i].length;j++){
                    s=a[i][j]>s?a[i][j]:s;
                }
            }
            nScore=s;
            if(nScore>hScore){
                hScore=nScore;
                $.cookie("hScore",hScore,{ expires: 365});
				$.cookie("arr",JSON.stringify(arr),{expires:365});
				setTimeout(function(){
					if(hScore==1024){alert("1024分 厉害了word哥！")};
					if(hScore==2048){alert("2048分 你可以上天了，与太阳肩并肩！")};
					if(hScore==4096){alert("4096分 无敌是多么寂寞！")};
					if(hScore==8192){alert("8192分 从此世间留下了你的传说！")};
					if(hScore>16384){alert("16384分 骚年不要玩了赶紧去吹牛B！")};
				},500)
            }else if(oCount>15){
				$.cookie("arr",JSON.stringify(arr),{expires:365});
				oCount=0;
			}
			oCount++;
            $(".hscore span").html(hScore);
            $(".nscore span").html(nScore);
        }
        //绑定事件
        var bind=function(){
             $(document).on("keydown",function(e){
                liCon.addClass("transition");
                unbind();
                if(e.keyCode==37){
                    left(4);
                }else if(e.keyCode==39){
                    right(4);
                }else if(e.keyCode==38){
                    up(4);
                }else if(e.keyCode==40){
                    down(4);
                }
            });
             reset.on("click touch",function(){
                init(4);
             })
            container.on("touchstart",function(event){
                liCon.addClass("transition");
                var sx=event.originalEvent.targetTouches[0].clientX,sy=event.originalEvent.targetTouches[0].clientY; 
                container.on("touchend",function(e){
					unbind();
                    var ex=e.originalEvent.changedTouches[0].clientX,ey=e.originalEvent.changedTouches[0].clientY;
                    var cx=ex-sx,cy=ey-sy;
                    if(Math.abs(cx)>20||Math.abs(cy)>20){
                        if(Math.abs(cx)>Math.abs(cy)){
                            if(cx<0){
                                 left(4);
                            }else{
                                right(4);
                            }
                        }else{
                            if(cy<0){
                                up(4);
                            }else{
                                down(4);
                            }
                        }
                    }else{
						bind();
					}
                });
            });
        }
        //防止未执行完的再次操作处理
        var unbind=function(){
            container.off("touchstart touchend");
            $(document).off("keydown");
            reset.off("click touch");
        }
        //禁用移动端的浏览器滑动默认事件
        $(document).on("touchmove",function(e2){
                 e2.preventDefault();
        });
        //开始
		if($.cookie("arr")){
			if(confirm("是否从上次保存节点开始")){
				arr=JSON.parse($.cookie("arr"));
				var s="";
				for(var i=0;i<16;i++){
					s+="<li><div class='hide'></div></li>";
				}
				$(".li_con").html(s);
				list=$(".li_con li"),listDiv=$(".li_con li div");
				for(var i=0;i<4;i++){
					for(var j=0;j<4;j++){
						refresh(i,j)
					}
				}
				check(arr);
				bind();
			}else{
				init(4);
			}
		}else{
			init(4);
		}
    });
