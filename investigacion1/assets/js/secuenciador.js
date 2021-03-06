
var kick = new Howl({
    src: ['./assets/sonidos/kick.wav']
  });

var snare = new Howl({
    src: ['./assets/sonidos/snare.wav']
  });
var piano = new Howl({
    src: ['./assets/sonidos/piano.mp3']
  });

var sonido_mute = new Howl({
    src: ['./assets/sonidos/mute.wav'], volume: 0
  });


var loop = true;
var detenido = false;
var beatlist = {};
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

function getRndColor() {
    var r = 230*Math.random()|60,
        g = 230*Math.random()|60,
        b = 230*Math.random()|60;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
};

function obtiene_beatlist(){
    var filas = document.getElementsByTagName("tr");
    beatlist = {};
    for(var i=2; i<18; i++){
        beatlist[i] = [];
        if(filas[1].cells[i].className.includes('on')){
            beatlist[i].push(kick);
        } else{
            beatlist[i].push(sonido_mute);
        };
        if(filas[2].cells[i].className.includes('on')){
            beatlist[i].push(snare);
        } else{
            beatlist[i].push(sonido_mute);
        };
        if(filas[3].cells[i].className.includes('on')){
            beatlist[i].push(piano);
        } else{
            beatlist[i].push(sonido_mute);
        };
    };
};

function valida_BPM() {
    var x = document.getElementById("BPM").value;
    if(x>180){
        alert('BPM mayor que 180');
        document.getElementById("BPM").value = null;
        return false;
    } else if (x<80){
        alert('BPM menor que 80');
        document.getElementById("BPM").value = null;
        return false;
    } else {
        return true;
    }
};

$( "td.beat" ).click(function() {
    if (this.className.includes('on')){
        this.classList.remove('on');
        this.style.backgroundColor ="";
    } else {
        this.classList.add("on");
        this.style.backgroundColor = "rgb(255, 23, 93)";
    }
    obtiene_beatlist();
});

function reproduce_beatlist(i){
    beatlist[i][0].play();
    beatlist[i][1].play();
    beatlist[i][2].play();
};

function botonLoop(){
    if (loop){
        loop = false;
        alert(loop);
    } else{
        loop = true;
        alert(loop);
    }
};

function botonStop(){
    detenido = true;
};

function botonClear(){
    var clear_beats = document.getElementsByClassName('beat');
    for(var i=0; i < clear_beats.length; i++){
        if (clear_beats[i].className.includes('on')){
            clear_beats[i].classList.remove('on');
            clear_beats[i].style.backgroundColor ="";
        };
    };
    obtiene_beatlist();
    context.clearRect(0, 0, canvas.width, canvas.height);
};

function botonPlay() {
    var x = document.getElementById("BPM").value;

    if(x && valida_BPM()){
        duracion = ((16*60)/(x*4))*1000;
        duracion_1_beat = duracion/16;
        var tiempo_transcurrido = 0;
        var i = 2;

        function accionPlay() {
            reproduce_beatlist(i);

            if(kick.playing() || snare.playing() || piano.playing()){
                var radio = (Math.random()*(120-5));
                context.beginPath();
                context.arc((canvas.width*Math.random()|0), (canvas.height*Math.random()|0), radio, 0, 2 * Math.PI);
                context.fillStyle = getRndColor();
                context.fill();
            }

            i += 1;
            tiempo_transcurrido += duracion_1_beat;
            if(detenido){
                detenido = false;
                return null;
            } else{
                if (loop){
                    if(i ==18){
                        i=2;
                    };
                    setTimeout(accionPlay, duracion_1_beat);
                } else{
                    if (tiempo_transcurrido >= duracion){
                        return null;
                    } else{
                        setTimeout(accionPlay, duracion_1_beat);
                    }
                }
            }
        };
        accionPlay();
    }else{
        alert('Ingrese un BPM');
    }
};

$( ".mute" ).change(function() {
    var instrumento = this.parentElement.parentElement.getAttribute('id');
    if (instrumento == 'bombo' && this.value == 'on'){
        kick.volume(0);
        this.value = 'off';
    } else{
        kick.volume(1);
        this.value = 'on';
    }
});

function checkbox_init(){
    var checkboxes = document.getElementsByClassName('mute');
    for(var i=0; i<checkboxes.length; i++){
        checkboxes[i].id = 'off';
    }
};
checkbox_init();

$( ".mute" ).click(function() {
    var instrumento = this.parentElement.parentElement.getAttribute('id');
    if (instrumento == 'bombo'){
        if (this.id == 'on'){
            kick.volume(1);
            this.id = 'off';
        } else{
            kick.volume(0);
            this.id = 'on';
        }
    }
    if (instrumento == 'bolillo'){
        if (this.id == 'on'){
            snare.volume(1);
            this.id = 'off';
        } else{
            snare.volume(0);
            this.id = 'on';
        }
    }
    if (instrumento == 'piano'){
        if (this.id == 'on'){
            piano.volume(1);
            this.id = 'off';
        } else{
            piano.volume(0);
            this.id = 'on';
        }
    }
});
