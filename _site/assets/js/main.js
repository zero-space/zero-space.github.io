/**
 * Created by Administrator on 2016/6/2 0002.
 */

var isIndex=true;
var onCLickOnOff=true;      //防止过快点击重复提交加一个开关

$(function(){
    //runPage('contact/ajaxMyOpenSoure.html')

    navGoTop();
    $(window).scroll(navGoTop);
    function navGoTop(){
        var _scroll=$(window).scrollTop();
        if(_scroll>10){
            if(isIndex){
                $('.nav-wrap').addClass('goTop-nav');
            }
            $('.nav-wrap').addClass('top');
        }else{
            if(isIndex){
                $('.nav-wrap').removeClass('goTop-nav');
            }
            $('.nav-wrap').removeClass('top');
        }
    }
});
//ajax  请求文章页
function runPage(pageUrl){
    if(pageUrl=="" || onCLickOnOff==false) return ;
    onCLickOnOff=false;

    $.ajax({
        url:pageUrl,
        success:function(res,status){
            if(status == "success"){
                if(isIndex){
                    $('.nav-wrap').addClass('goTop-nav');
                }else{
                    $('.nav-wrap').removeClass('goTop-nav');
                }
                var prevTab=$('.ajax-tab').eq(0);
                prevTab.after("<section class='ajax-tab'></section>");
                var newTab=$('.ajax-tab').eq(1);
                prevTab.animate({left:'50%',top:'50%',width:0,height:0,opacity:0});
                newTab.html(res);
                newTab.css({left:'50%',top:'50%',width:0,height:0,opacity:0});
                newTab.animate({left:0,top:0,width:'100%',height:'100%',opacity:1},function(){
                    setTimeout(function(){
                        prevTab.remove();
                        $('.ajax-tab').css({height:'auto'});
                        onCLickOnOff=true;
                        isIndex?$('.banner').removeClass('small'):$('.banner').addClass('small');
                    },500);
                })
            }
        }
    });
}

//动态效果
//首页
function indexAimate(){
    $('.nav-wrap').css({
        animation:'1s showAnimate'
    });
    $('.repositories-tt').hide();
    $('.repositories-right .list li').css('display','none');
    setTimeout(function(){
        $('.nav-wrap .logo-wrap').css({animation:'0.6s showNav forwards'});

        $('.banner .about-me').css({animation:'1s .8s showMe forwards'});
        for(var i=0;i<$('.nav li').length;i++){
            $('.nav li').eq(i).css({animation:'1s '+(0.5+i/10)+'s showEl forwards'});
        }
        $('.repositories-tt').fadeIn(1000);
    },600);

    setTimeout(function(){
        for(var i=0;i<$('.main-list li').length;i++){
            $('.main-list li').eq(i).css({animation:'1s '+(0.6+i*0.1)+'s listEl forwards'})
        }
    },1000);

    //右侧列表
    setTimeout(function(){
        $('.repositories-right .list li').css('display','block');
        for(var i=0;i<$('.repositories-right .list li').length;i++){
            $('.repositories-right .list li').eq(i).css({animation:'1s '+(0.8+i*0.1)+'s listEl2 forwards'});
            $('.repositories-right .list li').eq(i).get(0).addEventListener("webkitAnimationEnd", function(){ //动画结束时事件
                $(this).css({opacity:1});
                $(this).css({animation:'none'});
            }, false);
        }
    },1500);


    $('.tab_body').eq(0).css({
        minHeight:$(window).height()-85,
        'background':'#eee'
    })
}


//ajaxBolg
function articleListAimate(){
    setTimeout(function(){
        for(var i=0;i<$('.article-list li').length;i++){
            $('.article-list li').eq(i).css({animation:'1s '+(0.6+i*0.1)+'s listEl forwards'})
        }
        $('.article-list li').eq($('.article-list li').length-1).get(0).addEventListener("webkitAnimationEnd", function(){
            $('.article-list li').css('opacity','1');
            $('.article-list li').css({animation:'none'})
        });
        $('.time-line .timeYear').css({
            'transform':'scale(1)',
            opacity:1
        });
        $('.time-line .line').animate({opacity:1},2000);
    },1000);
}


//ajaxIndex
function ajaxIndex(){
    $('.nav-wrap').css({
        animation:'1s showAnimate'
    });
    $('.repositories-tt').hide();
    $('.repositories-right .list li').css('display','none');
    setTimeout(function(){
        $('.nav-wrap .logo-wrap').css({animation:'0.6s showNav forwards'});

        $('.banner .about-me').css({animation:'1s .8s showMe forwards'});
        for(var i=0;i<$('.nav li').length;i++){
            $('.nav li').eq(i).css({animation:'1s '+(0.5+i/10)+'s showEl forwards'});
        }
        $('.repositories-tt').fadeIn(1000);
    },600);

    setTimeout(function(){
        for(var i=0;i<$('.main-list li').length;i++){
            $('.main-list li').eq(i).css({animation:'1s '+(0.6+i*0.1)+'s listEl forwards'})
        }
    },1000);

    //右侧列表
    setTimeout(function(){
        $('.repositories-right .list li').css('display','block');
        for(var i=0;i<$('.repositories-right .list li').length;i++){
            $('.repositories-right .list li').eq(i).css({animation:'1s '+(0.8+i*0.1)+'s listEl2 forwards'});
            $('.repositories-right .list li').eq(i).get(0).addEventListener("webkitAnimationEnd", function(){ //动画结束时事件
                $(this).css({opacity:1});
                $(this).css({animation:'none'});
            }, false);
        }
    },1500);
}


//ajaxSource
function ajaxSource(){
    $('.myOpen-list li').css({display:'none'});
    setTimeout(function(){
        $('.myOpen-list li').css({display:'block'});
        for(var i=0;i<$('.myOpen-list li').length;i++){
            $('.myOpen-list li').eq(i).css({animation:'1s '+(0.6+i*0.1)+'s listEl2'});
            $('.myOpen-list li').eq(i).get(0).addEventListener("webkitAnimationEnd", function(){ //动画结束时事件
                $('.myOpen-list li').css({opacity:1});
                $('.myOpen-list li').css({animation:'none'});
            }, false);
            $('.myOpen-list li').eq(i).get(0).addEventListener("animationend", function(){ //动画结束时事件
                $('.myOpen-list li').css({opacity:1});
                $('.myOpen-list li').css({animation:'none'});
            }, false);
        }
    },1000);
}



