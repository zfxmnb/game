(function(){
//禁用鼠标右键菜单
$(document).contextmenu(function(e){
            e.preventDefault();
})
var timeout=null,cancount;
var gradeArr=[[16,16,35],[16,16,45],[16,16,55],[20,20,60],[23,20,90],[26,20,120],[30,25,150],[33,25,180],[36,25,220],[40,25,250],[40,25,280],[40,25,300]];//阵列规模
//关卡初始化
function init(g){
    //cookie获取当前关卡历史分数
    if($.cookie("record"+g)){
        var rtimes=$.cookie("record"+g);
        var rm=parseInt(rtimes/60);
        var rs=rtimes%60;
        rs=rs<10?"0"+rs:rs;
        $(".record span").html(rm+"分 "+rs+"秒");
    }else{
        $(".record span").empty();
    }
    //初始化数据
    var w=gradeArr[g][0],h=gradeArr[g][1],r=gradeArr[g][2],flagCount=0;
	cancount=w*h;
    $(".grade").html("第 "+(g-0+1)+" 关");
	$(".boom").html(" x "+r);
	$(".flag").html(" x "+flagCount);
    var string="";
    for(var i=0;i<w*h;i++){
        string+="<li class='can'></li>";
    }
    string+="<div class='gmaeover'><div class='bg'></div><div class='tip'>GAME OVER</div></div>"
    $(".con").css({"width":w*20+"px","height":h*20+"px"}).html(string);
    //生成一个二维数组
    arr=new Array(h);
    for(var i=0;i<h;i++){
        arr[i]=new Array(w);
        for(var j=0;j<w;j++){
            arr[i][j]=[null,0];
        }
    }
    //生成一个完整的地雷阵
    arr=build(arr,r);
    for(var i=0;i<h;i++){
        for(var j=0;j<w;j++){
            if(arr[i][j][0]==-1){
                newArr(arr,i,j,w,h);
            }
        }
    }
    //计时
    var times=0;
    function countTime(){
        var m=parseInt(times/60);
        var s=times%60;
        s=s<10?"0"+s:s;
        $(".time span").html(m+"分 "+s+"秒");
    }
    countTime()
    timeout=setInterval(function(){
        times++;
        countTime();
    },1000);
    //点击事件
    $(".con li").off("mousedown").on("mousedown",function(e){
        var v=$(this).index(".con li");
        var x=parseInt(v/w),y=v%w;
        if(arr[x][y][1]<2)
            if(e.which==1&&arr[x][y][1]!=1){//左键扫雷
                if(arr[x][y][0]==null){
    				arr[x][y][1]=2;
    				cancount--;
                    continuity(x,y,[JSON.stringify([x,y])],arr);
                    $(this).addClass("null");
                    $(this).removeClass("can");
                    if(!(cancount>r)){
                        $(".gmaeover .tip").html("恭喜过关了！")
                        $(".gmaeover").fadeIn(300);
                        clearInterval(timeout);
                        if($.cookie("record"+g)){
                            if(times<$.cookie("record"+g)){
                                $.cookie("record"+g,times,{"expires":365});
                            }
                        }else{
                            $.cookie("record"+g,times,{"expires":365});
                        }
                    }
                }else if(arr[x][y][0]>0){
                    $(this).html(arr[x][y][0]);
                    $(this).addClass("num"+arr[x][y][0]).removeClass("can");
    				cancount--;
    				arr[x][y][1]=2;
                    if(!(cancount>r)){
                        $(".gmaeover .tip").html("恭喜过关了！");
                        $(".gmaeover").fadeIn(300);
                        clearInterval(timeout);
                         if($.cookie("record"+g)){
                            if(times<$.cookie("record"+g)){
                                $.cookie("record"+g,times,{"expires":365});
                            }
                        }else{
                            $.cookie("record"+g,times,{"expires":365});
                        }
                    }
                }else if(arr[x][y][0]==-1){
                    $(this).addClass("fa fa-certificate");
                    $(".con li").removeClass("can");
                    $(".gmaeover").fadeIn(300);
                     clearInterval(timeout);
                }
            }else if(e.which==3){//右键插旗
                if($(this).hasClass("doubt")&&arr[x][y][1]==1){
                    $(this).removeClass("fa fa-flag doubt");
        		    arr[x][y][1]=0;
        		    flagCount--;
    	            $(".flag").html(" x "+flagCount);
                }else{
                    $(this).addClass("fa fa-flag doubt");
        		    arr[x][y][1]=1;
        		    flagCount++;
                    $(".flag").html(" x "+flagCount);
                }
            }
    })
}
//每个雷点四周生成数字
function newArr(arr,i,j,w){
    for(var n=0;n<3;n++){
        for(var m=0;m<3;m++){
            var x1=i-1+n,x2=j-1+m;
            if(!(m==1&&n==1)&&arr[x1]&&arr[x1][x2]&&arr[x1][x2][0]===null){
                var num=0;
                for(var p=0;p<3;p++){
                    for(var q=0;q<3;q++){
                         num-=(arr[x1-1+p]&&arr[x1-1+p][x2-1+q]&&arr[x1-1+p][x2-1+q][0]==-1)?arr[x1-1+p][x2-1+q][0]:0;
                    }
                }
                arr[x1][x2][0]=num;
            }
        }
    }
	return arr;
}
//给数组添加随机的雷
function build(arr,l){
    var i=0;
    var arrx=arr.length,arry=arr[0].length;
    while(i<l){
       var t=parseInt(Math.random()*(arrx*arry-i))+1,x=0;
        for(var j=0;j<arrx;j++){
            for(var k=0;k<arry;k++){
		if(arr[j][k][0]!=-1){
			x++;
			if(t==x){
				i++;
				arr[j][k][0]=-1;
				break;
			}
		}
            }
        }
    }
	return arr;
}
//递归方法进行扫雷，把相连的无雷区域扫出
function continuity(i,j,a,arr){//(x,y,扫过的空白区域坐标，雷阵数组)
    for(var n=0;n<3;n++){
		for(var k=0;k<3;k++){
			if(!(n==1&&k==1)&&arr[i-1+n]&&arr[i-1+n][j-1+k]){
				var ele=$(".con li:eq("+((i-1+n)*arr[0].length+(j-1+k))+")");
				 if(arr[i-1+n][j-1+k][0]===null&&a.indexOf(JSON.stringify([(i-1+n),(j-1+k)]))==-1){
					if(!arr[i-1+n][j-1+k][1]==1){
						ele.addClass("null").removeClass("can");
						cancount--;
						arr[i-1+n][j-1+k][1]=2;
						a.push(JSON.stringify([(i-1+n),j-1+k]));
						a=arguments.callee((i-1+n),j-1+k,a,arr);
					}
				 }else if(arr[i-1+n][j-1+k][0]>0){
					if(!arr[i-1+n][j-1+k][1]==1){
						ele.removeClass("can").addClass("num"+arr[i-1+n][j-1+k][0]);
						ele.html(arr[i-1+n][j-1+k][0])
						cancount--;
						arr[i-1+n][j-1+k][1]=2;
					}
				 }
			 }
		}
    }
    return a;
}

var s="";
for(var i=0;i<gradeArr.length;i++){
    s+="<option value="+i+">第 "+(i+1)+" 关</option>";
}
//选择不同难度的关卡
$("#selectGrade").append(s).change(function(){
    var ele=$(this);
    $(this).find("#default").remove();
    $(".con").html("");
    setTimeout(function(){
        clearInterval(timeout);
        init(ele.val());
    },0)
    $(".reset").off("click").on("click",function(){
        clearInterval(timeout);
        init(ele.val());
    })
})
})();
