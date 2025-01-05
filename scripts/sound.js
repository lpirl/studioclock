function soundSetup(getInterval, setInterval) {
    const soundIntervals = [
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
        var interval = getInterval();
        if (interval === 0) return null;
        sound = (date.getSeconds() == 59) ? beepLong : beepShort;
        switch(interval) {
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

    function setSoundInterval(newInterval) {
        setInterval(newInterval);
        for (let i = 0; i < soundIntervals.length; i++) {
            var interval = soundIntervals[i];
            var id = 'soundInterval' + interval;
            var el = document.getElementById(id);
            if (interval == newInterval) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        }
    }

    function attachSoundHandler(n){
          var handler = function() { setSoundInterval(n); };
          document.getElementById('soundInterval' + n).onclick = handler;
    }

    soundbtn.onclick = function(ev) {
        soundsetup.style.visibility = 'visible';
        ev.stopPropagation();
    };
    window.addEventListener('click', function() {
        soundsetup.style.visibility = 'hidden';
    });
    for (let i = 0; i < soundIntervals.length; i++) {
        attachSoundHandler(soundIntervals[i]);
    }
    //Initialize sound soundbtnbuttons
    setSoundInterval(getInterval());
    //return the shouldSound public function
    return shouldSound;
}
