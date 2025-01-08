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

    // go on here and adapt implementation to the following variables:
    var offset = 0;
    var scheduleDate = 0;
    var scheduleTimeout = null;
    var soundTimeouts = [];

    function newOffsetDate(){
        return new Date(Date.now() + offset);
    }

    this.setOffset = function(newOffset){
        offset = newOffset;
        rescheduleSounds();
    };

    function rescheduleSounds(){
        for (let i = 0; i < soundTimeouts.length; i++) {
            clearTimeout(soundTimeouts.shift());
        }
        scheduleSounds();
    };

    function scheduleSounds(){
        var interval = getInterval();
        if (interval == 'Off') {
            return;
        }
        switch (getType()) {
            case 'Beep':
                scheduleBeeps(interval);
                break;
            case 'Talk':
                scheduleTalks(interval);
                break;
            default:
                console.error('unexpected interval type:', type);
        };
    }

    function getPlayable(name){
        const cache = {};
        if (!cache[name]) {
            cache[name] = new Audio('assets/' + name + '.ogg');
        }
        return function (){ cache[name].play(); };
    };

    function scheduleBeeps(interval) {
        function _scheduleBeeps(matchMinuteModulo=null){
            scheduleSound(getPlayable('beep-short'), 57, matchMinuteModulo);
            scheduleSound(getPlayable('beep-short'), 58, matchMinuteModulo);
            scheduleSound(getPlayable('beep-short'), 59, matchMinuteModulo);
            scheduleSound(getPlayable('beep-long'), 00, matchMinuteModulo);
        };
        switch(interval) {
            case 'Hour':
                _scheduleBeeps(60);
                break;
            case 'HalfHour':
                _scheduleBeeps(30);
                break;
            case 'QuarterHour':
                _scheduleBeeps(15);
                break;
            case 'Minute':
                _scheduleBeeps();
                break;
            default:
                console.error('unexpected interval:', interval);
        }
    }

    function scheduleTalks(date, interval) {
        console.log("to do: schedule audio");
    }

    function scheduleSound(func, matchSecond, matchMinuteModulo=null){
        let when = newOffsetDate();

        if (matchSecond == 0) {
            matchSecond = 60;
        }
        if (matchSecond < when.getSeconds()) {
            matchSecond += 60;
        }
        when.setSeconds(matchSecond);

        if (matchMinuteModulo != null) {
            nextMinuteMatch = matchMinuteModulo *
                Math.floor(when.getMinutes() / matchMinuteModulo + 1);
            if (nextMinuteMatch == 0) {
                nextMinuteMatch = 60;
            }
            if (nextMinuteMatch < when.getMinutes()) {
                nextMinuteMatch += 60;
            }
            when.setMinutes(nextMinuteMatch)
        }

        let timeout = when - newOffsetDate();
        if (timeout < 0) {
            console.warn('cannot schedule sound for the past, ignoring');
            return;
        }
        soundTimeouts.push(setTimeout(func, timeout));

        if (when > scheduleDate) {
            clearTimeout(scheduleTimeout);
            setTimeout(scheduleSounds, timeout);
            scheduleDate = when;
        }
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
        rescheduleSounds();
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

    return this;
}
