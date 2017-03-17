(function(){
var isTouch="ontouchstart" in document?true:false
function init(s,ht){
    initarr();
   valiarr();
   var arrs=resultArr(s);
   var aB=arrs[0],aR=arrs[1],aC=arrs[2];
    build(aB);
    $(".result").off("click");
	$(".result").on("click",function(){
        if(confirm("你确定不要再尝试一下吗？")){
            clearInterval(nt);
			$(".result").off("click");
            build(arrB);
        }   
    });
    if($.cookie("history"+s)){
        var history=$.cookie("history"+s);
        $(".time .history").html(ht+"纪录:  "+parseInt(history/60)+"<small>分 </small>"+((history%60<10)?("0"+history%60):history%60)+"<small>秒</small>");
    }else{
        $(".time .history").html(ht+"纪录:  <span>0<small>分 </small>00<small>秒</small></span>")
    }
    var time=0;
    $(".time .now").html("用时:  <span>"+parseInt(time/60)+"<small>分 </small>"+((time%60<10)?("0"+time%60):time%60)+"<small>秒</small></span>");
    clearInterval(nt);
    nt=setInterval(function(){
        time++;
        $(".time .now").html("用时:  <span>"+parseInt(time/60)+"<small>分 </small>"+((time%60<10)?("0"+time%60):time%60)+"<small>秒</small></span>");
        if(time/60>120){
            clearInterval(nt);
            build(arrB);
        }
    },1000);
    function input(){
        setTimeout(function(){
                    var input=$("#input"),val=input.val()-0,el=$(".container li.canChange.selected");
                    if(typeof(val)=="number"&&val>-1&&val<10){
                        var i=$(".container ul").index(el.parent()),j=el.parent().find("li").index(el);
                        if(val==0){
                            val="";
                            clear("",i,j,aB,aR,aC);
							el.removeClass("confirm");
                        }
                        el.html(val);
						el.removeClass("selected");
                        input.val(""); 
                        compose(val,i,j,aB,aR,aC);
						$(".container li.canChange").removeClass("error");
						var v=true;
						for(var i=0;i<9;i++){
							for(var j=0;j<9;j++){
								if(!aB[i][j]>0){
									var value=parseInt($(".container li").eq(i*9+j).html())||"";
								   if(value!=""){
										if(compose(value,i,j,aB,aR,aC)){
											$(".container li").eq(i*9+j).removeClass("error");
										}else{
											$(".container li").eq(i*9+j).addClass("error");
										}
								   }
							   }
							}
						}
						for(var i=0;i<9;i++){
							for(var j=0;j<9;j++){
								if(!aB[i][j]>0){
									v=false;
									break;
								}
							}
							if(!v){
								break;
							}
						}
						if(v){
							clearInterval(nt);
							$(".container li.canChange").off("click");
							$(".result").off("click");
							if($.cookie("history"+s)){
								if(time<$.cookie("history"+s)){
									$.cookie("history"+s,time,{expires:365});
									alert("你已经打破了自己的"+ht+"记录!")
								}else{
									alert("恭喜！你再次成功解开了数独");
								}
							}else{
								$.cookie("history"+s,time,{expires:365});
								alert("恭喜！你第一次成功解开了数独");
							}
						}
                    }else{
                        input.val("");
                    }
                },30);
    }
	if(!isTouch){
		$(".con label").attr("for","input");
	}
   $(".container li.fixed").on("click",function(){
		$(".container li").removeClass("selected");
   })
   $(".container li.canChange").on("click",function(){
		if($(this).hasClass("selected")){
			if($(this).hasClass("confirm")){
				$(this).removeClass("confirm");
			}else{
				$(this).addClass("confirm");
			}
		}else{
			$(this).removeClass("confirm");
		}
   
        $(".container li").removeClass("selected");
        $(this).addClass("selected");
        $("#input").on("focus",function(){
          $(document).off("keydown");
          $(document).on("keydown",function(){
				if($(".container li.canChange.selected").length>0){
					input();
				}else{
					$("#input").val("");
				}
                
            });
        });
		if($(".inputButton ul li.curr").length>0){
			if($(".inputButton ul li.curr").hasClass('clear')){
				$("#input").val("");
			}else{
				$("#input").val($(".inputButton ul li.curr").html());
			}
			$(".inputButton ul li").removeClass("curr");
			input();
		}
   });
   $(".inputButton ul li").off("click");
   $(".inputButton ul li").on("click",function(){
		if(!$(this).hasClass("curr")){
			$(".inputButton ul li").removeClass("curr");
			$(this).addClass("curr");
		}else{
			$(this).removeClass("curr");
		}
		
		if($(".container li.canChange.selected").length>0){
			if($(this).hasClass('clear')){
				$("#input").val("");
			}else{
				$("#input").val($(this).html());
			}
			$(this).removeClass("curr");
			input();
		}
			
    })
}
function build(arr){
    var string="";
    for(var i=0;i<9;i++){
        string+="<ul>";
        for(var j=0;j<9;j++){
                if(arr[i][j]==undefined||arr[i][j]==""){
                    arr[i][j]="";
                    string+="<li class='canChange'>"+arr[i][j]+"</li>";
                }else{
                    string+="<li class='fixed'>"+arr[i][j]+"</li>";
                }
                
        }
        string+="</ul>";
    }
   document.getElementsByClassName('container')[0].innerHTML=string;
}
function resultArr(xc){
    var aB=new Array(9);
    var aR=new Array(9);
    var aC=new Array(9);
    
    for(var i=0;i<9;i++){
        aB[i]=new Array(9);
        aR[i]=new Array(9);
        aC[i]=new Array(9);
    }
    for(var i=0;i<9;i++){
		if(xc==1)
			var s=5+(parseInt(Math.random()*3)-1);
		else if(xc==2)
			var s=4+(parseInt(Math.random()*3)-1);
		else if(xc==3)
			var s=2+(parseInt(Math.random()*3)-1);
			
        var v=9;
        for(var k=0;k<s;k++) {
            var t=0;
            var j=parseInt(Math.random()*v)+1;
            for(var x=0;x<9;x++){
                if(!aB[i][x]>0){
                    t++;
                }
                if(t==j){
                    var Rx=parseInt(i/3)*3+parseInt(x/3),Ry=(i%3)*3+(x%3),Cx=Ry,Cy=Rx;
                    aB[i][x]=arrB[i][x];
                    aR[Rx][Ry]=arrB[i][x];
                    aC[Cx][Cy]=arrB[i][x];
                     v--;
                     break;
                }
            }
        }
    }
    var arrs=[];
    arrs.push(aB);
    arrs.push(aR);
    arrs.push(aC);
    return arrs;
}
function initarr(){
        arrR=new Array(9);
        arrC=new Array(9);
        arrB=new Array(9);
        for(var i=0;i<9;i++){
            arrR[i]=new Array(9);
            arrC[i]=new Array(9);
            arrB[i]=new Array(9);
        }
}
function valiarr(){
    if(!algorithm(1,0,[],[])){
        initarr();
        arguments.callee();
    }
}

function algorithm(da,x,a,A){
    if(10-da-a.length>0){
        var r=parseInt(Math.random()*(10-da-a.length)),R=0;
        for(var i=0;i<9;i++){
            if(arrB[x][i]==da){
               clear("",x,i,arrB,arrR,arrC);
            }
        }
        for(var i=0;i<9;i++){
            if(!arrB[x][i]>0&&a.indexOf(i)==-1){
                if(r==R){
                    if(compose(da,x,i,arrB,arrR,arrC)){
                        a.push(i);
                        A.push(a);
                        if(x==8){
                            if(da==9){
                                return true;
                            }else{
                                da++;
                                x=0;
                                return arguments.callee(da,x,[],A);
                            }
                        }else{
                            x++;
                            return arguments.callee(da,x,[],A);
                        }    
                    }else{
                        a.push(i);
                       return arguments.callee(da,x,a,A);
                    }
                }
                R++;
            }
        }  
    }else{
        if(x==0){
            da--;
            x=8;
        }else{
            x--;
        }
        a=A.pop();
        return arguments.callee(da,x,a,A);
    }
}
function clear(d,i,j,aB,aR,aC){
            var Rx=parseInt(i/3)*3+parseInt(j/3),Ry=(i%3)*3+(j%3),Cx=Ry,Cy=Rx;
            aB[i][j]=d;
            aR[Rx][Ry]=d;
            aC[Cx][Cy]=d;
            return;
}
function compose(d,i,j,aB,aR,aC){
    var Rx=parseInt(i/3)*3+parseInt(j/3),Ry=(i%3)*3+(j%3),Cx=Ry,Cy=Rx;
    aB[i][j]="";
    aR[Rx][Ry]="";
    aC[Cx][Cy]="";
    if(vali(aB,i,j,d)&&vali(aR,Rx,Ry,d)&&vali(aC,Cx,Cy,d)){
            aB[i][j]=d;
            aR[Rx][Ry]=d;
            aC[Cx][Cy]=d;
            return true;
    }else{
        return false;
    }
}
function vali(arr,x,y,d){
    var r=true,index=arr[x].indexOf(d);
     if(index>-1){
        r=false;
    }
    return r;
}

    var arrR,arrC,arrB,ax,nt;
    $(".options button").on("click",function(){
        $(".options button").removeClass("curr");
        $(this).addClass("curr");
        if($(this).data("val"))
            init($(this).data("val"),$(this).html())
    });
	
})();
