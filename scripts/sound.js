Date.prototype.clearSeconds = function() {
    this.setSeconds(0, 0);
    return this;
}

Date.prototype.addMillis = function(millis) {
    this.setTime(this.getTime() + millis);
    return this;
}

Date.prototype.addSeconds = function(seconds) {
    this.addMillis(seconds * 1000);
    return this;
}

Date.prototype.addMinutes = function(minutes) {
    this.addSeconds(minutes * 60);
    return this;
}

function ClockSound(getInterval, setInterval, getType, setType) {
    const soundIntervals = [
      'Off',
      'Hour',
      'HalfHour',
      'QuarterHour',
      'Minute',
    ];
    const soundTypes = [
      'Beep',
      'Talk',
    ];

    const soundbtn = document.getElementById('soundbtn');
    const soundsetup = document.getElementById('soundsetup');

    let offset = 0;
    let futuremostDate = 0;
    let futuremostTimeout = null;
    let soundTimeouts = [];

    function newOffsetDate(){
        return new Date(Date.now() + offset);
    }

    this.setOffset = function(newOffset){
        offset = newOffset;
        rescheduleSounds();
    };

    function rescheduleSounds(){

        clearTimeout(futuremostTimeout);
        for (let i = 0; i < soundTimeouts.length; i++) {
            clearTimeout(soundTimeouts.shift());
        }

        let interval = getInterval();
        let beforeMinuteModulo = 0;
        switch(interval) {
            case 'Off':
                return;
            case 'Hour':
                beforeMinuteModulo = 60;
                break;
            case 'HalfHour':
                beforeMinuteModulo = 30;
                break;
            case 'QuarterHour':
                beforeMinuteModulo = 15;
                break;
            case 'Minute':
                beforeMinuteModulo = null;
                break;
            default:
                console.error('unexpected interval:', interval);
        }
        switch (getType()) {
            case 'Beep':
                scheduleBeeps(beforeMinuteModulo);
                break;
            case 'Talk':
                scheduleTalks(beforeMinuteModulo);
                break;
            default:
                console.error('unexpected sound type:', type);
        };
    }

    function getAudio(name, readyCallback=function(){}){
        /* no caching here, because same audio cannot be played with
         * overlap, which can happen in times with duplicated digits */
        let audio = new Audio('assets/' + name + '.ogg');
        audio.addEventListener("loadeddata", function(){
            readyCallback(audio);
        });
    };

    function scheduleBeeps(beforeMinuteModulo) {
        function scheduleBeep(name, atSecond){
            getAudio(name, function(audio){
                scheduleSound(
                    function(){ audio.play(); },
                    atSecond,
                    beforeMinuteModulo
                )

            });
        };
        scheduleBeep('beep-short', 57);
        scheduleBeep('beep-short', 58);
        scheduleBeep('beep-short', 59);
        scheduleBeep('beep-long', 60);
    }

    function scheduleTalks(beforeMinuteModulo) {
        let digits = newOffsetDate()
            .addMinutes(1)  // future minute to announce
            .toTimeString() // get time in uniform format
            .split(':')     // split by h/m/s separator
            .slice(0, 2)    // get hours and minutes only
            .join('')       // joint to a single string of four digits
            .split('');     // make an array with four items

        // digits can only be scheduled one after the other, because
        // metadata must be loaded to get the timing right
        function scheduleDigits(digits, finishAt){
            getAudio(digits.pop(), function(audio){
                finishAt -= audio.duration;
                scheduleSound(
                    function(){ audio.play(); },
                    finishAt,
                    beforeMinuteModulo
                );
                if (digits.length > 0) {
                    scheduleDigits(digits, finishAt);
                }
            });
        };
        scheduleDigits(digits, 59.5);

        getAudio('now', function(audio){
            scheduleSound(
                function(){ audio.play(); },
                60,
                beforeMinuteModulo
            );
        });
    }


    function scheduleSound(func, atSecond, beforeMinuteModulo=null){
        let when = newOffsetDate();

        when.setSeconds(Math.floor(atSecond));
        when.setMilliseconds(1000 * atSecond % 1000);
        if (when < newOffsetDate()) {
            when.addMinutes(1);
        }

        if (beforeMinuteModulo != null) {
            atMinute = beforeMinuteModulo *
                Math.floor(when.getMinutes() / beforeMinuteModulo + 1);
            if (atMinute == 0) {
                atMinute = 60;
            }
            when.setMinutes(atMinute - 1);
        }

        let timeout = when - newOffsetDate();
        if (timeout < 0) {
            console.warn('cannot schedule sound for the past, ignoring');
            return;
        }
        soundTimeouts.push(setTimeout(func, timeout));

        if (when > futuremostDate) {
            futuremostDate = when;
            clearTimeout(futuremostTimeout);
            /* creating a new schedule one second after the former is
             * enough and disturbs sound playback less */
            futuremostTimeout = setTimeout(rescheduleSounds, timeout + 1000);
        }
    }

    function changeOption(setFunc, newVal, allVal, IdPrefix) {
        setFunc(newVal);
        for (let i = 0; i < allVal.length; i++) {
            let val = allVal[i];
            let el = document.getElementById(IdPrefix + val);
            if (val == newVal) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        }
        rescheduleSounds();
    }

    for (let i = 0; i < soundIntervals.length; i++) {
        let interval = soundIntervals[i];
        document.getElementById(
            'soundInterval' + interval
        ).addEventListener('click', function() {
            changeOption(
                setInterval,
                interval,
                soundIntervals,
                'soundInterval',
            );
        });
    }

    for (let i = 0; i < soundTypes.length; i++) {
        let type = soundTypes[i];
        document.getElementById(
            'soundType' + type
        ).addEventListener('click', function(ev) {
            changeOption(
                setType,
                type,
                soundTypes,
                'soundType',
            );
        });
    }

    soundbtn.addEventListener('click', function(ev) {
        soundsetup.style.visibility = 'visible';
        ev.stopPropagation();
    });

    window.addEventListener('click', function() {
        soundsetup.style.visibility = 'hidden';
    });

    // initialize buttons
    changeOption(setInterval, getInterval(), soundIntervals, 'soundInterval');
    changeOption(setType, getType(), soundTypes, 'soundType');

    return this;
}
