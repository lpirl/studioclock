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
        chimer = (date.getSeconds() == 59)?beep5:beep1;
        switch(mode) {
            case 0:
                return null;
            case 1:
                return (date.getMinutes() == 59)?chimer:null;
            case 2:
                return ((date.getMinutes()%30) == 29)?chimer:null;
            case 3:
                return ((date.getMinutes()%15) == 14)?chimer:null;
            case 4:
                return chimer;
        }
    }

    function setChimeMode(newmode) {
        mode = Number(newmode);
        setMode(mode);
        for (var i=0; i<5; i++) {
            var cm = document.getElementById("chimeMode"+i);
            cm.style.fontWeight = (i==mode)?"bold":"normal";
            cm.style.backgroundColor = (i==mode)?"rgb(80, 40, 40)":"rgb(40, 40, 40)";
        }
    }

    function attachChimeHandler(n){
          var handler = function() { setChimeMode(n); };
          document.getElementById("chimeMode"+n).onclick = handler;
    }

    chiming.onmouseover = function() {
        chimebtn.style.visibility = 'visible';
    };
    chiming.onmouseout = function() {
        chimebtn.style.visibility = 'hidden';
    };
    chiming.onmouseover();
    setTimeout(chiming.onmouseout, 10000);
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
    //Initialize chiming buttons
    setChimeMode(getMode());
    //return the shouldChime public function
    return shouldChime;
}
