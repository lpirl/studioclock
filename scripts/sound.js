Date.prototype.clearSeconds = function() {
    this.setSeconds(0, 0);
    return this;
}

Date.prototype.addSeconds = function(seconds) {
    this.setTime(this.getTime() + (seconds * 1000));
    return this;
}

Date.prototype.addMinutes = function(minutes) {
    this.addSeconds(minutes * 60);
    return this;
}

Date.prototype.addHours = function(hours) {
    this.addMinutes(hours * 60);
    return this;
}

//~ Date.prototype.setNextMinute = function() {
    //~ this.clearSeconds().addMinutes(1);
    //~ return this;
//~ }

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
    const beepShort = new Audio('assets/beep-short.ogg');
    const beepLong = new Audio('assets/beep-long.ogg');
    const soundbtn = document.getElementById('soundbtn');
    const soundsetup = document.getElementById('soundsetup');
    var date = new Date();
    var schedule = [];

    function fillScheduleBeep(interval) {
        //~ switch(date.getSeconds()) {
            //~ case 57:
                //~ nextBeep = beepShort;
                //~ break;
            //~ case 58:
                //~ nextBeep = beepShort;
                //~ break;
            //~ case 59:
                //~ nextBeep = beepShort;
                //~ break;
            //~ case 00:
                //~ nextBeep = beepLong;
                //~ break;
            //~ default:
                //~ return;
        //~ }
        switch(interval) {
            case 'Hour':
                if (date.getMinutes() == 59) {
                    return nextBeep;
                }
                break;
            case 'HalfHour':
                if ((date.getMinutes() % 30) == 29) {
                    return nextBeep;
                }
                break;
            case 'QuarterHour':
                15-(31%15)
                if ((date.getMinutes() % 15) == 14) {
                    return nextBeep;
                }
                break;
            case 'Minute':
                pushSchedule('beep-short.ogg', 57);
                pushSchedule('beep-short.ogg', 58);
                pushSchedule('beep-short.ogg', 59);
                pushSchedule('beep-long.ogg', 00);
                break;
            default:
                console.error('unexpected interval:', interval);
        }
    }

    function fillScheduleTalkToPlay(date, interval) {
        console.log("to do: schedule audio");
    }

    function pushSchedule(path, modSecond, modMinute=null, modHour=null){
        // mod* parameters schedule to next second/minute/hour that
        // matches the modulus. E.g., modMinute=15 matches 0, 15, 30, 45.
        let when = new Date(date);
        const audioCache = {};

        if (modSecond == 0){
            modSecond = 60;
        }
        when.addSeconds(modSecond - (when.getSeconds() % modSecond));

        if (modMinute != null) {
            when.addMinutes(modMinute - (when.getMinutes() % modMinute));
        }

        if (modHour != null) {
            when.addHours(modHour - (when.getHours() % modHour));
        }

        if (!audioCache[path]) {
            audioCache[path] = new Audio('assets/' + path);
        }

        schedule.push([when, function(){ audioCache[path].play(); }]);
    }

    function fillSchedule(){
        var interval = getInterval();
        if (interval == 'Off') {
            return;
        }
        switch (getType()) {
            case 'Beep':
                fillScheduleBeep(interval);
                break;
            case 'Talk':
                fillScheduleTalk(interval);
                break;
            default:
                console.error('unexpected type:', type);
        };
    }

    function processSchedule(){
        while (1) {
            if (schedule.length == 0) {
                break;
            }
            let delay = date.getTime() - schedule[0][0].getTime();
            if (delay < 0) {
                // next item to be played in the future
                break;
            }
            let oldest = schedule.shift();
            if (delay > 500) {
                console.warn(
                    "missed executing", oldest[1], "at", oldest[0]
                );
                continue;
            }
            oldest[1]();
        }
    };

    this.tick = function(newDate) {
        date = newDate;
        if (schedule.length == 0){
            fillSchedule();
        }
        processSchedule();
    }

    function changeOption(setFunc, newVal, allVal, IdPrefix) {
        setFunc(newVal);
        for (let i = 0; i < allVal.length; i++) {
            var val = allVal[i];
            var el = document.getElementById(IdPrefix + val);
            if (val == newVal) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        }
    }

    for (let i = 0; i < soundIntervals.length; i++) {
        var interval = soundIntervals[i];
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
        var type = soundTypes[i];
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
}
