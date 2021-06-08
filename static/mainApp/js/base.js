var flag = false;
var navi = document.querySelectorAll('.navigation .menu-li li');
if(window.outerWidth >= 1080){
    for (var i = 0; i < navi.length; i++) {
        if (i != 0) {
            navi[i].style = "display:unset;position: relative;height: 100%;"
        }
    }
}else{
    for (var i = 0; i < navi.length; i++) {
        if (i != 0) {
            navi[i].style = "display:none;position: relative;height: 100%;"
        }
    }
}


document.getElementById('open').addEventListener('click', () => {
    navi_open_and_close()
});


window.addEventListener('resize', (ev) => {
    var a =document.querySelectorAll('.navigation .menu-li li a');
    if (window.outerWidth >= 1080) {
        for (var i = 0; i < navi.length; i++) {
            if (i != 0) {
                navi[i].style = "display:unset;position: relative;height: 100%;"
            }
        }
    }else{
        for (var i = 0; i < navi.length; i++) {
            if (i != 0) {
                navi[i].style = "display:none;position: relative;height: 100%;"
            }
        }
    }
})

function navi_open_and_close() {
    var navi = document.querySelectorAll('.navigation .menu-li li');
    // console.log(flag)
    for (var i = 0; i < navi.length; i++) {
        if (i != 0) {
            if (flag === true) {
                navi[i].style = "display:none;";
            } else if(flag === false) {
                navi[i].style = "display:flex;"
            }
        }
    }
    if (flag === true) {
        flag = false;
    } else if(flag === false) {
        flag = true;
        console.log(flag)
    }
}