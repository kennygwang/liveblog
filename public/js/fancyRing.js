
function startFancyRing(){
    var r = $('.menu-ring');
    var N = 12;
    var pieces = new Array(N);
    var width = parseInt(r.width(), 10)/2;
    console.log(width, r)

    r.html("");
    for (var i=0; i<N; i++){
        var x = document.createElement("div");
        x.id = "x" + i;
        x.className = "ringPiece";
        x.style.MozTransform = x.style.webkitTransform = "rotateY("+(360*i/N)+"deg) rotateZ(45deg) translateZ("+width+"px)";
        r.append(x);

        $(x).hide().show(i*200);

        pieces[i] = x;
    }
}

startFancyRing();
