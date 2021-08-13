function chimerSetup(getMode, setMode) {
    var beep1 = new Audio("assets/beep1.ogg");
    var beep5 = new Audio("assets/beep5.ogg");
    var chiming = document.getElementById("chiming");
    var chimebtn = document.getElementById("chimebtn");
    var chimesetup = document.getElementById("chimesetup");

    function shouldChime(date) {
        if (date.getSeconds() < 56 ) return null;
        var mode = getMode();
        if (mode === 0) return null;
        chimer = (date.getSeconds() == 59) ? beep5 : beep1;
        switch(mode) {
            case 0:
                return null;
            case 1:
                return (date.getMinutes() == 59) ? chimer : null;
            case 2:
                return ((date.getMinutes() % 30) == 29) ? chimer : null;
            case 3:
                return ((date.getMinutes() % 15) == 14) ? chimer : null;
            case 4:
                return chimer;
        }
    }

    function setChimeMode(newmode) {
        mode = Number(newmode);
        setMode(mode);
        for (var i=0; i<5; i++) {
            var cm = document.getElementById("chimeMode" + i);
            if (i == mode) {
                cm.classList.add("active");
            } else {
                cm.classList.remove("active");
            }
        }
    }

    function attachChimeHandler(n){
          var handler = function() { setChimeMode(n); };
          document.getElementById("chimeMode"+n).onclick = handler;
    }

    chimebtn.onclick = function(ev) {
        chimesetup.style.visibility = 'visible';
        ev.stopPropagation();
    };
    window.addEventListener('click', function() {
        chimesetup.style.visibility = 'hidden';
    });
    for (var i=0; i<5; i++) {
        attachChimeHandler(i);
    }
    //Initialize chiming chimebtnbuttons
    setChimeMode(getMode());
    //return the shouldChime public function
    return shouldChime;
}
