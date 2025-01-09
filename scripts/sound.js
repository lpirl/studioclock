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
    let schedulingTimeout = null;
    let soundTimeouts = [];

    function newOffsetDate(){
        return new Date(Date.now() + offset);
    }

    this.setOffset = function(newOffset){
        offset = newOffset;
        rescheduleSounds();
    };

    function rescheduleSounds(){

        // cancel what is currently scheduled
        futuremostDate = 0;
        clearTimeout(schedulingTimeout);
        for (let i = 0; i < soundTimeouts.length; i++) {
            clearTimeout(soundTimeouts.pop());
        }

        const interval = getInterval();
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
            case 'TenMinutes':
                beforeMinuteModulo = 10;
                break;
            case 'FiveMinutes':
                beforeMinuteModulo = 5;
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

    async function getPlayable(name) {
        return new Promise(function(resolve, reject) {
            let audio = new Audio('assets/' + name + '.ogg');
            audio.addEventListener("loadeddata", function(){
                let playable = function(){ audio.play(); };
                playable.duration = audio.duration;
                resolve(playable);
            });
        });
    }

    async function scheduleBeeps(beforeMinuteModulo) {
        const short = await getPlayable('beep-short');
        const long = await getPlayable('beep-long');
        scheduleSound(short, 57, beforeMinuteModulo);
        scheduleSound(short, 58, beforeMinuteModulo);
        scheduleSound(short, 59, beforeMinuteModulo);
        scheduleSound(long, 60, beforeMinuteModulo);
    }

    async function scheduleTalks(beforeMinuteModulo) {
        const digits = newOffsetDate()
            .addMinutes(1)  // future minute to announce
            .toTimeString() // get time in uniform format
            .split(':')     // split by h/m/s separator
            .slice(0, 2)    // get hours and minutes only
            .join('')       // joint to a single string of four digits
            .split('')      // make an array with four digits as strings
            .reverse();     // need to be scheduled backwards

        finishAt = 59.5;
        for (let i = 0; i < digits.length; i++) {
            let playable = await getPlayable(digits[i]);
            finishAt -= playable.duration;
            scheduleSound(playable, finishAt, beforeMinuteModulo);
        }

        scheduleSound(await getPlayable('now'), 60, beforeMinuteModulo);
    }


    function scheduleSound(func, atSecond, beforeMinuteModulo=null){
        const when = newOffsetDate();

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

        const timeout = when - newOffsetDate();
        if (timeout < 0) {
            console.warn('cannot schedule sound for the past, ignoring');
            return;
        }
        soundTimeouts.push(setTimeout(func, timeout));

        if (when > futuremostDate) {
            clearTimeout(schedulingTimeout);
            futuremostDate = when;
            /* scheduling the rescheduling one second after the former
             * is enough for this application, disturbs sound playback
             * less, and is easier to cancel */
            schedulingTimeout = setTimeout(rescheduleSounds,
                                           timeout + 1000);
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
