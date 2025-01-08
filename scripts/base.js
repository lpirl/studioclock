/* for customizations, consider using ``local.js`` */

'use strict';
var offset = 0;
const uiTimeout = 5000;
var settings = {
    soundInterval: 'Off',
    soundType: 'Beep',
    bgcolor: getValueFromCssRootVar('--background-color'),
    oncolor: getValueFromCssRootVar('--led-on-color'),
    offcolor: getValueFromCssRootVar('--led-off-color'),
    autosync: true
};
var clk;
var snd;
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
    setTimeout(menu.onmouseout, uiTimeout);
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

    var sound = document.getElementById('sound');
    var soundbtn = document.getElementById('soundbtn');
    var soundpopup = document.getElementById('soundpopup');

    sound.onmouseover = function() {
      soundbtn.style.visibility = 'visible';
    };
    sound.onmouseout = function() {
      soundbtn.style.visibility = 'hidden';
    };
    sound.onmouseover();
    setTimeout(sound.onmouseout, uiTimeout);

    // move option handling for sound here
}

window.addEventListener('resize', function() {
    resizeHandler();
    if (typeof clk !== 'undefined') {
        clk.draw();
    }
});

function getFullscreenByClickOrTouchHandler(){
    // attached to click and tap events to detect double-taps as well
    const maxDelay = 500;
    let previous = 0;
    return function detectDoubleClick(event) {
      const current = Date.now();
      if (current - previous < maxDelay) {
        event.preventDefault();
        if (window.innerHeight == screen.height &&
            window.innerWidth == screen.width) {
            document.exitFullscreen();
        }
        else {
            document.documentElement.requestFullscreen();
        }
      }
      previous = current;
    };
}
window.addEventListener('click', getFullscreenByClickOrTouchHandler())
window.addEventListener('touchend', getFullscreenByClickOrTouchHandler())

window.addEventListener('load', function() {
    var canvas = document.getElementById('clock');
    resizeHandler();
    clk = new LEDclock(canvas.getContext('2d'));
    snd = new ClockSound(
        function(){ return settings.soundInterval; },
        function(interval){ settings.soundInterval = interval; },
        function(){ return settings.soundType; },
        function(type){ settings.soundType = type; },
    );
    optionHandlers(clk);
    tick();
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
        , uiTimeout);
    };
    window.addEventListener('load', onMouseMove);
    document.addEventListener('mousemove', onMouseMove);
})();
