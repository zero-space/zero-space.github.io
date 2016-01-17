(function(doc,win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
//支持DOMContentLoaded事件的,使用DOMContentLoaded事件
//不支持的,就使用来自Diego Perini发现的著名Hack兼容.兼容原理大概就是通过IE
//的document.documentElement.doScroll('left')来判断DOM树是否创建完毕
//document.ready实现
function dmReady(fn){
    // 对于现代浏览器,对于DOMContentLoaded事件的处理采用标准的时间绑定方式
    if(document.addEventListener){
        document.addEventListener("DOMContentLoaded",fn,false);
    }else {
        IEContentLoaded(fn);
    }
    //IE模拟DOMContentLoaded
    function IEContentLoaded(fn){
        var d=window.document;
        var done=false;
        //只执行一次用户回调函数init();
        var init=function(){
            if(!done){
                done=true;
                fn();
            }
        };
        (function(){
            try{
                //DOM树为创建完之前调用doScroll会抛出异常
                d.documentElement.doScroll('left');
            }catch(e){
                //延迟在试一次
                setTimeout(arguments.callee,50);
                return;
            }
            //没有错误就表示DOM数创建完毕，然后立马执行回调
            init();
        })();

        //监听document的加载状态
        d.onreadystatechange=function(){
            //如果用户是在domReay之后绑定的函数,就立马执行
            if(d.readyState=='complete'){
                d.onreadystatechange=null;
                init();
            }
        }
    }
}

// 通过class获取元素
function getClass(obj,className){
    var aEls=obj.getElementsByTagName('*');
    var arr=[];

    for(var i=0;i<aEls.length;i++){
        var setClass=aEls[i].className.split(' ');
        for(var j=0;j<setClass.length;j++){
            if(setClass[j]==className){
                arr.push(aEls[i]);
                break;
            }
        }
    }
    return arr;
}

//获取ID
function getId(obj) {
    return document.getElementById(obj);
}

//获取屏幕的宽高
function view() {
    return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
    };
}

//添加class
function adClass(obj, sClass) {
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' +sClass;
}

//删除class
function removeClass(objs,sClass){
    if(!objs.length){
        rm(objs)
    }else{
        for(var i=0;i<objs.length;i++){
            rm(objs[i]);
        }
    }
    function rm(obj){
        var aClass = obj.className.split(' ');
        if (!obj.className) return;
        for (var i = 0; i < aClass.length; i++) {
            if (aClass[i] === sClass) {
                aClass.splice(i, 1);
                obj.className = aClass.join(' ');
                break;
            }
        }
    }
}
//事件绑定
function bindEvn(obj,evname,fn){
    if(obj.addEventListener){
        obj.addEventListener(evname,fn,false);
        return;
    }
    obj.attachEvent('on' + evname, function(){
        fn.call(obj)
    });
}

//继承
function fnExtend(obj1,obj2){
    for(var attr in obj2){
        obj1[attr]=obj2[attr];
    }
}

/*判断是否是标签节点*/
function isElement(el){
    return !!el &&el.nodeType===1;
}
/*绝对坐标获取*/
function getPos(obj){
    var pos={left:0,top:0};

    while(obj){
        pos.left+=obj.offsetLeft;
        pos.top+=obj.offsetTop;
        obj=obj.offsetParent
    }
    return pos;
}
/*判断是否有class*/
function hasCls(obj,str){
    var zClass=obj.className.split(' ');
    for(var i=0;i<zClass.length;i++){
        if(zClass[i]===str){
            return true;
        }
    }
    return false;
}
/*获取样式*/
function getStyle(obj,attr){
    if(obj.currentStyle){
        return obj.constructor[attr];
    }else{
        return getComputedStyle(obj,false)[attr];
    }
}
//获取自定义属性
function getSettings(obj,str){
    var setting=obj.getAttribute(str);
    if(setting&&setting!=""){
        var re=/\n|\s/g;
        var re2=/'/g;
        var str=setting.replace(re,'');
        str=str.replace(re2,'"');
        return JSON.parse(str);
    }
    return {};
}

/*
 缓冲运动
 var 速度 = (目标点 - 当前值)/系数;
 速度取整
 */
function rubAnimate(obj,josn,fn){
    clearInterval(obj.iTimer);
    var iCur=0;
    var iSpeed=0;
    obj.iTimer=setInterval(function(){
        var iBtn=true;
        for(var attr in josn){
            var iTarget=josn[attr];
            iCur=attr=='opacity'?Math.round(getStyle(obj,'opacity')*100):parseInt(getStyle(obj,attr));
            iSpeed=(iTarget-iCur)/8;
            iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
            if(iCur!=iTarget){
                iBtn=false;
                if(attr=='opacity'){
                    obj.style.opacity=(iCur+iSpeed)/100;
                    obj.style.filter='alpha(opacity='+(iCur+iSpeed)+')';
                }else{
                    obj.style[attr]=iCur+iSpeed+'px';
                }
            }
        }
        if(iBtn){
            clearInterval(obj.iTimer);
            fn&&fn.call(obj);
        }
    },30);
}
/*
 弹性:
 速度 += (目标点 - 当前值)/系数;  //6 , 7 , 8
 速度 *= 摩擦系数;   // 0.7 0.75
 */
function elasticAnimate(obj,json,fn,ispped,tension){
    clearInterval(obj.timer);
    var json2=copy(json);
    var iSpped= ispped || 8;
    var tension= tension || 0.75;
    obj.timer=setInterval(function(){
        var bStop=true;
        for(var attr in json){
            var iCur= attr=='opacity'?Math.round(getStyle(obj,'opacity')*100):parseInt(getStyle(obj,attr));
            json2[attr] += (json[attr]-iCur)/iSpped;
            json2[attr] *=tension;
            if(Math.abs(json2[attr])<=1 && Math.abs(json[attr]-iCur)<=1){
                if(attr=='opacity'){
                    obj.style.opacity=json[attr]/100;
                    obj.style.filter='alpha(opacity='+json[attr]+')';
                }else{
                    obj.style[attr]=json[attr]+'px';
                }
            }else{
                bStop=false;
                if(attr=='opacity'){
                    obj.style.opacity=(json2[attr]+iCur)/100;
                    obj.style.filter='alpha(opacity='+(json2[attr]+iCur)+')';
                }else{
                    obj.style[attr]=json2[attr]+iCur+'px';
                }
            }
        }
        if(bStop){
            clearInterval(obj.timer);
            fn && fn.call(obj);
        }
    },30);
    function copy( obj ){
        var o = {};
        for(var i in obj ){
            o[i] = 0;
        }
        return o;
    }
}
/*
 时间版运动框架
 t：current  time（当前时间）
 b：beginning  value（初始值）
 c： change  in  value（变化量）
 d：duration（持续时间）
 return  （目标点）

 linear         匀速
 easeIn         加速曲线
 easeOut        减速曲线
 easeBoth       加速减速曲线
 easeInStrong   加加速曲线
 easeOutStrong  加加速减减速曲线
 elasticIn      正弦衰减曲线（弹动渐入）
 elasticOut     正弦增强曲线（弹动渐出）
 elasticBoth
 backIn         回退加速（回退渐入）
 backOut        回缩的距离
 bounceIn       弹球减振（弹球渐出）
 bounceOut
 bounceBoth
 */
/**
 *
 * @param obj   运动对象
 * @param json  运动属性键值对
 * @param times 运动时间
 * @param fx
 * @param fn
 */
function timeMove(obj,json,times,fx,fn){
    if(typeof times=='undefined'){
        times=400;
        fx='linear';
    }

    if(typeof timse== 'string'){
        if(typeof fx== 'function'){
            fn=fx;
        }
        fx=times;
        times=400;
    }else if(typeof times =='number'){
        if(typeof fx=='function'){
            fn=fx;
            fx='linear';
        }else if( typeof fx=='undefined'){
            fx='linear';
        }
    }

    var iCur={};
    for(var attr in json){
        iCur[attr]=0;
        if(attr=='opacity'){
            iCur[attr] = Math.round(getStyle(obj,'opacity')*100);
        }else{
            iCur[attr] = parseInt(getStyle(obj,attr));
        }
    }

    var starTimer=nowTime();

    clearInterval(obj.timer);

    obj.timer=setInterval(function(){

        var channgeTime=nowTime();

        var t= times- Math.max(0,starTimer-channgeTime+times);

        for(var attr in json){

            var value=Tween[fx](t,iCur[attr],json[attr]-iCur[attr],times);

            document.title=value;

            if(attr=='opacity'){
                obj.style.opacity=value/100;
                obj.style.filter='alpha(opacity='+value+')';
            }else{
                obj.style[attr]=value+'px';
            }
        }
        if(t == times){
            clearInterval(obj.timer)
            fn && fn();
        }
    },13)
}

function nowTime(){
    return (new Date()).getTime();
}

/*运动方式*/
var Tween = {
    linear: function (t, b, c, d){  //匀速
        return c*t/d + b;
    },
    easeIn: function(t, b, c, d){  //加速曲线
        return c*(t/=d)*t + b;
    },
    easeOut: function(t, b, c, d){  //减速曲线
        return -c *(t/=d)*(t-2) + b;
    },
    easeBoth: function(t, b, c, d){  //加速减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInStrong: function(t, b, c, d){  //加加速曲线
        return c*(t/=d)*t*t*t + b;
    },
    easeOutStrong: function(t, b, c, d){  //减减速曲线
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p/4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    elasticBoth: function(t, b, c, d, a, p){
        if (t === 0) {
            return b;
        }
        if ( (t /= d/2) == 2 ) {
            return b+c;
        }
        if (!p) {
            p = d*(0.3*1.5);
        }
        if ( !a || a < Math.abs(c) ) {
            a = c;
            var s = p/4;
        }
        else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        if (t < 1) {
            return - 0.5*(a*Math.pow(2,10*(t-=1)) *
                Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
        return a*Math.pow(2,-10*(t-=1)) *
            Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
    },
    backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    backOut: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 3.70158;  //回缩的距离
        }
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    backBoth: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
        return c - Tween['bounceOut'](d-t, 0, c, d) + b;
    },
    bounceOut: function(t, b, c, d){
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
        }
        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
    },
    bounceBoth: function(t, b, c, d){
        if (t < d/2) {
            return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
    }
};