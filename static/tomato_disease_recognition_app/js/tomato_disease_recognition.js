document.documentElement.scrollTop = 0;


if(document.body.clientWidth <= 1050){
    document.body.style.overflow = 'scroll';
}
else{
    document.documentElement.scrollTop = 0;
    document.body.style.overflow = 'hidden';
}



window.addEventListener('resize',(ev)=>{
    if(document.body.clientWidth <= 1050){
        document.body.style.overflow = 'scroll';
    }
    else if(document.body.clientWidth >= 1050){
        document.documentElement.scrollTop = 0;
        document.body.style.overflow = 'hidden';
    }

    let past_img = document.querySelector('#prediction-box>img');
    if (past_img != null) {
        document.body.style.overflow = 'scroll';
    }
})
// spinner
console.log("spin.js");
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var defaults = {
    lines: 12,
    length: 7,
    width: 5,
    radius: 10,
    scale: 1.0,
    corners: 1,
    color: '#000',
    fadeColor: 'transparent',
    animation: 'spinner-line-fade-default',
    rotate: 0,
    direction: 1,
    speed: 1,
    zIndex: 2e9,
    className: 'spinner',
    top: '50%',
    left: '50%',
    shadow: '0 0 1px transparent',
    position: 'absolute',
};
var Spinner = /** @class */ (function () {
    function Spinner(opts) {
        if (opts === void 0) { opts = {}; }
        this.opts = __assign(__assign({}, defaults), opts);
    }
    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target by calling
     * stop() internally.
     */
    Spinner.prototype.spin = function (target) {
        this.stop();
        this.el = document.createElement('div');
        this.el.className = this.opts.className;
        this.el.setAttribute('role', 'progressbar');
        css(this.el, {
            position: this.opts.position,
            width: 0,
            zIndex: this.opts.zIndex,
            left: this.opts.left,
            top: this.opts.top,
            transform: "scale(" + this.opts.scale + ")",
        });
        if (target) {
            target.insertBefore(this.el, target.firstChild || null);
        }
        drawLines(this.el, this.opts);
        return this;
    };
    /**
     * Stops and removes the Spinner.
     * Stopped spinners may be reused by calling spin() again.
     */
    Spinner.prototype.stop = function () {
        if (this.el) {
            if (typeof requestAnimationFrame !== 'undefined') {
                cancelAnimationFrame(this.animateId);
            }
            else {
                clearTimeout(this.animateId);
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
            this.el = undefined;
        }
        return this;
    };
    return Spinner;
}());

/**
 * Sets multiple style properties at once.
 */
function css(el, props) {
    for (var prop in props) {
        el.style[prop] = props[prop];
    }
    return el;
}
/**
 * Returns the line color from the given string or array.
 */
function getColor(color, idx) {
    return typeof color == 'string' ? color : color[idx % color.length];
}
/**
 * Internal method that draws the individual lines.
 */
function drawLines(el, opts) {
    var borderRadius = (Math.round(opts.corners * opts.width * 500) / 1000) + 'px';
    var shadow = 'none';
    if (opts.shadow === true) {
        shadow = '0 2px 4px #000'; // default shadow
    }
    else if (typeof opts.shadow === 'string') {
        shadow = opts.shadow;
    }
    var shadows = parseBoxShadow(shadow);
    for (var i = 0; i < opts.lines; i++) {
        var degrees = ~~(360 / opts.lines * i + opts.rotate);
        var backgroundLine = css(document.createElement('div'), {
            position: 'absolute',
            top: -opts.width / 2 + "px",
            width: (opts.length + opts.width) + 'px',
            height: opts.width + 'px',
            background: getColor(opts.fadeColor, i),
            borderRadius: borderRadius,
            transformOrigin: 'left',
            transform: "rotate(" + degrees + "deg) translateX(" + opts.radius + "px)",
        });
        var delay = i * opts.direction / opts.lines / opts.speed;
        delay -= 1 / opts.speed; // so initial animation state will include trail
        var line = css(document.createElement('div'), {
            width: '100%',
            height: '100%',
            background: getColor(opts.color, i),
            borderRadius: borderRadius,
            boxShadow: normalizeShadow(shadows, degrees),
            animation: 1 / opts.speed + "s linear " + delay + "s infinite " + opts.animation,
        });
        backgroundLine.appendChild(line);
        el.appendChild(backgroundLine);
    }
}
function parseBoxShadow(boxShadow) {
    var regex = /^\s*([a-zA-Z]+\s+)?(-?\d+(\.\d+)?)([a-zA-Z]*)\s+(-?\d+(\.\d+)?)([a-zA-Z]*)(.*)$/;
    var shadows = [];
    for (var _i = 0, _a = boxShadow.split(','); _i < _a.length; _i++) {
        var shadow = _a[_i];
        var matches = shadow.match(regex);
        if (matches === null) {
            continue; // invalid syntax
        }
        var x = +matches[2];
        var y = +matches[5];
        var xUnits = matches[4];
        var yUnits = matches[7];
        if (x === 0 && !xUnits) {
            xUnits = yUnits;
        }
        if (y === 0 && !yUnits) {
            yUnits = xUnits;
        }
        if (xUnits !== yUnits) {
            continue; // units must match to use as coordinates
        }
        shadows.push({
            prefix: matches[1] || '',
            x: x,
            y: y,
            xUnits: xUnits,
            yUnits: yUnits,
            end: matches[8],
        });
    }
    return shadows;
}
/**
 * Modify box-shadow x/y offsets to counteract rotation
 */
function normalizeShadow(shadows, degrees) {
    var normalized = [];
    for (var _i = 0, shadows_1 = shadows; _i < shadows_1.length; _i++) {
        var shadow = shadows_1[_i];
        var xy = convertOffset(shadow.x, shadow.y, degrees);
        normalized.push(shadow.prefix + xy[0] + shadow.xUnits + ' ' + xy[1] + shadow.yUnits + shadow.end);
    }
    return normalized.join(', ');
}
function convertOffset(x, y, degrees) {
    var radians = degrees * Math.PI / 180;
    var sin = Math.sin(radians);
    var cos = Math.cos(radians);
    return [
        Math.round((x * cos + y * sin) * 1000) / 1000,
        Math.round((-x * sin + y * cos) * 1000) / 1000,
    ];
}

// 여기서 main code
var opts = {
    lines: 13, // The number of lines to draw
    length: 38, // The length of each line
    width: 17, // The line thickness
    radius: 45, // The radius of the inner circle
    scale: 1, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    speed: 1, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#ffffff', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 1px transparent', // Box-shadow for the lines
    zIndex: 2000000000, // The z-index (defaults to 2e9)
    className: 'spinner', // The CSS class to assign to the spinner
    position: 'absolute', // Element positioning
};


// var target = document.getElementById('uploading-box');
var spinner = new Spinner().spin();


function dragstart_handler(ev) {
    ev.dataTransfer.dropEffect = "move";
}
function dragover_handler(ev) {
    ev.preventDefault();
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.dropEffect = "move"
}
function drop_handler(ev) {
    ev.preventDefault();
    // 대상의 id를 가져와 이동한 대상 DOM 요소를 추가합니다.
    // Get the id of the target and add the moved element to the target's DOM
    const files = ev.dataTransfer.files;

    for (var i = 0, file; file = files[i]; i++) {
        if (!valideImageType(file)) {
            alert("유효한 파일 타입이 아닙니다.");
            return
        }
        ImageView(file);
    }

    // ev.target.appendChild(document.getElementById(data));
}



const input = document.querySelector('#uploading-box>input');
function clickUploadingBox() {
    input.click();

}

input.addEventListener('change', (ev) => {
    const image = ev.target.files[0];
    if (!valideImageType(image)) {
        alert("유효한 파일 타입이 아닙니다.");
        return;
    }
    else {
        ImageView(image);
    }
})


function ImageView(file) {
    var reader = new FileReader();
    reader.onload = function (e2) {
        var img = document.createElement('img');
        img.src = e2.target.result;
        var past_img = document.querySelector('#uploading-box>img');
        var span = document.querySelector('#uploading-box>span');
        var uploading_box = document.getElementById('uploading-box');
        try{
            uploading_box.removeChild(span);
        }catch(error){
        }
        if (past_img != null) {
            uploading_box.removeChild(past_img);
        }
        uploading_box.appendChild(img);

    }
    reader.readAsDataURL(file);
    UploadImage(file);
}



function UploadImage(file) {

    var formData = new FormData();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    formData.append('myFile', file);


    var myInit = {
        method: 'POST',
        headers: myHeaders,
        body: file
    };
    var body = document.querySelector('body');
    body.appendChild(spinner.el);
    return fetch('', myInit).then(response => response.json()).then(data => {
        body.removeChild(spinner.el)
        var imgsrc = "data:image/png;base64," + data['image'];
        var pred_box = document.querySelector('#prediction-box');
        var img = document.createElement('img');
        var past_img = document.querySelector('#prediction-box>img');
        img.src = imgsrc;
        if (past_img != null) {
            pred_box.removeChild(past_img);
        }
        pred_box.appendChild(img);

        drawGraph(data['label'],data['confidence']);
        showResultMessage(data['label'],data['confidence']);
    }).catch(error => {
        body.removeChild(spinner.el);
        alert(error);
    })


}

function showResultMessage(label,confidence){
    document.body.style.overflow = 'scroll';
    let english = ['ulcer_disease','american_serpentine_leaf_miner','leaf_mold','leaf_spot','normal','cabbageworm','Tomato_chlorosis_virus','Tomato_yellow_leaf_curl_virus','powdery_mildew'];
    let korean = ['궤양병','아메리카잎굴파리','잎곰팡이병','점무늬병','정상','청벌레','토마토퇴록바이러스','황화잎말림바이러스','흰가루병'];
    let max_val = 0;
    let max_index = 0;
    for(var i=0;i<confidence.length;i++){
        if(Number(confidence[i]) >= max_val){
            max_val = Number(confidence[i]);
            max_index = i;
        }
    }
    const isSameElement = (element) => element === label[max_index];
    const SameIndex = english.findIndex(isSameElement);
    let h1 =document.getElementById("result");
    if(korean[SameIndex] != null){
        h1.innerHTML ="질병이름 " + "<br><br>"+  korean[SameIndex];
        h1.style = "font-size:20px;";
    }else{
        h1.innerHTML ='이미지가 토마토 잎이 아닙니다.';
        h1.style = "font-size:15px;";
    }
}




function strToUtf8Bytes(str) {
    const utf8 = [];
    for (let ii = 0; ii < str.length; ii++) {
        let charCode = str.charCodeAt(ii);
        if (charCode < 0x80) utf8.push(charCode);
        else if (charCode < 0x800) {
            utf8.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
        } else if (charCode < 0xd800 || charCode >= 0xe000) {
            utf8.push(0xe0 | (charCode >> 12), 0x80 | ((charCode >> 6) & 0x3f), 0x80 | (charCode & 0x3f));
        } else {
            ii++;
            // Surrogate pair:
            // UTF-16 encodes 0x10000-0x10FFFF by subtracting 0x10000 and
            // splitting the 20 bits of 0x0-0xFFFFF into two halves
            charCode = 0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(ii) & 0x3ff));
            utf8.push(
                0xf0 | (charCode >> 18),
                0x80 | ((charCode >> 12) & 0x3f),
                0x80 | ((charCode >> 6) & 0x3f),
                0x80 | (charCode & 0x3f),
            );
        }
    }
    return utf8;
}

function valideImageType(image) {
    const result = (['image/jpeg',
        'image/png',
        'image/jpg'].indexOf(image.type) > -1);
    return result;
}










function makeDicAsNumberOfLabel(labelLength,i,confidence,label,color){
    arr = new Array(labelLength);
    arr.fill(null,0,labelLength);
    arr[i] = parseFloat(confidence)
    console.log(arr);
    var dic = {
        type: 'bar',
        label: label,
        data: arr,
        backgroundColor: color,
        borderColor:color,
        borderWidth: 1
    }
    return dic;
}





function drawGraph(label,confidence) {
    document.documentElement.scrollTop = document.body.scrollHeight;

    var result_box = document.querySelector('.result-box');
    result_box.style.visibility =  "unset";
    var chart_box = document.querySelector(".chart-box");
    var pastctx = document.getElementById('myChart');
    if(pastctx != null){
        chart_box.removeChild(pastctx);
    }

    var canvas = document.createElement('canvas');
    canvas.id = "myChart";
    canvas.chartType = "bar";
    chart_box.appendChild(canvas);
    var arra = [];
    var colors = ['Yellow','Green','Blue,','Purple','Pink','Red']
    for(var i=0;i<label.length;i++){
        arra.push(makeDicAsNumberOfLabel(label.length,i,confidence[i],label[i],colors[i]));
    }
    var ctx = document.getElementById('myChart').getContext('2d');
    ctx.height = 500;
    var myChart = new Chart(ctx, {
        data: {
            type: 'bar',
            labels: label,
            datasets: arra 
        },
        options: {
            responsive:true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }

        }
    });

}

