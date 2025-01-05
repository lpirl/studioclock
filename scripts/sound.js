function soundSetup(getMode, setMode) {
    const soundModes = [
      'Off',
      'Hour',
      'HalfHour',
      'QuarterHour',
      'Minute'
    ];
    var beepShort = new Audio('assets/beep-short.ogg');
    var beepLong = new Audio('assets/beep-long.ogg');
    var sound = document.getElementById('sound');
    var soundbtn = document.getElementById('soundbtn');
    var soundsetup = document.getElementById('soundsetup');

    function shouldSound(date) {
        if (date.getSeconds() < 56 ) return null;
        var mode = getMode();
        if (mode === 0) return null;
        sound = (date.getSeconds() == 59) ? beepLong : beepShort;
        switch(mode) {
            case 'Off':
                return null;
            case 'Hour':
                return (date.getMinutes() == 59) ? sound : null;
            case 'HalfHour':
                return ((date.getMinutes() % 30) == 29) ? sound : null;
            case 'QuarterHour':
                return ((date.getMinutes() % 15) == 14) ? sound : null;
            case 'Minute':
                return sound;
        }
    }

    function setsoundMode(newMode) {
        setMode(newMode);
        for (let i = 0; i < soundModes.length; i++) {
            var mode = soundModes[i];
            var id = 'soundMode' + mode;
            var el = document.getElementById(id);
            if (mode == newMode) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        }
    }

    function attachsoundHandler(n){
          var handler = function() { setsoundMode(n); };
          document.getElementById('soundMode' + n).onclick = handler;
    }

    soundbtn.onclick = function(ev) {
        soundsetup.style.visibility = 'visible';
        ev.stopPropagation();
    };
    window.addEventListener('click', function() {
        soundsetup.style.visibility = 'hidden';
    });
    for (let i = 0; i < soundModes.length; i++) {
        attachsoundHandler(soundModes[i]);
    }
    //Initialize sound soundbtnbuttons
    setsoundMode(getMode());
    //return the shouldSound public function
    return shouldSound;
}
