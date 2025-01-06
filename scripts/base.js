/* for customizations, consider using ``local.js`` */

'use strict';
var offset = 0;
var settings = {
    soundInterval: 0,
    bgcolor: getValueFromCssRootVar('--background-color'),
    oncolor: getValueFromCssRootVar('--led-on-color'),
    offcolor: getValueFromCssRootVar('--led-off-color'),
    autosync: true
};
var clk;
var shouldSound = function() { return null; };
var onlinesync = onlineSync();

function getValueFromCssRootVar(varName) {
    return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
}

function resizeHandler() {
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;
    var shorterEdge = Math.min(viewportWidth, viewportHeight);
    var logoContainer = document.getElementById('logo-container');
    logoContainer.style.width = shorterEdge + "px";
    logoContainer.style.height = shorterEdge + "px";
    var clock = document.getElementById('clock');
    clock.width = shorterEdge;
    clock.height = shorterEdge;
}

function optionHandlers(clock) {
    var menu = document.getElementById('menu');
    var menubtn = document.getElementById('menubtn');
    var menupopup = document.getElementById('menupopup');

    menu.onmouseover = function() {
      menubtn.style.visibility = 'visible';
    };
    menu.onmouseout = function() {
      menubtn.style.visibility = 'hidden';
    };
    menu.onmouseover();
    setTimeout(menu.onmouseout, 10000);
    menubtn.onclick = function(ev) {
      menupopup.style.visibility = 'visible';
      ev.stopPropagation();
    };
    window.addEventListener('click', function() {
      menupopup.style.visibility = 'hidden';
    });
    menupopup.onclick = function(ev) {
        ev.stopPropagation();
    };
    var oncolor = document.getElementById('oncolor');
    oncolor.value = settings.oncolor;
    clock.led_on = settings.oncolor;
    oncolor.oninput = function() {
        document.documentElement.style.setProperty('--led-on-color',
                                                   oncolor.value);
        settings.oncolor = oncolor.value;
        clock.led_on = oncolor.value;
    };
    var offcolor = document.getElementById('offcolor');
    offcolor.value = settings.offcolor;
    clock.led_off = settings.offcolor;
    offcolor.oninput = function() {
        document.documentElement.style.setProperty('--led-off-color',
                                                   offcolor.value);
        settings.offcolor = offcolor.value;
        clock.led_off = offcolor.value;
    };
    var bgcolor = document.getElementById('bgcolor');
    bgcolor.value = settings.bgcolor;
    clock.background = settings.bgcolor;
    bgcolor.oninput = function() {
        document.documentElement.style.setProperty('--background-color',
                                                   bgcolor.value);
        settings.bgcolor = bgcolor.value;
        clock.background = bgcolor.value;
    };
    const logoImgs = document.getElementsByClassName('logo');
    const logoReader = new FileReader();
    logoReader.onload = function () {
        for (let i = 0; i < logoImgs.length; i++) {
            logoImgs[i].src = logoReader.result;
            logoImgs[i].style.visibility = 'visible';
        }
    }
    var logoInput = document.getElementById('logo');
    logoInput.oninput = function() {
        logoReader.readAsDataURL(logo.files[0]);
    };
    var autosync = document.getElementById('autosync');
    autosync.checked = settings.autosync;
    onlinesync(autosync.checked);
    autosync.onchange = function() {
        settings.autosync = autosync.checked;
        onlinesync(autosync.checked);
    };
    var reset = document.getElementById('reset');
    reset.onclick = function(){
        location.reload()
    };
}

function update() {
    clk.time = new Date(Date.now() + offset);
    setTimeout(update, 1000 - clk.time.getMilliseconds());
    clk.draw();
    try {shouldSound(clk.time).play();} catch {};
}

window.addEventListener('resize', function() {
    resizeHandler();
    if (typeof clk !== 'undefined') {
        clk.draw();
    }
});

window.addEventListener('dblclick', function() {
    if (!window.screenTop && !window.screenY) {
        document.exitFullscreen();
    }
    else {
        document.documentElement.requestFullscreen();
    }
});

window.addEventListener('load', function() {
    var canvas = document.getElementById('clock');
    resizeHandler();
    clk = new LEDclock(canvas.getContext('2d'));
    shouldSound = soundSetup(
        function(){ return settings.soundInterval; },
        function(interval){ settings.soundInterval = interval; },
    );
    optionHandlers(clk);
    update();
});

(function(){
    var mouseTimer = null;
    var cursorVisible = true;
    function onMouseMove(){
        if (mouseTimer) {
            window.clearTimeout(mouseTimer);
        }
        if (!cursorVisible) {
            document.body.style.cursor = 'default';
            cursorVisible = true;
        }
        mouseTimer = window.setTimeout(function() {
            document.body.style.cursor = 'none';
            mouseTimer = null;
            cursorVisible = false;
        }
        , 3000);
    };
    window.addEventListener('load', onMouseMove);
    document.addEventListener('mousemove', onMouseMove);
})();
