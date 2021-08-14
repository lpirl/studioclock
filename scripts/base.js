/* for customizations, consider using ``local.js`` */

'use strict';
var offset = 0;
var settings = {
    chimeMode: 0,
    bgcolor: getValueFromCssRootVar('--background-color'),
    oncolor: getValueFromCssRootVar('--led-on-color'),
    offcolor: getValueFromCssRootVar('--led-off-color'),
    autosync: true
};
var clk;
var shouldChime = function() { return null; };
var onlinesync = onlineSync();

function getValueFromCssRootVar(varName) {
    return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
}

function resizeCanvas() {
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;
    var diameter = Math.min(viewportWidth, viewportHeight);
    var canvasdiameter = 1.00 * diameter;
    var canvas = document.getElementById('clock');
    canvas.setAttribute('width', canvasdiameter);
    canvas.setAttribute('height', canvasdiameter);
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
        settings.oncolor = oncolor.value;
        clock.led_on = oncolor.value;
    };
    var offcolor = document.getElementById('offcolor');
    offcolor.value = settings.offcolor;
    clock.led_off = settings.offcolor;
    offcolor.oninput = function() {
        settings.offcolor = offcolor.value;
        clock.led_off = offcolor.value;
    };
    var bgcolor = document.getElementById('bgcolor');
    bgcolor.value = settings.bgcolor;
    clock.background = settings.bgcolor;
    bgcolor.oninput = function() {
        settings.bgcolor = bgcolor.value;
        clock.background = bgcolor.value;
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
    var localnow = new Date().getTime();
    clk.time = new Date(localnow + offset);
    var ms = clk.time.getMilliseconds();
    setTimeout(update, 1000 - ms);
    var ch = shouldChime(clk.time);
    if (ch !== null ) {
      var to = (ms<900)? (900 - ms):0;
      setTimeout(function (){ ch.play(); }, to);
    }
    clk.draw();
}

window.addEventListener('resize', function() {
    resizeCanvas();
    if (typeof clk !== 'undefined') {
        clk.draw();
    }
});

window.addEventListener('load', function() {
    var canvas = document.getElementById('clock');
    resizeCanvas();
    clk = new LEDclock(canvas.getContext('2d'));
    shouldChime = chimerSetup(
        function(){ return settings.chimeMode; },
        function(mode){ settings.chimeMode = mode; },
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
