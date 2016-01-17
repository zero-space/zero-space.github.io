function navTab(){
    var nav=getClass(document,'box-prev')[0];
    var navLi=getClass(nav,'link');
    var linkMark=getClass(document,'link-mark')[0];
    var linkMark_index=0;

    for(var i=0;i<navLi.length;i++){
        navLi[i].index=i;
        navLi[i].onmousemove=function(){
            var index=this.index;
            elasticAnimate(linkMark,{left:index*175})
        };

    }
    nav.onmouseleave=function(){
        elasticAnimate(linkMark,{left:linkMark_index*175})
    }
}